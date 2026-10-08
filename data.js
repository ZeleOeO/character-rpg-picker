// ─────────────────────────────────────────────────────────────
//  CAMPAIGN DATA  –  edit this file to customise your campaign.
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
        title:    "Your Campaign Title",
        subtitle: "Choose your character"
    },

    characters: [
        {
            id:    "char_1",
            name:  "Character One",
            pitch: "The Warrior Archetype — fights first, asks later",
            icon:  "⚔️",
            // Image filename inside the portraits/ folder.
            // Supported formats: .jpg  .jpeg  .png  .webp
            // Leave as "" to show the icon fallback.
            image: "portraits/char_1.jpg",

            concept: "Veteran Guard",
            trouble: "A past mistake haunts every decision",
            aspect:  "Fiercely loyal to those who earn it",

            stats: {
                Might:     3,
                Agility:   2,
                Endurance: 3,
                Wits:      1,
                Presence:  1,
                Insight:   2
            },

            stunts: [
                "Because I am battle-hardened, once per session I may ignore a minor physical consequence."
            ],

            publicBackstory: "Everyone knows this one by reputation — a veteran who has survived things most people only hear about in rumours. They don't talk much about where they've been, and nobody pushes.",

            gmSecrets: "GM ONLY: hidden secret about past or true motivation.",
            gmHooks:   "GM ONLY: how to pull this character into the main plot thread."
        },
        {
            id:    "char_2",
            name:  "Character Two",
            pitch: "The Speaker Archetype — words sharper than blades",
            icon:  "🗣️",
            image: "portraits/char_2.jpg",

            concept: "Silver-tongued Negotiator",
            trouble: "Owes a dangerous debt to the wrong people",
            aspect:  "Knows someone in every town",

            stats: {
                Might:     1,
                Agility:   2,
                Endurance: 1,
                Wits:      2,
                Presence:  3,
                Insight:   3
            },

            stunts: [
                "Because I read people instinctively, I get +2 when using Presence to de-escalate violence."
            ],

            publicBackstory: "The one you send in when talking matters. Merchants, chiefs, soldiers — they all soften a little in the presence of this character. Nobody's quite sure how they do it.",

            gmSecrets: "GM ONLY: who the debt is owed to and what they want.",
            gmHooks:   "GM ONLY: the creditor appears at the worst possible moment."
        },
        {
            id:    "char_3",
            name:  "Character Three",
            pitch: "The Pathfinder Archetype — knows the way when no one else does",
            icon:  "🧭",
            image: "portraits/char_3.jpg",

            concept: "Seasoned Guide and Survivalist",
            trouble: "Deeply suspicious of authority and easy answers",
            aspect:  "Always has a tool or plan for the terrain",

            stats: {
                Might:     2,
                Agility:   2,
                Endurance: 3,
                Wits:      3,
                Presence:  1,
                Insight:   2
            },

            stunts: [
                "Because I know the land, I get +2 when using Wits to navigate or find resources in the wild."
            ],

            publicBackstory: "Has crossed difficult country more times than they can count. Hired for this job because no one else knows the roads, the toll-collectors, or which villages to avoid.",

            gmSecrets: "GM ONLY: secret tied to how they know these roads so well.",
            gmHooks:   "GM ONLY: something from a past journey resurfaces here."
        },
        {
            id:    "char_4",
            name:  "Character Four",
            pitch: "The Healer Archetype — keeps everyone alive long enough to regret it",
            icon:  "🩺",
            image: "portraits/char_4.jpg",

            concept: "Field Medic and Herbalist",
            trouble: "Refuses to leave a person behind — even enemies",
            aspect:  "Calm under pressure no one else can stand",

            stats: {
                Might:     1,
                Agility:   2,
                Endurance: 2,
                Wits:      2,
                Presence:  2,
                Insight:   3
            },

            stunts: [
                "Because I am a trained healer, once per session I can clear a moderate physical consequence with ten minutes of care."
            ],

            publicBackstory: "Wherever there's a caravan or a crew, someone like this becomes indispensable fast. Not a fighter by nature — but has seen enough violence to know how to handle it.",

            gmSecrets: "GM ONLY: why they joined this particular job instead of staying somewhere safer.",
            gmHooks:   "GM ONLY: someone they treated before turns up, changed by what happened to them."
        },
        {
            id:    "char_5",
            name:  "Character Five",
            pitch: "The Shadow Archetype — there, then gone before you noticed",
            icon:  "🌑",
            image: "portraits/char_5.jpg",

            concept: "Scout and Information Broker",
            trouble: "Old loyalties pull in conflicting directions",
            aspect:  "Notices what everyone else walks past",

            stats: {
                Might:     1,
                Agility:   3,
                Endurance: 2,
                Wits:      3,
                Presence:  2,
                Insight:   2
            },

            stunts: [
                "Because I move without sound, I get +2 when using Agility to slip past or tail someone undetected."
            ],

            publicBackstory: "Quiet. Reliable. Does their job and asks nothing personal in return. The group knows little about them — which is, one suspects, exactly how they like it.",

            gmSecrets: "GM ONLY: who they are really working for, or used to work for.",
            gmHooks:   "GM ONLY: their handler makes contact mid-journey with new instructions."
        }
    ],

    npcs: [
        {
            id:    "npc_1",
            name:  "The Employer",
            role:  "Patron — funding the job",
            stats: "Presence 3 · Wits 2 · Stress: □ □ □",
            notes: "Polite, businesslike, keeps his real motives off the table. Gets terse if the schedule slips."
        },
        {
            id:    "npc_2",
            name:  "The Gatekeeper",
            role:  "Toll Collector / Local Authority",
            stats: "Presence 2 · Might 2 · Stress: □ □",
            notes: "Greedy but not cruel. Will raise the toll if he suspects the cargo is valuable. Can be bribed or charmed."
        }
    ]
};
