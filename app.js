// ─────────────────────────────────────────────────────────────
//  app.js  —  Character Picker  (Phase 2: Firebase Realtime DB)
// ─────────────────────────────────────────────────────────────

let claims         = {};          // { char_id: "player name" }
let characterNames = {};          // { char_id: "chosen character name" }
let currentUsername = localStorage.getItem('rpg_username') || null;

// In-session use tracking (resets on page refresh — intentional)
let stuntUses = {};   // { "char_1_stunt_0": 1 }
let itemUses  = {};   // { "char_1_item_0":  2 }

const db                = firebase.database();
const claimsRef         = db.ref('claims');
const characterNamesRef = db.ref('characterNames');

// ─── Lookup maps ──────────────────────────────────────────────

const STAT_ICONS = {
    Might: '⚔️', Agility: '🏃', Endurance: '🛡️',
    Wits:  '🧠', Presence: '💬', Insight: '👁️'
};

const ITEM_ICONS = {
    weapon: '⚔️', shield: '🛡️', consumable: '🧪', gear: '🎒'
};

// ─── Pure utilities ───────────────────────────────────────────

function statRating(val) {
    return val >= 0 ? `+${val}` : `${val}`;
}

// Defense = 10 + Agility + sum of all shield defenseBonus values
function calcDefense(char) {
    const shieldBonus = (char.items || [])
        .filter(i => i.type === 'shield')
        .reduce((sum, i) => sum + (i.defenseBonus || 0), 0);
    return 10 + char.stats.Agility + shieldBonus;
}

function buildPortraitHTML(char, size = 'card') {
    if (char.image) {
        const styleAttr = size === 'modal'
            ? 'style="width:100%;height:340px;object-fit:cover;object-position:center top;display:block;"'
            : '';
        return `
            <img src="${char.image}"
                 alt="Portrait"
                 ${styleAttr}
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="icon-fallback" style="display:none">${char.icon}</div>`;
    }
    return `<div class="icon-fallback">${char.icon}</div>`;
}

function buildSkillsHtml(char) {
    if (!char.skills || !char.skills.length) return '';
    return char.skills.map(s => `<span class="skill-chip">${s}</span>`).join('');
}

function buildItemsHtml(char) {
    if (!char.items || !char.items.length) {
        return '<p class="empty-note">No items listed.</p>';
    }
    return char.items.map((item, idx) => {
        const icon   = ITEM_ICONS[item.type] || '🎒';
        const useKey = `${char.id}_item_${idx}`;
        let detail   = '';

        if (item.type === 'weapon') {
            detail = `<span class="item-stat damage">Damage ${item.damage}</span>`;
        } else if (item.type === 'shield') {
            detail = `<span class="item-stat defense">Defense +${item.defenseBonus}</span>`;
        } else if (item.type === 'consumable' && item.usesMax) {
            const used  = itemUses[useKey] || 0;
            const boxes = Array.from({ length: item.usesMax }, (_, i) =>
                `<button class="use-box ${i < used ? 'used' : ''}"
                         onclick="App.toggleItemUse('${char.id}', ${idx})"
                         aria-label="Toggle use">
                    ${i < used ? '✕' : '○'}
                 </button>`
            ).join('');
            detail = `<span class="item-effect">${item.effect}</span>
                      <div class="use-boxes">${boxes}</div>`;
        }

        return `<div class="item-entry item-${item.type}">
                    <span class="item-icon">${icon}</span>
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        ${detail}
                    </div>
                </div>`;
    }).join('');
}

function buildStuntsHtml(char) {
    if (!char.stunts || !char.stunts.length) {
        return '<p class="empty-note">No stunts listed.</p>';
    }
    return char.stunts.map((stunt, idx) => {
        const useKey = `${char.id}_stunt_${idx}`;
        let usesHtml = '';

        if (stunt.usesMax) {
            const used  = stuntUses[useKey] || 0;
            const label = stunt.resets ? `resets per ${stunt.resets}` : '';
            const boxes = Array.from({ length: stunt.usesMax }, (_, i) =>
                `<button class="use-box ${i < used ? 'used' : ''}"
                         onclick="App.toggleStuntUse('${char.id}', ${idx})"
                         aria-label="Toggle use">
                    ${i < used ? '✕' : '○'}
                 </button>`
            ).join('');
            usesHtml = `<div class="stunt-uses">${boxes}
                            ${label ? `<span class="use-label">${label}</span>` : ''}
                        </div>`;
        }

        return `<div class="stunt-card">
                    <div class="stunt-header">
                        <span class="stunt-name">${stunt.name}</span>
                        ${usesHtml}
                    </div>
                    <p class="stunt-effect">${stunt.effect}</p>
                </div>`;
    }).join('');
}

// ─── App object ───────────────────────────────────────────────

const App = {

    init() {
        this.cacheDOM();
        this.$gmToggle = document.getElementById('gm-toggle-btn');
        if (this.$gmToggle) {
            this.$gmToggle.addEventListener('click', () => {
                const pass = prompt('GM passphrase:');
                if (pass && pass.toLowerCase().trim() === 'mango') {
                    sessionStorage.setItem('isGM', 'true');
                    window.location.href = 'gm.html';
                } else if (pass !== null) {
                    alert('Incorrect passphrase.');
                }
            });
        }
        this.applySettings();
        this.bindEvents();
        this.renderGallery();       // render immediately (no waiting for Firebase)
        this.subscribeToFirebase(); // then apply live state
    },

    cacheDOM() {
        this.$pageTitle     = document.getElementById('page-title');
        this.$headerTitle   = document.getElementById('header-title');
        this.$headerSub     = document.getElementById('header-subtitle');
        this.$galleryView   = document.getElementById('gallery-view');
        this.$grid          = document.getElementById('character-grid');
        this.$modal         = document.getElementById('character-modal');
        this.$modalPortrait = document.getElementById('modal-portrait');
        this.$modalBody     = document.getElementById('modal-body');
        this.$closeModal    = document.getElementById('close-modal');
        this.$tabBtns       = document.querySelectorAll('.tab-btn');
        this.$tabContents   = document.querySelectorAll('.tab-content');
    },

    applySettings() {
        const s     = campaignData.settings || {};
        const title = s.title    || 'Campaign';
        const sub   = s.subtitle || 'Choose your character';
        this.$pageTitle.textContent   = `${title} — Character Picker`;
        this.$headerTitle.textContent = title;
        this.$headerSub.textContent   = sub;
    },

    // ── Firebase ───────────────────────────────────────────────

    subscribeToFirebase() {
        claimsRef.on('value', snapshot => {
            claims = snapshot.val() || {};
            this.renderGallery();
            this.syncOpenModal();
        }, err => console.error('Firebase claims error:', err.message));

        characterNamesRef.on('value', snapshot => {
            characterNames = snapshot.val() || {};
            this.renderGallery();
            // Update modal name header live without full re-render
            const openId = this.$modal.dataset.openCharId;
            if (openId) {
                const el = document.getElementById('modal-char-name');
                if (el) el.textContent = characterNames[openId] || '—';
            }
        }, err => console.error('Firebase characterNames error:', err.message));
    },

    // Refresh just the action area of an open modal when claims change
    syncOpenModal() {
        const openId = this.$modal.dataset.openCharId;
        if (!openId || this.$modal.classList.contains('hidden')) return;
        const char = campaignData.characters.find(c => c.id === openId);
        if (char) this.refreshModalAction(char);
    },

    // ── Events ────────────────────────────────────────────────

    bindEvents() {
        this.$closeModal.addEventListener('click', () => this.closeModal());
        this.$modal.addEventListener('click', e => {
            if (e.target === this.$modal) this.closeModal();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.closeModal();
        });

        this.$tabBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                this.$tabBtns.forEach(b => b.classList.remove('active'));
                this.$tabContents.forEach(c => c.classList.add('hidden'));
                e.currentTarget.classList.add('active');
                document.getElementById(e.currentTarget.dataset.tab).classList.remove('hidden');
            });
        });

        if (this.$gmNotes) {
            this.$gmNotes.value = localStorage.getItem('rpg_gm_notes') || '';
            this.$gmNotes.addEventListener('input', () => {
                localStorage.setItem('rpg_gm_notes', this.$gmNotes.value);
            });
        }
    },

    // ── Gallery ───────────────────────────────────────────────

    renderGallery() {
        this.$grid.innerHTML = '';
        campaignData.characters.forEach(char => {
            const claimerName = claims[char.id];
            const claimed     = !!claimerName;
            const charName    = characterNames[char.id];

            // What to show as the card title:
            // • if the player set a character name → that name
            // • if claimed but no name yet        → player's name + "…"
            // • unclaimed                         → suggested name (italic hint)
            const displayName = charName
                ? charName
                : claimed
                    ? `${claimerName}'s character`
                    : (char.suggestedName || char.icon);

            const card = document.createElement('div');
            card.className = `card${claimed ? ' claimed' : ''}`;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label',
                `${displayName} — ${claimed ? 'Claimed by ' + claimerName : 'Available'}`);

            card.innerHTML = `
                <div class="card-portrait">
                    ${buildPortraitHTML(char, 'card')}
                    ${claimed ? '<div class="portrait-overlay"></div>' : ''}
                </div>
                <div class="card-body">
                    <h2 class="${!charName && !claimed ? 'name-hint' : ''}">${displayName}</h2>
                    <p class="pitch">${char.pitch}</p>
                    ${claimed
                        ? `<span class="badge taken">✓ ${claimerName}</span>`
                        : `<span class="badge available">Available</span>`}
                </div>`;

            card.addEventListener('click',   () => this.openModal(char));
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') this.openModal(char);
            });
            this.$grid.appendChild(card);
        });
    },

    // ── Modal ─────────────────────────────────────────────────

    openModal(char) {
        this.$modal.dataset.openCharId = char.id;

        const charName = characterNames[char.id] || '';
        const defense  = calcDefense(char);
        const hasShield = (char.items || []).some(i => i.type === 'shield');

        // Aspects (only render rows that have content)
        const aspects = [
            ['Concept', char.concept],
            ['Flaw',    char.flaw],
            ['Want',    char.want],
            ['Aspect',  char.aspect]
        ];
        const aspectsHtml = aspects
            .filter(([, v]) => v)
            .map(([label, val]) => `
                <div class="aspect-item">
                    <span class="aspect-label">${label}</span>
                    <span>${val}</span>
                </div>`).join('');

        // Stats
        const statsHtml = Object.entries(char.stats).map(([name, val]) => `
            <div class="stat-item">
                <div class="stat-pip">${statRating(val)}</div>
                <div class="stat-info">
                    <div class="stat-name">${STAT_ICONS[name] || ''} ${name}</div>
                    <div class="stat-desc">${(STAT_DESCRIPTIONS || {})[name] || ''}</div>
                </div>
            </div>`).join('');

        this.$modalPortrait.innerHTML = buildPortraitHTML(char, 'modal');
        this.$modalBody.innerHTML = `
            <h2 class="char-name" id="modal-char-name">${charName || '—'}</h2>
            <p class="char-pitch">${char.pitch}</p>

            ${char.openQuestion ? `
            <div class="open-question">
                <span class="oq-label">To help you get into this character</span>
                <p>${char.openQuestion}</p>
            </div>` : ''}

            <div class="sheet-section">
                <h3>Aspects</h3>
                ${aspectsHtml}
            </div>

            <div class="sheet-section">
                <h3>Stats</h3>
                <div style="display:flex; gap:1rem; margin-bottom:1rem; flex-wrap:wrap;">
                    <div class="defense-banner" style="flex:1; min-width:120px; margin-bottom:0;">
                        <div>
                            <span class="defense-label">Defense</span>
                            <span class="defense-value">${defense}</span>
                        </div>
                        <span class="defense-note">10 + Agility${hasShield ? ' + shield' : ''}</span>
                    </div>
                    <div class="defense-banner" style="flex:1; min-width:120px; margin-bottom:0; border-left-color: var(--terracotta); background: rgba(181, 72, 42, 0.08);">
                        <div>
                            <span class="defense-label" style="color: var(--terracotta)">Health</span>
                            <span class="defense-value">${char.health || (10 + (char.stats.Endurance || 0))}</span>
                        </div>
                        <span class="defense-note">10 + Endurance</span>
                    </div>
                </div>
                <div class="stats-grid">${statsHtml}</div>
            </div>

            ${char.skills && char.skills.length ? `
            <div class="sheet-section">
                <h3>Skills</h3>
                <div class="skills-grid">${buildSkillsHtml(char)}</div>
            </div>` : ''}

            <div class="sheet-section">
                <h3>Items</h3>
                <div class="items-list" id="items-list-${char.id}">${buildItemsHtml(char)}</div>
            </div>

            <div class="sheet-section">
                <h3>Stunts</h3>
                <div class="stunts-list" id="stunts-list-${char.id}">${buildStuntsHtml(char)}</div>
            </div>

            <div class="sheet-section">
                <h3>Background</h3>
                <p class="backstory-text">${char.publicBackstory}</p>
            </div>

            <div id="modal-action"></div>`;

        this.refreshModalAction(char);
        this.$modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    refreshModalAction(char) {
        const el          = document.getElementById('modal-action');
        if (!el) return;
        const claimerName = claims[char.id];
        const claimed     = !!claimerName;
        const isMine      = currentUsername && claimerName === currentUsername;
        const charName    = characterNames[char.id] || '';

        if (isMine) {
            el.innerHTML = `
                <div class="name-editor">
                    <label for="char-name-input">Your character's name</label>
                    <div class="name-editor-row">
                        <input id="char-name-input"
                               type="text"
                               placeholder="Enter a name…"
                               value="${charName}"
                               maxlength="40"
                               autocomplete="off">
                        <button class="btn-save-name"
                                onclick="App.setCharacterName('${char.id}')">Save</button>
                    </div>
                    ${char.suggestedName
                        ? `<p class="name-suggestion">Suggested: <em>${char.suggestedName}</em></p>`
                        : ''}
                </div>
                <button class="btn btn-unclaim"
                        onclick="App.unclaim('${char.id}')">Release Character</button>`;

            // Allow Enter key to save name
            setTimeout(() => {
                const input = document.getElementById('char-name-input');
                if (input) {
                    input.addEventListener('keydown', e => {
                        if (e.key === 'Enter') App.setCharacterName(char.id);
                    });
                }
            }, 0);
        } else if (claimed) {
            el.innerHTML = `<button class="btn" disabled>Claimed by ${claimerName}</button>`;
        } else if (currentUsername) {
            // Already have a username — claim directly
            el.innerHTML = `
                <button class="btn btn-claim"
                        onclick="App.claim('${char.id}')">Claim this Character</button>`;
        } else {
            // No username yet — ask inline (browser blocks prompt() on HTTPS)
            el.innerHTML = `
                <div class="name-editor">
                    <label for="player-name-input">Your name (so others know who claimed this)</label>
                    <div class="name-editor-row">
                        <input id="player-name-input"
                               type="text"
                               placeholder="Enter your name…"
                               maxlength="40"
                               autocomplete="off">
                        <button class="btn-save-name"
                                onclick="App.claimWithName('${char.id}')">Claim</button>
                    </div>
                </div>`;
            setTimeout(() => {
                const input = document.getElementById('player-name-input');
                if (input) {
                    input.focus();
                    input.addEventListener('keydown', e => {
                        if (e.key === 'Enter') App.claimWithName('${char.id}');
                    });
                }
            }, 0);
        }
    },

    closeModal() {
        this.$modal.classList.add('hidden');
        delete this.$modal.dataset.openCharId;
        document.body.style.overflow = '';
    },

    // ── Claiming ──────────────────────────────────────────────

    claim(charId) {
        // currentUsername must already be set before calling this
        if (!currentUsername) return;
        claimsRef.child(charId).set(currentUsername);
    },

    claimWithName(charId) {
        const input = document.getElementById('player-name-input');
        if (!input) return;
        const name = input.value.trim();
        if (!name) {
            input.style.borderColor = 'var(--accent-ochre)';
            input.focus();
            return;
        }
        currentUsername = name;
        localStorage.setItem('rpg_username', currentUsername);
        claimsRef.child(charId).set(currentUsername);
    },

    unclaim(charId) {
        if (confirm('Release this character? Your name choice will also be cleared.')) {
            claimsRef.child(charId).remove();
            characterNamesRef.child(charId).remove();
            this.closeModal();
        }
    },

    setCharacterName(charId) {
        const input = document.getElementById('char-name-input');
        if (!input) return;
        const name = input.value.trim();
        if (name) {
            characterNamesRef.child(charId).set(name);
        } else {
            characterNamesRef.child(charId).remove();
        }
        // Optimistic update: reflect change in modal header immediately
        const nameEl = document.getElementById('modal-char-name');
        if (nameEl) nameEl.textContent = name || '—';
    },

    // ── In-session use tracking ───────────────────────────────

    toggleStuntUse(charId, stuntIdx) {
        const key   = `${charId}_stunt_${stuntIdx}`;
        const char  = campaignData.characters.find(c => c.id === charId);
        const stunt = char?.stunts?.[stuntIdx];
        if (!stunt?.usesMax) return;

        const current   = stuntUses[key] || 0;
        stuntUses[key]  = current >= stunt.usesMax ? 0 : current + 1;

        const container = document.getElementById(`stunts-list-${charId}`);
        if (container) container.innerHTML = buildStuntsHtml(char);
    },

    toggleItemUse(charId, itemIdx) {
        const key   = `${charId}_item_${itemIdx}`;
        const char  = campaignData.characters.find(c => c.id === charId);
        const item  = char?.items?.[itemIdx];
        if (!item?.usesMax) return;

        const current  = itemUses[key] || 0;
        itemUses[key]  = current >= item.usesMax ? 0 : current + 1;

        const container = document.getElementById(`items-list-${charId}`);
        if (container) container.innerHTML = buildItemsHtml(char);
    },

    // (GM View logic moved to gm.html)
};

document.addEventListener('DOMContentLoaded', () => App.init());
