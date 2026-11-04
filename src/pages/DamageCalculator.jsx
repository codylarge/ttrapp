import { useState, useMemo } from "react";
import GagCalculator from "../components/GagCalculator";
import SelectedGag from "../components/SelectedGag";
import DamageSummary from "../components/DamageSummary";
import RoundHistory from "../components/RoundHistory";
import Toggle from "../components/Toggle";
import CogLevelBar from "../components/CogLevelBar";
import { MAX_SELECTED, createSelectedGag } from "../data/gags";

// Modifier toggles in display order. type says which state object the key belongs to
// options: optional types the user picks from in the type menu (effect replaces the modifier's effect)
//          the starting type is set in the cogModifiers / gagModifiers state below
const MODIFIER_TOGGLES = [
  {
    key: "damageUp", type: "gag", icon: "/images/ui/modifiers/damage-up.png", name: "Damage Up",
    options: [
      { id: "coin", value: "+25%", label: "Coin", effect: 1.25, description: "Gags deal 25% more damage." },
      { id: "bull", value: "+50%", label: "Bull", effect: 1.5, description: "Gags deal 50% more damage." },
    ],
  },
  { key: "defenseUp", type: "gag", icon: "/images/ui/modifiers/defense-up-boiler.png", name: "Defense Up", description: "Cogs take 10% less damage from gags." },
  {
    key: "overpaid", type: "cog", icon: "/images/ui/modifiers/overpaid.png", name: "Overpaid",
    options: [
      { id: "coin", value: "+150 HP", label: "Coin", effect: 150, description: "Cogs gain +150 HP. Supervisors are unaffected." },
      { id: "bull", value: "+200 HP", label: "Bull", effect: 200, description: "Cogs gain +200 HP. Supervisors are unaffected." },
    ],
  },
  {
    key: "defenseDown", type: "gag", icon: "/images/ui/modifiers/defense-down.png", name: "Defense Down",
    options: [
      { id: "1", value: "-20%", label: "Level 1", effect: 1.2, description: "Cogs take 20% more damage from gags." },
      { id: "2", value: "-40%", label: "Level 2", effect: 1.4, description: "Cogs take 40% more damage from gags." },
      { id: "3", value: "-60%", label: "Level 3", effect: 1.6, description: "Cogs take 60% more damage from gags." },
    ],
  },
];

// Cog departments for the supervisor toggles. palette sets the toon-btn colour variables (see index.css)
const DEPARTMENTS = [
  {
    id: "sellbot", label: "Sell",
    palette: { "--fill-top": "#c47b98", "--fill-bottom": "#9e5c75", "--border-top": "#8a4d65", "--border-bottom": "#6e3a4f", "--ledge": "#5a2f40" },
  },
  {
    id: "cashbot", label: "Cash",
    palette: { "--fill-top": "#40a680", "--fill-bottom": "#287c5f", "--border-top": "#22694f", "--border-bottom": "#1a523d", "--ledge": "#144030" },
  },
  {
    id: "lawbot", label: "Law",
    palette: { "--fill-top": "#5d7bbd", "--fill-bottom": "#3f5a96", "--border-top": "#344b7e", "--border-bottom": "#283a63", "--ledge": "#1f2e4f" },
  },
  {
    id: "bossbot", label: "Boss",
    palette: { "--fill-top": "#9c4b20", "--fill-bottom": "#702f0c", "--border-top": "#5e270a", "--border-bottom": "#4a1f08", "--ledge": "#3a1806" },
  },
];

// The theme the user last picked, or classic
function loadTheme() {
  try {
    return localStorage.getItem("damageCalcTheme") === "tracker" ? "tracker" : "classic";
  } catch {
    return "classic";
  }
}

export default function DamageCalculator() {
  const [selected, setSelected] = useState([]);
  const [rounds, setRounds] = useState([]); // Saved rounds: { gags, modifiers, total }
  const [editingIndex, setEditingIndex] = useState(null); // Index of the round open in the calculator, or null for a new round
  const [hoverPreview, setHoverPreview] = useState(null); // { gag, organic } of the hovered gag, or null
  const [levelsMode, setLevelsMode] = useState("normal");
  const [activeDepts, setActiveDepts] = useState(DEPARTMENTS.map(dept => dept.id)); // Departments shown in supervisors mode, all on by default
  const [theme, setTheme] = useState(loadTheme); // "classic" or "tracker", see THEMES in index.css

  function toggleTheme() {
    const next = theme === "classic" ? "tracker" : "classic";
    setTheme(next);
    try { localStorage.setItem("damageCalcTheme", next); } catch { /* storage blocked, just don't remember it */ }
  }

  // option: the picked type for modifiers that have options (see MODIFIER_TOGGLES), effect follows it
  const [cogModifiers, setCogModifiers] = useState({
    overpaid: { active: false, effect: 200, option: "bull" } // Bonus HP added to each cog
  });

  const [gagModifiers, setGagModifiers] = useState({
    damageUp: { active: false, effect: 1.5, option: "bull" }, // Gags deal +50% damage
    defenseDown: { active: false, effect: 1.2, option: "1" }, // Gags deal +20/40/60% damage
    defenseUp: { active: false, effect: 0.9 }                 // Cogs take 10% less damage, gags deal 90%
  });

  // Shield overlays shown on the cog levels bar, color is "r, g, b"
  // cogOnly: the shield comes from a cog modifier, so supervisors (which it skips) don't show it
  const shieldEffects = [
    { active: cogModifiers.overpaid.active, color: "34, 197, 94", cogOnly: true },
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
    if (overallDamage >= health) return "bg-th-cell-dead";                                       // Defeated
    if (previewOverallDamage !== null && previewOverallDamage >= health) return "bg-th-cell-preview"; // Would be defeated
    if (overallDamage > 0) return "bg-th-cell-hit";                                              // Damaged, survives
    return "bg-th-cell";
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
    { level: 1, displayLevel: "Scrap", health: 250, color: "#9e5c75", dept: "sellbot" },
    { level: 2, displayLevel: "Steel", health: 750, color: "#9e5c75", dept: "sellbot" },
    { level: 3, displayLevel: "Coin", health: 750, color: "#287c5f", dept: "cashbot" },
    { level: 4, displayLevel: "Bull", health: 1150, color: "#287c5f", dept: "cashbot" },
    { level: 5, displayLevel: "Junior", health: 1100, color: "#3F5A96", dept: "lawbot" },
    { level: 6, displayLevel: "Senior", health: 1500, color: "#3F5A96", dept: "lawbot" },
    { level: 7, displayLevel: "Fairway", health: 1200, color: "#702F0C", dept: "bossbot" },
    { level: 8, displayLevel: "Fringe", health: 1750, color: "#702F0C", dept: "bossbot" },
  ];

  // Supervisors from the departments that are toggled on
  const visibleSupers = levelsSupers.filter(level => activeDepts.includes(level.dept));

  // Turn a department on or off in supervisors mode
  // Show / hide a department's supervisors
  // Hiding the last one goes back to default mode, with every department ready for next time
  function toggleDept(id) {
    const next = activeDepts.includes(id) ? activeDepts.filter(dept => dept !== id) : [...activeDepts, id];

    if (next.length === 0) {
      setLevelsMode("normal");
      setActiveDepts(DEPARTMENTS.map(dept => dept.id));
      return;
    }
    setActiveDepts(next);
  }

  const levelsFieldOffice = [

    { level: 1, displayLevel: "1★ Boiler", health: 4000},
    { level: 2, displayLevel: "2★ Boiler", health: 4500},
    { level: 3, displayLevel: "3★ Boiler", health: 5000},
    { level: 4, displayLevel: "4★ Boiler", health: 5500},
  ];

  const levelModes = [
    {
      id: "normal",
      image: "/images/ui/modes/normal.webp",
    },
    {
      id: "supervisors",
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


  // Shared props for every cog level bar, they all show the same damage and modifiers
  const cogBarProps = {
    getHealth: getCogHealth,
    getCellColor: getCogCellColor,
    damage: previewOverallDamage ?? overallDamage,
    shieldEffects,
  };

  // Supervisor bar: cog levels 9-16 then the shown supervisors
  // Cog modifiers (overpaid) only affect the regular cogs, so their health and shields are baked in here
  const levelsSupersBar = [
    ...levelsNormal
      .filter(entry => entry.level >= 9 && entry.level <= 16)
      .map(entry => ({ ...entry, health: getCogHealth(entry.health) })),
    ...visibleSupers.map(entry => ({ ...entry, shieldEffects: shieldEffects.filter(shield => !shield.cogOnly) })),
  ];

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

  // Switch a modifier to another of its options (e.g. Overpaid Coin -> Bull)
  function handleOptionSelect(key, optionId) {
    const toggle = MODIFIER_TOGGLES.find(modifier => modifier.key === key);
    const option = toggle.options.find(o => o.id === optionId);
    const setModifiers = toggle.type === "gag" ? setGagModifiers : setCogModifiers;

    setModifiers(prev => ({
      ...prev,
      [key]: { ...prev[key], option: option.id, effect: option.effect },
    }));
  }

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

  // Modifier toggles that are currently on, with the picked option and effect (so a round can restore them)
  function getActiveModifiers() {
    return MODIFIER_TOGGLES
      .map(modifier => {
        const state = (modifier.type === "gag" ? gagModifiers : cogModifiers)[modifier.key];
        const option = modifier.options?.find(o => o.id === state.option);
        return { ...modifier, active: state.active, option: state.option, effect: state.effect, optionLabel: option?.label };
      })
      .filter(modifier => modifier.active);
  }

  // The calculator's current gags and modifiers as a round
  function makeCurrentRound() {
    return { gags: selected, modifiers: getActiveModifiers(), total: currentTotalDamage };
  }

  // Put a saved round's gags and modifiers back into the calculator
  function loadRound(round) {
    const saved = new Map(round.modifiers.map(modifier => [modifier.key, modifier]));
    const setActive = prev => Object.fromEntries(
      Object.entries(prev).map(([key, modifier]) => {
        const savedModifier = saved.get(key);
        if (!savedModifier) return [key, { ...modifier, active: false }];
        return [key, { ...modifier, active: true, effect: savedModifier.effect, option: savedModifier.option }];
      })
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
      data-theme={theme}
      className="th-page min-h-screen w-full flex flex-col items-center justify-start p-6" // top-aligned so the supervisor bar doesn't shift everything up
    >
      {/* THEME SWITCH - top right, opposite the back button */}
      <button
        onClick={toggleTheme}
        className="toon-btn toon-btn-blue fixed top-3 right-3 xl:top-4 xl:right-4 z-50 px-4 py-1 rounded-full text-white text-sm xl:text-base font-bold font-minnie"
        style={{ textShadow: "1px 1px rgba(0,0,0,0.85)" }}
      >
        {theme === "classic" ? "Tracker style" : "Classic style"}
      </button>

      <h1
        className="
          text-4xl xl:text-6xl font-bold mb-4 text-th-title py-4 xl:py-8 font-minnie
          [text-shadow:var(--th-title-shadow)]
        "
      >
        Damage Calculator
      </h1>
      {/* MODIFIERS */ }
      <div className="bg-th-bar p-3 rounded-t-2xl -mb-3">
        <div className="flex justify-center gap-4">
          {MODIFIER_TOGGLES.map(modifier => (
            <Toggle
              key={modifier.key}
              icon={modifier.icon}
              name={modifier.name}
              description={modifier.description}
              options={modifier.options}
              selectedOption={(modifier.type === "gag" ? gagModifiers : cogModifiers)[modifier.key].option}
              onSelectOption={handleOptionSelect}
              toggleKey={modifier.key}
              on={(modifier.type === "gag" ? gagModifiers : cogModifiers)[modifier.key].active}
              onToggle={modifier.type === "gag" ? handleGagToggle : handleCogToggle}
            />
          ))}
        </div>
      </div>
      {/* COG LEVELS - supervisors mode swaps the normal 1-20 bar for the supervisor bar */}
      {levelsMode === "supervisors" && (
        <>
          <CogLevelBar
            levels={levelsSupersBar}
            className="slide-in"
            {...cogBarProps}
            getHealth={health => health} // Already applied per entry in levelsSupersBar
          />

          {/* DEPARTMENT TAB - hangs under the middle of the supervisor bar, click a department to show / hide it */}
          <div className="slide-in bg-th-bar rounded-b-xl px-2 pb-1.5 flex gap-1.5 mb-4">
            {DEPARTMENTS.map(dept => {
              const isOn = activeDepts.includes(dept.id);
              return (
                <button
                  key={dept.id}
                  onClick={() => toggleDept(dept.id)}
                  aria-pressed={isOn}
                  title={isOn ? `Hide ${dept.label} supervisors` : `Show ${dept.label} supervisors`}
                  className={`
                    toon-btn
                    flex items-center gap-1
                    pl-1 pr-2 py-0.5
                    rounded-md
                    text-white text-xs xl:text-sm font-bold font-minnie
                    ${isOn ? "" : "grayscale opacity-60"}
                  `}
                  style={{ ...dept.palette, textShadow: "1px 1px rgba(0,0,0,0.85)" }}
                >
                  {/* CHECKBOX - ticked while the department is shown */}
                  <span className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 rounded-sm bg-white border border-black/40 flex items-center justify-center">
                    {isOn && (
                      <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 xl:w-3 xl:h-3" fill="none" stroke="var(--border-bottom)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8.5l3.5 3.5L13 4.5" />
                      </svg>
                    )}
                  </span>
                  {dept.label}
                </button>
              );
            })}
          </div>
        </>
      )}
      {/* Normal 1-20 bar, default mode only */}
      {levelsMode === "normal" && (
        <CogLevelBar levels={levelsNormal} className="mb-4" {...cogBarProps} />
      )}

      {/* COG LEVEL MODES */ }
      <div className="flex gap-4 justify-center items-center mb-4">
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
      <div className="w-[90%] max-w-6xl min-w-[850px] bg-th-panel pt-4 xl:pt-6 px-3 pb-1 rounded-3xl shadow-2xl border-4 border-th-panel-border">

        <div className="bg-th-surface rounded-xl mb-4 xl:mb-6 px-3 xl:px-4 flex items-center justify-between gap-4 h-16 xl:h-20 overflow-hidden text-center text-th-surface-muted inner-shadow">
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
              <div className="text-3xl xl:text-5xl font-impress text-th-surface-muted whitespace-nowrap">
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
              toon-btn toon-btn-blue [--depth:3px]
            "
            style={{ textShadow: "2px 2px rgba(0,0,0,0.85)" }}
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
        summary={ // 3 Options: Saved rounds, No saved rounds but gags selected, No rounds no gags
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
      <div className="mt-8 w-full text-center text-lg text-th-footer pt-3 font-impress">
        Inspired by master reggie, check out his version{" "}
        <a
          href="https://big.brain.town/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-th-footer hover:text-blue-300 underline transition"
        >
          here
        </a>
      </div>
    </div>
  );
}
