/// GAG DATA
// Static gag info shared by every calculator. Never modify these objects directly,
// copy them first (see createSelectedGag).

export const MAX_SELECTED = 5; // Max gags selected at once

export const GAG_TRACKS = [
  { name: "trap", color: "#fffc57ff" },
  { name: "lure", color: "#10b901ff" },
  { name: "sound", color: "#416be7ff" },
  { name: "throw", color: "#ffa33aff" },
  { name: "squirt", color: "#ff4bccff" },
  { name: "drop", color: "#3ef5ffff" },
];

export const GAGS = {
  trap: [
    { name: "banana-peel", track: "trap", damage: 12, accuracy: 0, affectAll: false },
    { name: "rake", track: "trap", damage: 18, accuracy: 0, affectAll: false },
    { name: "marbles", track: "trap", damage: 35, accuracy: 0, affectAll: false },
    { name: "quicksand", track: "trap", damage: 50, accuracy: 0, affectAll: false },
    { name: "trapdoor", track: "trap", damage: 85, accuracy: 0, affectAll: false },
    { name: "tnt", track: "trap", damage: 180, accuracy: 0, affectAll: false },
    { name: "railroad", track: "trap", damage: 200, accuracy: 0, affectAll: true }
  ],

  lure: [
    { name: "$1-bill", track: "lure", damage: 0, accuracy: 60, affectAll: false },
    { name: "small-magnet", track: "lure", damage: 0, accuracy: 55, affectAll: true },
    { name: "$5-bill", track: "lure", damage: 0, accuracy: 70, affectAll: false },
    { name: "big-magnet", track: "lure", damage: 0, accuracy: 65, affectAll: true },
    { name: "$10-bill", track: "lure", damage: 0, accuracy: 80, affectAll: false },
    { name: "hypno-goggles", track: "lure", damage: 0, accuracy: 75, affectAll: true },
    { name: "presentation", track: "lure", damage: 0, accuracy: 90, affectAll: true }
  ],

  sound: [
    { name: "bike-horn", track: "sound", damage: 4, accuracy: 95, affectAll: true },
    { name: "whistle", track: "sound", damage: 7, accuracy: 95, affectAll: true },
    { name: "bugle", track: "sound", damage: 11, accuracy: 95, affectAll: true },
    { name: "aoogah", track: "sound", damage: 16, accuracy: 95, affectAll: true },
    { name: "elephant-trunk", track: "sound", damage: 21, accuracy: 95, affectAll: true },
    { name: "foghorn", track: "sound", damage: 50, accuracy: 95, affectAll: true },
    { name: "opera-singer", track: "sound", damage: 90, accuracy: 95, affectAll: true }
  ],

  throw: [
    { name: "cupcake", track: "throw", damage: 6, accuracy: 75, affectAll: false },
    { name: "fruit-pie-slice", track: "throw", damage: 10, accuracy: 75, affectAll: false },
    { name: "cream-pie-slice", track: "throw", damage: 17, accuracy: 75, affectAll: false },
    { name: "whole-fruit-pie", track: "throw", damage: 27, accuracy: 75, affectAll: false },
    { name: "whole-cream-pie", track: "throw", damage: 40, accuracy: 75, affectAll: false },
    { name: "birthday-cake", track: "throw", damage: 100, accuracy: 75, affectAll: false },
    { name: "wedding-cake", track: "throw", damage: 120, accuracy: 75, affectAll: true }
  ],

  squirt: [
    { name: "squirting-flower", track: "squirt", damage: 4, accuracy: 95, affectAll: false },
    { name: "glass-of-water", track: "squirt", damage: 8, accuracy: 95, affectAll: false },
    { name: "squirt-gun", track: "squirt", damage: 12, accuracy: 95, affectAll: false },
    { name: "seltzer-bottle", track: "squirt", damage: 21, accuracy: 95, affectAll: false },
    { name: "fire-hose", track: "squirt", damage: 30, accuracy: 95, affectAll: false },
    { name: "storm-cloud", track: "squirt", damage: 80, accuracy: 95, affectAll: false },
    { name: "geyser", track: "squirt", damage: 105, accuracy: 95, affectAll: true }
  ],

  drop: [
    { name: "flower-pot", track: "drop", damage: 10, accuracy: 50, affectAll: false },
    { name: "sandbag", track: "drop", damage: 18, accuracy: 50, affectAll: false },
    { name: "anvil", track: "drop", damage: 30, accuracy: 50, affectAll: false },
    { name: "big-weight", track: "drop", damage: 45, accuracy: 50, affectAll: false },
    { name: "safe", track: "drop", damage: 70, accuracy: 50, affectAll: false },
    { name: "grand-piano", track: "drop", damage: 170, accuracy: 50, affectAll: false },
    { name: "toontanic", track: "drop", damage: 180, accuracy: 50, affectAll: true }
  ]
};

// Organic damage: +15% for squirt and drop, +10% for everything else (lure deals no damage)
export function getOrgDamage(gag) {
  if (gag.track === "squirt" || gag.track === "drop")
    return Math.ceil((gag.damage * 115) / 100);
  return Math.ceil((gag.damage * 110) / 100);
}

// Organic accuracy: lure gets +10%, capped at 95
export function getOrgAccuracy(gag) {
  return gag.track === "lure" ? Math.min(gag.accuracy + 10, 95) : gag.accuracy;
}

// Build a new selected gag from the static data, applying organic bonuses
export function createSelectedGag(gag, org = false) {
  return {
    track: gag.track,
    name: gag.name,
    damage: org ? getOrgDamage(gag) : gag.damage,
    accuracy: org ? getOrgAccuracy(gag) : gag.accuracy,
    org,
  };
}

export function getGagImage(gag) {
  return `/images/gags/${gag.track}/${gag.name}.webp`;
}

// "birthday-cake" -> "Birthday Cake"
export function formatGagName(name) {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
