import { useState, useMemo } from "react";
import GagCalculator from "../components/GagCalculator";
import SelectedGag from "../components/SelectedGag";
import DamageSummary from "../components/DamageSummary";
import RoundHistory from "../components/RoundHistory";
import Toggle from "../components/Toggle";
import { MAX_SELECTED, createSelectedGag } from "../data/gags";

// Modifier toggles in display order. type says which state object the key belongs to
const MODIFIER_TOGGLES = [
  { key: "damageUp", type: "gag", icon: "/images/ui/modifiers/damage-up.png" },
  { key: "defenseUp", type: "gag", icon: "/images/ui/modifiers/defense-up-boiler.png" },
  { key: "overpaidCoin", type: "cog", icon: "/images/ui/modifiers/overpaid.png" },
  { key: "defenseDown", type: "gag", icon: "/images/ui/modifiers/defense-down.png" },
];

export default function DamageCalculator() {
  const [selected, setSelected] = useState([]);
  const [rounds, setRounds] = useState([]); // Saved rounds: { gags, modifiers, total }
  const [editingIndex, setEditingIndex] = useState(null); // Index of the round open in the calculator, or null for a new round
  const [hoverPreview, setHoverPreview] = useState(null); // { gag, organic } of the hovered gag, or null
  const [levelsMode, setLevelsMode] = useState("normal");

  const [cogModifiers, setCogModifiers] = useState({
    overpaidCoin: { active: false, effect: 200 }, // Bonus HP added to each cog
    overpaidBull: { active: false, effect: 200 }
  });

  const [gagModifiers, setGagModifiers] = useState({
    damageUp: { active: false, effect: 1.5 },     // Gags deal +50% damage
    defenseDown: { active: false, effect: 1.2 },  // Gags deal +20% damage
    defenseUp: { active: false, effect: 0.75 }    // Gags deal 75% damage
  });

  // Shield overlays shown on the cog levels bar, color is "r, g, b"
  const shieldEffects = [
    { active: cogModifiers.overpaidCoin.active, color: "34, 197, 94" },
    { active: gagModifiers.defenseUp.active, color: "0, 205, 255"},    
    { active: gagModifiers.defenseDown.active, color: "239, 68, 68" }, 
  ].filter(shield => shield.active);

  const damageBreakdown = useMemo(() => calculateDamage(), [selected, gagModifiers, cogModifiers]);
  const currentTotalDamage = damageBreakdown.total;

  // Cog health bar counts damage from every saved round plus the current one
  // The round being edited is skipped, the calculator holds its new version
  const previousRoundsDamage = rounds.reduce((sum, round, i) => i === editingIndex ? sum : sum + round.total, 0);
  const overallDamage = previousRoundsDamage + currentTotalDamage;

  // Damage preview while hovering a gag: what the cogs would take if it were added
  // null when nothing is hovered or no more gags can be added
  const previewOverallDamage = hoverPreview && selected.length < MAX_SELECTED
    ? previousRoundsDamage + calculateDamage([...selected, createSelectedGag(hoverPreview.gag, hoverPreview.organic)]).total
    : null;

  // Cog cell colour. Solid colours show real damage, lighter ones show the hover preview
  function getCogCellColor(health) {
    if (overallDamage >= health) return "bg-green-500";                                       // Defeated
    if (previewOverallDamage !== null && previewOverallDamage >= health) return "bg-green-300"; // Would be defeated
    if (overallDamage > 0) return "bg-red-500";                                               // Damaged, survives
    return "bg-gray-500";
  }
  
  const levelsNormal = [
    { level: 1, health: 6 },
    { level: 2, health: 12 },
    { level: 3, health: 20 },
    { level: 4, health: 30 },
    { level: 5, health: 42 },
    { level: 6, health: 56 },
    { level: 7, health: 72 },
    { level: 8, health: 90 },
    { level: 9, health: 110 },
    { level: 10, health: 132 },
    { level: 11, health: 156 },
    { level: 12, health: 196 },
    { level: 13, health: 224 },
    { level: 14, health: 254 },
    { level: 15, health: 286 },
    { level: 16, health: 320 },
    { level: 17, health: 356 },
    { level: 18, health: 394 },
    { level: 19, health: 434 },
    { level: 20, health: 476 },
  ];

  const levelsSupers = [
    { level: 1, displayLevel: "Scrap", health: 250, color: "#9e5c75"},
    { level: 2, displayLevel: "Steel", health: 750, color: "#9e5c75" },
    { level: 3, displayLevel: "Coin", health: 750, color: "#287c5f" },
    { level: 4, displayLevel: "Bull", health: 1150, color: "#287c5f" },
    { level: 5, displayLevel: "Junior", health: 1100, color: "#3F5A96" },
    { level: 6, displayLevel: "Senior", health: 1500, color: "#3F5A96" },
    { level: 7, displayLevel: "Fairway", health: 1200, color: "#702F0C"},
    { level: 8, displayLevel: "Fringe", health: 1750, color: "#702F0C" },
  ];

  const levelsFieldOffice = [

    { level: 1, displayLevel: "1★ Boiler", health: 4000},
    { level: 2, displayLevel: "2★ Boiler", health: 4500},
    { level: 3, displayLevel: "3★ Boiler", health: 5000},
    { level: 4, displayLevel: "4★ Boiler", health: 5500},
  ];

  const levelModes = [
    {
      id: "normal",
      levels: levelsNormal,
      image: "/images/ui/modes/normal.webp",
    },
    {
      id: "supervisors",
      levels: levelsSupers,
      image: "/images/ui/modes/supervisors.webp"
    },    
  ];

  function applyGagModifiers(baseDamage) { 
    let modifiedDamage = baseDamage;

    Object.values(gagModifiers).forEach(modifier => {
      if (modifier.active) {
      modifiedDamage *= modifier.effect;
      }
    });

    return Math.ceil(modifiedDamage);
  };

  // Cog health including active cog modifiers (e.g. overpaid bonus HP)
  function getCogHealth(baseHealth) {
    let health = baseHealth;

    Object.values(cogModifiers).forEach(modifier => {
      if (modifier.active) {
        health += modifier.effect;
      }
    });

    return health;
  }


  
  const levels =
  levelModes.find(mode => mode.id === levelsMode)?.levels
  ?? [];

  const handleGagToggle = (key, value) => {
    setGagModifiers(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        active: value,
      },
    }));
  };

  const handleCogToggle = (key, value) => {
    setCogModifiers(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        active: value,
      },
    }));
  };

  // The damage functions below take a list of gags, so they can calculate the
  // real selection or a preview (selection + hovered gag)

  function calculateTrapDamage(gags) {
    const isTrapGag = gags.find(gag => gag.track === "trap"); // Return trap gag
    const isLureGag = gags.some(gag => gag.track === "lure"); // Return lure gag

    if (isTrapGag && isLureGag) {
      return isTrapGag.damage;
    }
    return 0;
  }

  // Return the track that gets lure knockback (+50%), or null
  // Trap and sound unlure the cog, so no bonus applies when either is used
  function getLureBonusTrack(gags, organizedGags) {
    const hasLure = gags.some(gag => gag.track === "lure");
    const hasTrap = gags.some(gag => gag.track === "trap");
    const hasSound = gags.some(gag => gag.track === "sound");

    if (!hasLure || hasTrap || hasSound) return null;
    if (organizedGags.throw) return "throw"; // Throw always goes before squirt
    if (organizedGags.squirt) return "squirt";
    return null;
  }

  // Drop misses when the cog is still lured, i.e. lure is used and nothing unlures it first
  // Trap (springs on lure), sound (wakes it), throw and squirt (knock it back) all unlure
  function doesDropMiss(gags) {
    const hasLure = gags.some(gag => gag.track === "lure");
    const unlured = gags.some(gag => ["trap", "sound", "throw", "squirt"].includes(gag.track));
    return hasLure && !unlured;
  }

  // Product of all active gag modifiers (e.g. 1.5 for damage up)
  function getModifierMultiplier() {
    return Object.values(gagModifiers)
      .filter(modifier => modifier.active)
      .reduce((total, modifier) => total * modifier.effect, 1);
  }

  // Calculate damage of a list of gags (the current selection by default), split into each part
  // trackDamage: { trap: 18, throw: 200, ... } raw damage per track (lure excluded, it deals none)
  function calculateDamage(gags = selected) {
    const breakdown = { trackDamage: {}, lureBonus: 0, groupBonus: 0, multiplier: getModifierMultiplier(), total: 0 };
    if (gags.length === 0) return breakdown;

    if (gags.some(gag => gag.track === "trap")) {
      breakdown.trackDamage.trap = calculateTrapDamage(gags);
    }

    const organizedGags = getOrganizedGags(gags);
    const lureBonusTrack = getLureBonusTrack(gags, organizedGags);
    const dropMisses = doesDropMiss(gags);

    for (const track in organizedGags) {
      if (track === "lure") continue;

      // Drop misses a lured cog, so it deals nothing (no group bonus either)
      if (track === "drop" && dropMisses) {
        breakdown.trackDamage.drop = 0;
        continue;
      }

      const trackGags = organizedGags[track];
      const trackDamage = trackGags.reduce((sum, gag) => sum + gag.damage, 0);

      breakdown.trackDamage[track] = trackDamage;
      if (trackGags.length > 1) breakdown.groupBonus += Math.ceil(trackDamage * 0.2); // Combo bonus
      if (track === lureBonusTrack) breakdown.lureBonus += Math.ceil(trackDamage * 0.5); // Lure knockback bonus
    }

    const baseDamage = Object.values(breakdown.trackDamage).reduce((sum, damage) => sum + damage, 0);
    breakdown.total = applyGagModifiers(baseDamage + breakdown.groupBonus + breakdown.lureBonus);

    return breakdown;
  }

  // Organize gags by track, excluding trap
  function getOrganizedGags(gags) {
    const groupedGags = {};

    for (let i = 0; i < gags.length; i++) {
      const gag = gags[i];

      if (gag.track === "trap") continue;

      // If this track does not exist yet, create an empty array
      if (!groupedGags[gag.track]) {
        groupedGags[gag.track] = [];
      }
      groupedGags[gag.track].push(gag);
    }
    return groupedGags;
  }

  // Remove gag from selected
  const handleRemoveGag = (indexToRemove) => {
    setSelected(prev =>
      prev.filter((_, i) => i !== indexToRemove)
    );
  };

  // Modifier toggles that are currently on
  function getActiveModifiers() {
    return MODIFIER_TOGGLES.filter(modifier => {
      const modifiers = modifier.type === "gag" ? gagModifiers : cogModifiers;
      return modifiers[modifier.key].active;
    });
  }

  // The calculator's current gags and modifiers as a round
  function makeCurrentRound() {
    return { gags: selected, modifiers: getActiveModifiers(), total: currentTotalDamage };
  }

  // Put a saved round's gags and modifiers back into the calculator
  function loadRound(round) {
    const activeKeys = new Set(round.modifiers.map(modifier => modifier.key));
    const setActive = prev => Object.fromEntries(
      Object.entries(prev).map(([key, modifier]) => [key, { ...modifier, active: activeKeys.has(key) }])
    );

    setSelected(round.gags);
    setGagModifiers(setActive);
    setCogModifiers(setActive);
  }

  // Write the calculator into the round being edited. With no gags left the round is removed
  // Returns the new rounds list and whether the round was removed
  function commitEdit() {
    const updated = [...rounds];
    const removed = selected.length === 0;

    if (removed) updated.splice(editingIndex, 1);
    else updated[editingIndex] = makeCurrentRound();

    return { updated, removed };
  }

  // Save the current gags and modifiers as a round, then start a fresh one
  // Modifiers stay on for the next round
  // While a round is open, its edits are saved and a fresh round starts
  function handleNewRound() {
    if (isEditing) {
      setRounds(commitEdit().updated);
      setEditingIndex(null);
      setSelected([]);
      return;
    }

    if (selected.length === 0) return;

    setRounds(prev => [...prev, makeCurrentRound()]);
    setSelected([]);
  }

  // Open a saved round in the calculator for editing
  // Any gags in progress are saved as a new round first
  function handleSelectRound(index) {
    if (index === editingIndex) return;

    let nextRounds = rounds;
    let target = index;

    if (isEditing) {
      // Switching rounds commits the edit to the round that was open
      const { updated, removed } = commitEdit();
      nextRounds = updated;
      if (removed && index > editingIndex) target -= 1;
    } else if (selected.length > 0) {
      nextRounds = [...rounds, makeCurrentRound()];
    }

    setRounds(nextRounds);
    setEditingIndex(target);
    loadRound(nextRounds[target]);
  }

  // Delete a saved round
  function handleRemoveRound(index) {
    setRounds(prev => prev.filter((_, i) => i !== index));

    if (index === editingIndex) {
      // Removing the open round starts a fresh round
      setEditingIndex(null);
      setSelected([]);
    } else if (isEditing && index < editingIndex) {
      setEditingIndex(editingIndex - 1); // Open round shifted down
    }
  }

  // Delete every saved round but keep the gags in the calculator
  // If a round was being edited, its gags become the new current round
  function handleResetRounds() {
    setRounds([]);
    setEditingIndex(null);
  }

  const isEditing = editingIndex !== null;

  // Rounds as shown in the panel. The open round shows its live edits, they're saved when it's closed
  const displayRounds = isEditing
    ? rounds.map((round, i) => i === editingIndex ? makeCurrentRound() : round)
    : rounds;


  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: "url('/images/backgrounds/background-blue-blur.jpg')",
      }}
    >

      <h1
        className="
          text-5xl xl:text-7xl font-bold mb-4 text-yellow-300 py-6 xl:py-10 font-minnie
          [text-shadow:0_5px_0_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.4)]
        "
      >
        Damage Calculator
      </h1>
      {/* MODIFIERS */ }
      <div className="bg-gray-400 p-3 rounded-t-2xl -mb-3">
        <div className="flex justify-center gap-4">
          {MODIFIER_TOGGLES.map(modifier => (
            <Toggle
              key={modifier.key}
              icon={modifier.icon}
              toggleKey={modifier.key}
              on={(modifier.type === "gag" ? gagModifiers : cogModifiers)[modifier.key].active}
              onToggle={modifier.type === "gag" ? handleGagToggle : handleCogToggle}
            />
          ))}
        </div>

      </div>
      {/* COG LEVELS */ }
      <div
        className="
          w-[90%] max-w-6xl min-w-[850px]
          h-16 xl:h-20
          bg-gray-400
          p-2 xl:p-3
          mb-4
          rounded-2xl
          shadow-[0_8px_8px_rgba(0,0,0,0.3)]
          flex flex-col
          gap-2
        "
      >
        <div className="flex h-full items-center overflow-hidden">
          {levels.map((entry, i) => {
            const health = getCogHealth(entry.health);
            return (
            <div
              key={i}
              className={`
                relative
                flex-1
                h-full
                box-border
                flex flex-col items-center justify-center
                border-2 border-gray-900
                text-gray-900
                font-remington
                ${getCogCellColor(health)}
                transition-colors duration-150
              `}
            >
              {entry.color && (
                <div
                  className={`
                    pointer-events-none
                    absolute inset-0
                    border-2
                  `}
                  style={{
                    borderStyle: "solid",
                    borderColor: `${entry.color}`,
                    backgroundColor: `${entry.color}22`,
                  }}
                />
              )}
              {/* SHIELD EFFECTS - each active shield is a ring further in so they all stay visible */}
              {shieldEffects.map((shield, j) => (
                <div
                  key={shield.color}
                  className="shield-effect z-10"
                  style={{ "--shield-rgb": shield.color, inset: `${j * 4}px` }}
                />
              ))}
              <div className="text-sm xl:text-lg font-bold leading-none">
                {entry.displayLevel ?? entry.level}
              </div>
              {/* Remaining HP, includes the hover preview */}
              <div className="text-xs xl:text-base leading-none mt-1 opacity-90">
                {Math.max(health - (previewOverallDamage ?? overallDamage), 0)}
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* COG LEVEL MODES */ }
      <div className="flex gap-4 justify-center mb-4">
        {levelModes.map(mode => {
          const isActive = levelsMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setLevelsMode(mode.id)}
              className={`
                relative
                p-1 rounded-xl border-2
                transition duration-150
                ${isActive
                  ? "border-yellow-400 bg-yellow-300/20 shadow-[0_4px_0_rgba(0,0,0,0.8)]"
                  : "border-black/40 bg-black/20 hover:bg-black/30"
                }
                active:translate-y-[2px]
                active:shadow-none
              `}
            >
              <img
                src={mode.image}
                alt={mode.id}
                className={`
                  w-[150px] h-[45px] xl:w-[200px] xl:h-[60px]
                  rounded-lg
                  transition
                  ${isActive
                    ? "brightness-110"
                    : "opacity-80 hover:opacity-100"
                  }
                `}
              />
            </button>

          );
        })}
      </div>


      {/* RESULTS BAR */ }
      <div className="w-[90%] max-w-6xl min-w-[850px] bg-red-600 pt-4 xl:pt-6 px-3 pb-1 rounded-3xl shadow-2xl border-4 border-red-700">

        <div className="bg-gray-100 rounded-xl mb-4 xl:mb-6 px-3 xl:px-4 flex items-center justify-between gap-4 h-16 xl:h-20 overflow-hidden text-center text-gray-700 inner-shadow">
          {selected.length === 0 && (
            <p className="text-xl xl:text-2xl flex-1 font-impress">
              No gags selected
            </p>
          )}

          {/* SELECTED GAGS - always a single row */}
          {selected.length > 0 && (
            <div className="flex items-center gap-2 xl:gap-4 min-w-0">
              <div className="flex flex-nowrap gap-1.5 xl:gap-3">
                {selected.map((gag, i) => (
                  <SelectedGag
                    key={i}
                    gag={gag}
                    showPlus={i > 0}
                    glare={gagModifiers.damageUp.active}
                    onRemove={() => handleRemoveGag(i)}
                  />
                ))}
              </div>
    
              {/* Total damage */}
              <div className="text-3xl xl:text-5xl font-impress text-neutral-900/50 whitespace-nowrap">
                = {currentTotalDamage}
              </div>
            </div>
          )}

          {/* NEW ROUND BUTTON - shown once a gag is selected, or while editing a round */}
          {(selected.length > 0 || isEditing) && (
          <button
            onClick={handleNewRound}
            className="
              shrink-0
              px-3 py-1.5 xl:px-5 xl:py-3
              text-white text-base xl:text-xl font-bold font-minnie
              rounded-xl xl:rounded-2xl
              transition-all
              shadow-[0_3px_0_rgba(0,0,0,0.9),0_7px_15px_rgba(0,0,0,0.45)]
              hover:brightness-110
              active:shadow-[0_1px_0_rgba(0,0,0,0.9)]
              active:translate-y-[2px]
            "
            style={{
              backgroundColor: "#00a2ffff",
              textShadow: "2px 2px rgba(0,0,0,0.85)",
            }}
          >
            NEW ROUND
          </button>
          )}
        </div>
      </div>
      <GagCalculator
        selected={selected}
        setSelected={setSelected}
        glare={gagModifiers.damageUp.active}
        onHoverChange={setHoverPreview}
        summary={
          rounds.length > 0
            ? <RoundHistory
                rounds={displayRounds}
                editingIndex={editingIndex}
                currentDamage={currentTotalDamage}
                overallDamage={overallDamage}
                onSelectRound={handleSelectRound}
                onRemoveRound={handleRemoveRound}
                onResetRounds={handleResetRounds}
              />
            : selected.length > 0 && <DamageSummary breakdown={damageBreakdown} />
        }
      />
      <div className="mt-8 w-full text-center text-lg text-neutral-900 pt-3 font-impress">
        Inspired by master reggie, check out his version{" "}
        <a
          href="https://big.brain.town/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-blue-300 underline transition"
        >
          here
        </a>
      </div>
    </div>
  );
}
