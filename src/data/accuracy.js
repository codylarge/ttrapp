// Accuracy rules, see the "accuracy formula" file in the project root
// atkAcc = propAcc + trackExp + tgtDef + bonus, capped at MAX_ACCURACY

const TRACK_EXP = 60; // Assumes every toon has the track maxed
const MAX_ACCURACY = 95;
const STUN_BONUS = 25; // Per gag that hit in an earlier track
const TRAP_SPRUNG_BONUS = 50; // For every track after a lure springs a trap

// tgtDef and health by cog level
export const COG_LEVELS = [
  { level: 1, def: -2, health: 6 },
  { level: 2, def: -5, health: 12 },
  { level: 3, def: -10, health: 20 },
  { level: 4, def: -15, health: 30 },
  { level: 5, def: -20, health: 42 },
  { level: 6, def: -25, health: 56 },
  { level: 7, def: -30, health: 72 },
  { level: 8, def: -35, health: 90 },
  { level: 9, def: -40, health: 110 },
  { level: 10, def: -45, health: 132 },
  { level: 11, def: -50, health: 156 },
  { level: 12, def: -55, health: 196 },
  { level: 13, def: -60, health: 224 },
  { level: 14, def: -65, health: 254 },
  { level: 15, def: -65, health: 286 },
  { level: 16, def: -65, health: 320 },
  { level: 17, def: -65, health: 356 },
  { level: 18, def: -65, health: 394 },
  { level: 19, def: -65, health: 434 },
  { level: 20, def: -65, health: 476 },
];

// Accuracy an extra lure adds when used with a higher / equal lure of the same type
const MULTI_LURE_BONUS = {
  "$1-bill": 10,
  "small-magnet": 10,
  "$5-bill": 15,
  "big-magnet": 15,
  "$10-bill": 20,
  "hypno-goggles": 20,
  "presentation": 20,
};

// Tracks in the order they attack. Trap is left out, it never rolls by itself
const ROLLING_TRACKS = ["lure", "sound", "throw", "squirt", "drop"];

function rollAccuracy(propAcc, def, bonus) {
  return Math.max(0, Math.min(propAcc + TRACK_EXP + def + bonus, MAX_ACCURACY));
}

// A trap gives the incoming lure +10, each extra trap +5
function getTrapStun(trapCount) {
  return trapCount > 0 ? 10 + (trapCount - 1) * 5 : 0;
}

// propAcc of a lure track. Several lures roll once using the highest lure
// Each lower / equal lure adds its bonus, but only when every lure is the same type (all bills or all group lures)
function getLurePropAcc(lures) {
  const [highest, ...extras] = [...lures].sort((a, b) => b.accuracy - a.accuracy || MULTI_LURE_BONUS[b.name] - MULTI_LURE_BONUS[a.name]);
  const sameType = lures.every(gag => isBill(gag) === isBill(highest));
  const bonus = sameType ? extras.reduce((sum, gag) => sum + MULTI_LURE_BONUS[gag.name], 0) : 0;
  return highest.accuracy + bonus;
}

function isBill(gag) {
  return gag.name.endsWith("-bill");
}

// A 0-1 chance as a percent: whole numbers, or up to 2 decimals above 99%
// Never rounds up to 100 unless it's certain (the tiny gap allows for floating point error)
function toPercent(chance) {
  if (chance > 1 - 1e-9) return 100;
  const percent = chance * 100;
  if (percent <= 99) return Math.round(percent);
  return Math.min(Math.round(percent * 10) / 10, 99.9);
}

// Damage a track deals when it hits, same rules as the damage calculator
// Several gags in a track get +20%, the first throw / squirt on a lured cog gets +50% knockback
function getHitDamage(track, trackGags, knockback) {
  const damage = trackGags.reduce((sum, gag) => sum + gag.damage, 0);
  const combo = trackGags.length > 1 ? Math.ceil(damage * 0.2) : 0;
  const knockbackBonus = knockback && (track === "throw" || track === "squirt") ? Math.ceil(damage * 0.5) : 0;
  return damage + combo + knockbackBonus;
}

// Chance of each track hitting a cog with this defense, and of the cog dying
// A later track depends on what hit before it, so every hit / miss path is walked and weighted by its chance
// Each path adds up its own damage, the cog dies on the paths where that reaches its health
// An SOS always hits, so its whole track is 100%, but the SOS itself gives no stun
// hitTracks: tracks the user marked as already hit, they count as a normal hit at 100%
// Returns { tracks: { [track]: percent }, cogDies: percent, or null with no gags }
export function calculateAccuracy(gags, def, health, hitTracks = []) {
  const normalGags = gags.filter(gag => !gag.sos);
  const trapCount = normalGags.filter(gag => gag.track === "trap").length;
  const trap = gags.find(gag => gag.track === "trap"); // Only the first trap goes off
  const hasSos = track => gags.some(gag => gag.sos && gag.track === track);
  const rolls = ROLLING_TRACKS
    .map(track => ({
      track,
      gags: normalGags.filter(gag => gag.track === track),
      allGags: gags.filter(gag => gag.track === track),
      sos: hasSos(track),
    }))
    .filter(roll => roll.gags.length > 0 || roll.sos);

  const chances = Object.fromEntries(rolls.map(roll => [roll.track, 0]));
  let cogDies = 0;

  function walk(index, state, pathChance) {
    if (pathChance === 0) return;
    if (index === rolls.length) {
      if (state.damage >= health) cogDies += pathChance;
      return;
    }

    const { track, gags: trackGags, allGags, sos } = rolls[index];
    const alreadyHit = hitTracks.includes(track);
    const landed = {
      lured: false,
      stuns: state.stuns + trackGags.length,
      damage: state.damage + getHitDamage(track, allGags, state.lured && !trap),
    };
    let accuracy;
    let onHit;

    if (sos || (alreadyHit && track !== "lure")) {
      accuracy = 100;
      onHit = landed;
    } else if (track === "lure") {
      accuracy = alreadyHit ? 100 : rollAccuracy(getLurePropAcc(trackGags), def, getTrapStun(trapCount));
      // A successful lure gives no stun. It springs a trap if there is one, otherwise the cog stays lured
      onHit = trapCount > 0 ? { trapBonus: TRAP_SPRUNG_BONUS } : { lured: true };
      if (trap) onHit.damage = state.damage + trap.damage;
    } else if (state.lured && track === "drop") {
      accuracy = 0; // Drop can't reach a lured cog
      onHit = {};
    } else {
      // A lured cog can't dodge, anything else hits it and knocks it out of the lure
      accuracy = state.lured ? 100 : rollAccuracy(trackGags[0].accuracy, def, state.trapBonus + state.stuns * STUN_BONUS);
      onHit = landed;
    }

    const hitChance = accuracy / 100;
    chances[track] += pathChance * hitChance;
    walk(index + 1, { ...state, ...onHit }, pathChance * hitChance);
    walk(index + 1, state, pathChance * (1 - hitChance));
  }

  walk(0, { stuns: 0, trapBonus: 0, lured: false, damage: 0 }, 1);

  const tracks = Object.fromEntries(Object.entries(chances).map(([track, chance]) => [track, toPercent(chance)]));

  // Traps only go off when the lure hits
  if (trapCount > 0 && "lure" in tracks) tracks.trap = tracks.lure;
  if (hasSos("trap")) tracks.trap = 100;

  return { tracks, cogDies: gags.length > 0 ? toPercent(cogDies) : null };
}
