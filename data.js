// ─────────────────────────────────────────────────────────────
//  data.js  —  campaign data.  Edit this file to add/change
//  characters and NPCs.  The site rebuilds itself from this.
// ─────────────────────────────────────────────────────────────

const STAT_DESCRIPTIONS = {
    Might:     "Strength, fighting, lifting, breaking things",
    Agility:   "Speed, balance, stealth, riding, dodging",
    Endurance: "Stamina, heat, thirst, resisting injury",
    Wits:      "Problem-solving, tracking, crafts, spotting lies",
    Presence:  "Persuasion, leadership, haggling, intimidation",
    Insight:   "Intuition, medicine, lore, reading people and omens"
};

const campaignData = {
    settings: {
        title:    "The Trade",
        subtitle: "Choose your character"
    },

    // ── Characters ───────────────────────────────────────────
    //
    //  name          : leave ""  — the player sets it after claiming
    //  suggestedName : shown to the player as a prompt, and to the GM
    //  pitch         : one-liner on the gallery card
    //  icon          : emoji fallback if no portrait image exists
    //  image         : path inside the portraits/ folder ("" = use icon)
    //
    //  concept / flaw / want / aspect : the four Fate Aspects
    //  stats         : rate each 0–3  (total ≈ 9–11 across six stats)
    //  skills        : short list of things this character is good at
    //
    //  stunts        : { name, effect }
    //                  add  usesMax: N  to give it N tick-boxes per session
    //                  add  resets: "scene" | "session"  for the label
    //
    //  items         : { name, type }
    //                  type "weapon"     → add  damage: N
    //                  type "shield"     → add  defenseBonus: N
    //                  type "consumable" → add  effect: "…", usesMax: N
    //                  type "gear"       → no extra fields needed
    //
    //  openQuestion  : shown in the character sheet to help the player
    //                  get into the role; never shown to the GM
    //
    //  publicBackstory : visible to all players
    //  gmSecrets / gmHooks : GM view only

    characters: [
        {
            id:            "char_1",
            name:          "",
            suggestedName: "Ayodele",
            pitch:         "A veteran spearman whose army unit was reorganized, leaving them without a place.",
            icon:          "🛡️",
            image:         "portraits/char_1.jpg",

            concept: "Veteran of an Oyo army unit, now hired muscle",
            flaw:    "Still follows orders better than they think for themselves",
            want:    "A place to belong again, or proof they were right to leave",
            aspect:  "Calm when everyone else panics",

            stats: { Might: 3, Agility: 1, Endurance: 2, Wits: 2, Presence: 1, Insight: 0 },

            skills: ["Spear fighting", "Battle tactics", "Intimidating stare", "Long marches"],

            stunts: [
                { name: "Hold the Line",  effect: "Once per scene, take the hit meant for an ally.",                       usesMax: 1, resets: "scene" },
                { name: "Veteran's Eye",  effect: "Can tell how well-trained a group is just by watching them move." }
            ],

            items: [
                { name: "Iron-tipped spear",  type: "weapon",  damage: 3 },
                { name: "Hide shield",        type: "shield",  defenseBonus: 1 },
                { name: "Old campaign cloak", type: "gear" },
                { name: "Water gourd",        type: "gear" }
            ],

            openQuestion:    "What do you miss about the army, and what don't you?",
            publicBackstory: "Ayodele served in an Oyo army unit until a reorganization pushed out older fighters. Now they take work wherever it's offered.",
            gmSecrets:       "Ayodele recognizes the Iron Leopards' leader, who was in the same reorganization and was kept on. Old resentment, or old respect.",
            gmHooks:         "In Scene 1, the Leopards' leader greets Ayodele by name. At Ouidah, the leader can offer a place in the company — a real temptation."
        },
        {
            id:            "char_2",
            name:          "",
            suggestedName: "Temitope",
            pitch:         "An herbalist who treats anyone who asks, and notices what others miss.",
            icon:          "🌿",
            image:         "portraits/char_2.jpg",

            concept: "Herbalist and traveling healer",
            flaw:    "Can't walk away from someone who is hurting, even when they should",
            want:    "To prove ordinary medicine is still worth trusting",
            aspect:  "Patient listener, easy to confide in",

            stats: { Might: 0, Agility: 1, Endurance: 1, Wits: 2, Presence: 2, Insight: 3 },

            skills: ["Herbs and medicine", "Reading people", "Proverbs and lore", "Staying calm under pressure"],

            stunts: [
                { name: "Steady Hands",   effect: "Once per scene, heal an ally for 3 health without a roll.",            usesMax: 1, resets: "scene" },
                { name: "Bedside Manner", effect: "+2 to calm or question a hurt or frightened person." }
            ],

            items: [
                { name: "Herb poultice",  type: "consumable", effect: "Heal an ally for 2 Health", usesMax: 3 },
                { name: "Bark tonic",     type: "consumable", effect: "Cure fever or weakness",    usesMax: 1 },
                { name: "Cloth bandages", type: "gear" },
                { name: "Small knife",    type: "weapon",     damage: 2 }
            ],

            openQuestion:    "Is there a patient you couldn't save?",
            publicBackstory: "Temitope learned plant medicine from a grandparent and travels the roads treating whoever needs it. Remedies and patience, nothing mysterious.",
            gmSecrets:       "Temitope can tell Adunni's remedies work faster than any herb should, and that Adunni deliberately hides how they do it.",
            gmHooks:         "In Scene 2, Temitope notices the odd healing first. Do they confront Adunni, confide in the group, or keep quiet?"
        },
        {
            id:            "char_3",
            name:          "",
            suggestedName: "Taiwo",
            pitch:         "A trader's clerk who speaks many languages and can spot a crooked deal.",
            icon:          "📜",
            image:         "portraits/char_3.jpg",

            concept: "Merchant's clerk and interpreter",
            flaw:    "Believes a signed agreement means a deal is honest",
            want:    "A job that can't be replaced by cheaper, newer methods",
            aspect:  "Remembers every number and face",

            stats: { Might: 0, Agility: 1, Endurance: 1, Wits: 2, Presence: 3, Insight: 2 },

            skills: ["Haggling", "Languages (Yoruba, Fon, trade Hausa)", "Memory and counting", "Spotting lies"],

            stunts: [
                { name: "Fine Print",    effect: "Once per scene, spot a lie or hidden term in any spoken or written deal.", usesMax: 1, resets: "scene" },
                { name: "Silver Tongue", effect: "+2 when negotiating in the other side's own language." }
            ],

            items: [
                { name: "Tally cords",  type: "gear" },
                { name: "Cowrie purse", type: "gear" },
                { name: "Writing slate", type: "gear" },
                { name: "Trade token",  type: "gear" }
            ],

            openQuestion:    "What would you do if you found a deal was dishonest?",
            publicBackstory: "Taiwo kept records for merchants and learned several languages along the way. Written contracts are replacing a clerk's trained memory.",
            gmSecrets:       "Taiwo once balanced books for the agent's trade network without knowing what the goods were. Some of those numbers were people.",
            gmHooks:         "In Scene 3, Taiwo reads the list of names and recognizes the format of the old ledgers. The question is whether Taiwo was part of it."
        },
        {
            id:            "char_4",
            name:          "",
            suggestedName: "Adeola",
            pitch:         "A banished member of a minor royal household, still carrying themselves like someone used to being obeyed.",
            icon:          "👑",
            image:         "portraits/char_4.jpg",

            concept: "Banished minor royal",
            flaw:    "Expects to be obeyed, and takes it badly when ignored",
            want:    "To return home, or to prove they never needed the title",
            aspect:  "Commands attention without trying",

            stats: { Might: 1, Agility: 1, Endurance: 0, Wits: 2, Presence: 3, Insight: 2 },

            skills: ["Court etiquette", "Oratory", "Reading nobles and officials", "Ceremonial lore"],

            stunts: [
                { name: "Royal Bearing",   effect: "Once per scene, command a crowd's attention. Nobody acts until you finish speaking.", usesMax: 1, resets: "scene" },
                { name: "Knows the Rules", effect: "+2 when dealing with officials, since you know the protocols they follow." }
            ],

            items: [
                { name: "Fine but worn cloak",       type: "gear" },
                { name: "Hidden brass armlet of rank", type: "gear" },
                { name: "Ceremonial dagger",         type: "weapon", damage: 2 },
                { name: "Small cowrie stash",        type: "gear" }
            ],

            openQuestion:    "Why were you banished, and do you want your place back?",
            publicBackstory: "Adeola was born into a minor royal household and is now cast out. The fine manner remains, though the title is gone.",
            gmSecrets:       "The household that banished Adeola owes tribute to Dahomey's court. Someone there may recognize the armlet.",
            gmHooks:         "In Scene 5, the Dahomey commander spots the armlet. It could earn respect, or reveal a banished person to people who could send word home."
        },
        {
            id:            "char_5",
            name:          "",
            suggestedName: "Olatunji",
            pitch:         "A blacksmith whose trade is being replaced by cheap imported iron.",
            icon:          "🔨",
            image:         "portraits/char_5.jpg",

            concept: "Blacksmith turned hired muscle",
            flaw:    "Proud and stubborn; hates being told their work is outdated",
            want:    "Earn enough to reopen the forge",
            aspect:  "Can fix almost anything made of metal",

            stats: { Might: 3, Agility: 0, Endurance: 2, Wits: 2, Presence: 1, Insight: 1 },

            skills: ["Metalwork and repairs", "Hauling and lifting", "Judging quality of goods", "Hammer fighting"],

            stunts: [
                { name: "Iron Will",   effect: "Once per scene, shrug off a hit: ignore one point of damage.",           usesMax: 1, resets: "scene" },
                { name: "Smith's Eye", effect: "Can tell who made a piece of metalwork and roughly where it was made." }
            ],

            items: [
                { name: "Smith's hammer",         type: "weapon", damage: 3 },
                { name: "Leather apron",          type: "gear" },
                { name: "Pouch of nails and cord", type: "gear" },
                { name: "Small whetstone",        type: "gear" }
            ],

            openQuestion:    "Why did your forge close, and who do you blame?",
            publicBackstory: "Olatunji learned the forge from a parent. When cheaper iron from the coast flooded the markets, orders dried up.",
            gmSecrets:       "The old forge guild sold ironwork to the agent. The shackles and cage in the crate are guild-made — possibly by Olatunji's own master.",
            gmHooks:         "In Scene 3, they recognize the craftsmanship. Do they stay quiet, confront the agent, or tell the group?"
        },
        {
            id:            "char_6",
            name:          "",
            suggestedName: "Sade",
            pitch:         "A former market thief who knows how to get in, get out, and read a crowd.",
            icon:          "🗝️",
            image:         "portraits/char_6.jpg",

            concept: "Reformed thief and street guide",
            flaw:    "Can't resist a lock, a pocket, or a bargain",
            want:    "A steady job that doesn't end with someone chasing them",
            aspect:  "Always knows the quickest way out",

            stats: { Might: 0, Agility: 3, Endurance: 1, Wits: 2, Presence: 1, Insight: 2 },

            skills: ["Stealth and sneaking", "Picking locks and pockets", "Spotting danger", "Quick talking"],

            stunts: [
                { name: "Slip Away",     effect: "Once per scene, escape any grab or confrontation without a roll.",       usesMax: 1, resets: "scene" },
                { name: "Light Fingers", effect: "+2 to take a small item from someone nearby without them noticing." }
            ],

            items: [
                { name: "Short knife",                type: "weapon", damage: 2 },
                { name: "Lockpicks (bent bronze pins)", type: "gear" },
                { name: "Dark cloth wrap",            type: "gear" },
                { name: "Small coil of cord",         type: "gear" }
            ],

            openQuestion:    "Who did you steal from that you still feel bad about?",
            publicBackstory: "Sade grew up in Oyo's markets and survived on speed and nerve. They say they're reformed. Most people aren't sure.",
            gmSecrets:       "Before the job, Sade lifted a seal token from the agent's belt without knowing what it was. It carries the agent's official mark.",
            gmHooks:         "The token can open doors in Ouidah, or expose the agent. Sade may use it for the group's good — or sell it."
        }
    ],

    // ── NPCs (GM view only) ──────────────────────────────────
    npcs: [
        {
            id:    "npc_1",
            name:  "The Agent",
            role:  "Employer — funding and directing the job",
            stats: "Presence 3 · Wits 2 · Stress: □ □ □",
            notes: "Polite, businesslike, keeps real motives off the table. Gets terse if the schedule slips. The cargo is the real agenda."
        },
        {
            id:    "npc_2",
            name:  "The Gatekeeper",
            role:  "Toll Collector / Local Authority",
            stats: "Presence 2 · Might 2 · Stress: □ □",
            notes: "Greedy but not cruel. Raises the toll if the cargo looks valuable. Can be bribed or charmed."
        },
        {
            id:    "npc_3",
            name:  "Adunni",
            role:  "Camp Follower / Healer",
            stats: "Insight 3 · Presence 2 · Stress: □ □",
            notes: "Travels with caravans. Their remedies work faster than any herb should, and they deflect questions about it. Not dangerous — but not what they appear."
        },
        {
            id:    "npc_4",
            name:  "Iron Leopards Leader",
            role:  "Mercenary Company Commander",
            stats: "Might 3 · Presence 2 · Stress: □ □ □ □",
            notes: "Commands a rival mercenary unit. Knows Ayodele from the old Oyo reorganization. May recruit, threaten, or both."
        }
    ]
};
