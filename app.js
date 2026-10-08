// ─────────────────────────────────────────────────────────────
//  app.js  –  Character Picker  (Phase 2: Firebase Realtime DB)
// ─────────────────────────────────────────────────────────────

// Claims live in Firebase so every device sees the same state.
// Username is still stored locally — each player just types their
// name once and it's remembered in their browser.

let claims          = {};   // kept in sync by the Firebase listener
let currentUsername = localStorage.getItem('rpg_username') || null;

// Firebase database reference
const db         = firebase.database();
const claimsRef  = db.ref('claims');

// Stat icons (decorative)
const STAT_ICONS = {
    Might:     '⚔️',
    Agility:   '🏃',
    Endurance: '🛡️',
    Wits:      '🧠',
    Presence:  '💬',
    Insight:   '👁️'
};

// ─── Helpers ──────────────────────────────────────────────────

function buildPortraitHTML(char, size = 'card') {
    if (char.image) {
        const styleAttr = size === 'modal'
            ? 'style="width:100%;height:340px;object-fit:cover;object-position:center top;display:block;"'
            : '';
        return `<img src="${char.image}" alt="Portrait of ${char.name}" ${styleAttr}
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                <div class="icon-fallback" style="display:none">${char.icon}</div>`;
    }
    return `<div class="icon-fallback">${char.icon}</div>`;
}

function statRating(val) {
    return val >= 0 ? `+${val}` : `${val}`;
}

// ─── App ──────────────────────────────────────────────────────

const App = {

    init() {
        this.cacheDOM();
        this.applySettings();
        this.bindEvents();
        this.subscribeToFirebase();
    },

    cacheDOM() {
        this.$pageTitle     = document.getElementById('page-title');
        this.$headerTitle   = document.getElementById('header-title');
        this.$headerSub     = document.getElementById('header-subtitle');
        this.$galleryView   = document.getElementById('gallery-view');
        this.$gmView        = document.getElementById('gm-view');
        this.$grid          = document.getElementById('character-grid');
        this.$modal         = document.getElementById('character-modal');
        this.$modalPortrait = document.getElementById('modal-portrait');
        this.$modalBody     = document.getElementById('modal-body');
        this.$closeModal    = document.getElementById('close-modal');
        this.$gmToggle      = document.getElementById('gm-toggle-btn');
        this.$gmChars       = document.getElementById('gm-chars');
        this.$gmNpcs        = document.getElementById('gm-npcs');
        this.$tabBtns       = document.querySelectorAll('.tab-btn');
        this.$tabContents   = document.querySelectorAll('.tab-content');
        this.$gmNotes       = document.getElementById('gm-notes-area');
    },

    applySettings() {
        const s        = campaignData.settings || {};
        const title    = s.title    || 'Campaign';
        const subtitle = s.subtitle || 'Choose your character';
        this.$pageTitle.textContent   = `${title} — Character Picker`;
        this.$headerTitle.textContent = title;
        this.$headerSub.textContent   = subtitle;
    },

    // ─── Firebase ──────────────────────────────────────────

    subscribeToFirebase() {
        // Real-time listener — fires immediately with current data,
        // then again whenever any client changes a claim.
        claimsRef.on('value', snapshot => {
            claims = snapshot.val() || {};
            this.renderGallery();

            // If the modal is open for a character, refresh the action button
            const openCharId = this.$modal.dataset.openCharId;
            if (openCharId && !this.$modal.classList.contains('hidden')) {
                const char = campaignData.characters.find(c => c.id === openCharId);
                if (char) this.refreshModalAction(char);
            }

            // If GM view is visible, re-render it too
            if (!this.$gmView.classList.contains('hidden')) {
                this.renderGmView();
            }
        });
    },

    // ─── Events ────────────────────────────────────────────

    bindEvents() {
        this.$closeModal.addEventListener('click', () => this.closeModal());
        this.$modal.addEventListener('click', e => { if (e.target === this.$modal) this.closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') this.closeModal(); });

        this.$gmToggle.addEventListener('click', () => this.handleGmToggle());

        this.$tabBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                this.$tabBtns.forEach(b => b.classList.remove('active'));
                this.$tabContents.forEach(c => c.classList.add('hidden'));
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab).classList.remove('hidden');
            });
        });

        if (this.$gmNotes) {
            this.$gmNotes.value = localStorage.getItem('rpg_gm_notes') || '';
            this.$gmNotes.addEventListener('input', () => {
                localStorage.setItem('rpg_gm_notes', this.$gmNotes.value);
            });
        }
    },

    // ─── Gallery ───────────────────────────────────────────

    renderGallery() {
        this.$grid.innerHTML = '';
        campaignData.characters.forEach(char => {
            const claimerName = claims[char.id];
            const claimed     = !!claimerName;

            const card = document.createElement('div');
            card.className = `card${claimed ? ' claimed' : ''}`;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${char.name} — ${claimed ? 'Claimed by ' + claimerName : 'Available'}`);

            card.innerHTML = `
                <div class="card-portrait">
                    ${buildPortraitHTML(char, 'card')}
                </div>
                <div class="card-body">
                    <h2>${char.name}</h2>
                    <p class="pitch">${char.pitch.split('—')[0].trim()}</p>
                    ${claimed
                        ? `<span class="badge taken">✓ ${claimerName}</span>`
                        : `<span class="badge available">Available</span>`
                    }
                </div>`;

            card.addEventListener('click',   () => this.openModal(char));
            card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') this.openModal(char); });
            this.$grid.appendChild(card);
        });
    },

    // ─── Modal ─────────────────────────────────────────────

    openModal(char) {
        this.$modal.dataset.openCharId = char.id;

        // Aspects
        const aspectsHtml = [
            ['High Concept', char.concept],
            ['Trouble',      char.trouble],
            ['Aspect',       char.aspect]
        ].map(([label, val]) => `
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

        // Stunts
        const stuntsHtml = char.stunts.map(s => `<div class="stunt-item">${s}</div>`).join('');

        this.$modalPortrait.innerHTML = buildPortraitHTML(char, 'modal');
        this.$modalBody.innerHTML = `
            <h2 class="char-name" id="modal-char-name">${char.name}</h2>
            <p class="char-pitch">${char.pitch}</p>

            <div class="sheet-section">
                <h3>Aspects</h3>
                ${aspectsHtml}
            </div>
            <div class="sheet-section">
                <h3>Stats</h3>
                <div class="stats-grid">${statsHtml}</div>
            </div>
            <div class="sheet-section">
                <h3>Stunts</h3>
                ${stuntsHtml}
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

        if (isMine) {
            el.innerHTML = `<button class="btn btn-unclaim" onclick="App.unclaim('${char.id}')">Unclaim Character</button>`;
        } else if (claimed) {
            el.innerHTML = `<button class="btn" disabled>Claimed by ${claimerName}</button>`;
        } else {
            el.innerHTML = `<button class="btn btn-claim" onclick="App.claim('${char.id}')">Claim ${char.name}</button>`;
        }
    },

    closeModal() {
        this.$modal.classList.add('hidden');
        delete this.$modal.dataset.openCharId;
        document.body.style.overflow = '';
    },

    // ─── Claiming (Firebase) ────────────────────────────────

    claim(charId) {
        if (!currentUsername) {
            const name = prompt('Enter your name to claim this character:');
            if (!name || !name.trim()) return;
            currentUsername = name.trim();
            localStorage.setItem('rpg_username', currentUsername);
        }
        // Write to Firebase — the real-time listener will update all clients
        claimsRef.child(charId).set(currentUsername);
    },

    unclaim(charId) {
        if (confirm('Release this character so someone else can take it?')) {
            // Remove from Firebase — the listener will update all clients
            claimsRef.child(charId).remove();
        }
    },

    // ─── GM View ────────────────────────────────────────────

    handleGmToggle() {
        /*
         * ⚠️  SECURITY NOTE — client-side passphrase only
         * This is a casual spoiler guard, not real security.
         * Anyone who opens DevTools can read all GM secrets
         * in the source code. Do not store truly sensitive
         * information here if your players are technically savvy.
         */
        const isGmOpen = !this.$gmView.classList.contains('hidden');

        if (isGmOpen) {
            this.$gmView.classList.add('hidden');
            this.$galleryView.classList.remove('hidden');
            return;
        }

        const pass = prompt('GM passphrase:');
        if (!pass || pass.toLowerCase().trim() !== 'mango') {
            if (pass !== null) alert('Incorrect passphrase.');
            return;
        }

        this.$galleryView.classList.add('hidden');
        this.$gmView.classList.remove('hidden');
        this.renderGmView();
    },

    renderGmView() {
        this.$gmChars.innerHTML = campaignData.characters.map(char => {
            const claimerName = claims[char.id];
            return `
            <div class="gm-card">
                <h3>${char.icon} ${char.name}</h3>
                <p><strong>Status:</strong> ${claimerName ? `Claimed by ${claimerName}` : 'Unclaimed'}</p>
                <p><strong>Concept:</strong> ${char.concept}</p>
                <div class="gm-secret-block">
                    <strong>Secret</strong>
                    <p>${char.gmSecrets}</p>
                    <strong style="margin-top:0.5rem;display:block">Hooks</strong>
                    <p>${char.gmHooks}</p>
                </div>
            </div>`;
        }).join('');

        this.$gmNpcs.innerHTML = campaignData.npcs.map(npc => `
            <div class="gm-card">
                <h3>${npc.name}</h3>
                <p><strong>Role:</strong> ${npc.role}</p>
                <p><strong>Stats:</strong> ${npc.stats}</p>
                <p><strong>Notes:</strong> ${npc.notes}</p>
            </div>`).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
