/// COG LEVEL BAR
// A row of cog cells showing each cog's remaining HP after the damage dealt.
// Props: levels: array of { level, health, displayLevel?, color?, shieldEffects? }
//          (an entry's shieldEffects replaces the bar's, for bars mixing cogs and supervisors)
//        getHealth(baseHealth): cog health including cog modifiers (e.g. overpaid)
//        getCellColor(health): background class for a cell (defeated, damaged, preview...)
//        damage: damage to subtract from each cog's HP (includes the hover preview)
//        shieldEffects: array of { color: "r, g, b" } active shields, drawn as one striped ring on every cell
//        className: optional extra classes for the bar (e.g. margins)
export default function CogLevelBar({ levels, getHealth, getCellColor, damage, shieldEffects, className = "" }) {
  // In a bar mixing cogs and supervisors, the plain cog levels get thin fixed-width cells so the supervisors get the room
  const mixed = levels.some(entry => entry.displayLevel);
  return (
    <div
      className={`
        cog-bar
        w-[90%] max-w-6xl min-w-[850px]
        h-16 xl:h-20
        bg-th-bar
        p-2 xl:p-3
        rounded-2xl
        shadow-[0_8px_8px_rgba(0,0,0,0.3)]
        ${className}
      `}
    >
      <div className="flex h-full items-center overflow-hidden">
        {levels.map(entry => {
          const health = getHealth(entry.health);
          const shields = entry.shieldEffects ?? shieldEffects;
          return (
            <div
              key={entry.displayLevel ?? entry.level}
              className={`
                cog-cell ${entry.displayLevel ? "cog-cell-named" : ""}
                relative
                ${mixed && !entry.displayLevel ? "flex-none w-9 xl:w-11" : "flex-1"}
                h-full
                box-border
                flex flex-col items-center justify-center
                border-2 border-th-cell-border
                text-th-cell-text
                font-remington
                ${getCellColor(health)}
                transition-colors duration-150
              `}
            >
              {/* DEPARTMENT TINT (supervisors) */}
              {entry.color && (
                <div
                  className="cog-cell-tint pointer-events-none absolute inset-0 border-2"
                  style={{
                    borderStyle: "solid",
                    borderColor: entry.color,
                    backgroundColor: `${entry.color}22`,
                  }}
                />
              )}

              {/* SHIELD EFFECT - one ring, striped with every active shield's colour */}
              {shields.length > 0 && (
                <div
                  className="shield-effect inset-0 z-10"
                  style={{ "--shield-rgb": shields[0].color, "--shield-stripes": shieldStripes(shields) }}
                />
              )}

              <div className="cog-cell-level text-sm xl:text-lg font-bold leading-none">
                {entry.displayLevel ?? entry.level}
              </div>
              {/* Remaining HP, includes the hover preview */}
              <div className="text-xs xl:text-base leading-none mt-1 opacity-90">
                {Math.max(health - damage, 0)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Diagonal stripes cycling through each shield colour, or a solid colour when only one is active
function shieldStripes(shields) {
  const STRIPE = 8; // px per stripe
  const stops = shields.map((shield, i) =>
    `rgba(${shield.color}, 0.95) ${i * STRIPE}px ${(i + 1) * STRIPE}px`
  );
  return `repeating-linear-gradient(45deg, ${stops.join(", ")})`;
}
