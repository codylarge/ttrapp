/// COG LEVEL BAR
// A row of cog cells showing each cog's remaining HP after the damage dealt.
// Props: levels: array of { level, health, displayLevel?, color? }
//        getHealth(baseHealth): cog health including cog modifiers (e.g. overpaid)
//        getCellColor(health): background class for a cell (defeated, damaged, preview...)
//        damage: damage to subtract from each cog's HP (includes the hover preview)
//        shieldEffects: array of { color: "r, g, b" } shield overlays to draw on every cell
//        className: optional extra classes for the bar (e.g. margins)
export default function CogLevelBar({ levels, getHealth, getCellColor, damage, shieldEffects, className = "" }) {
  return (
    <div
      className={`
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
          return (
            <div
              key={entry.displayLevel ?? entry.level}
              className={`
                cog-cell ${entry.displayLevel ? "cog-cell-named" : ""}
                relative
                flex-1
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

              {/* SHIELD EFFECTS - each active shield is a ring further in so they all stay visible */}
              {shieldEffects.map((shield, j) => (
                <div
                  key={shield.color}
                  className="shield-effect z-10"
                  style={{ "--shield-rgb": shield.color, inset: `${j * 4}px` }}
                />
              ))}

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
