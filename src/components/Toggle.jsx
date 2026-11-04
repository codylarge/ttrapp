import { useState, useEffect, useRef } from "react";

// Props: icon: image path
//        name: optional display name, shown in the info popup on hover
//        description: optional effect text, shown in the info popup on hover
//        options: optional types to pick from, [{ id, value, label, description }] (e.g. Overpaid Coin / Bull)
//        selectedOption: id of the picked option
//        onSelectOption(key, id): called when an option is picked
//        toggleKey: key passed back to onToggle
//        on: whether the toggle is on (controlled by the parent)
//        onToggle(key, nextValue): called when clicked
export default function Toggle({ icon, name, description, options, selectedOption, onSelectOption, toggleKey, on, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);

  const highlighted = on || hovered;
  const selected = options?.find(option => option.id === selectedOption);

  // Close the option menu when clicking anywhere else
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (!wrapperRef.current?.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Normal click just turns the modifier on (with its current type) or off
  function handleClick() {
    onToggle?.(toggleKey, !on);  // ?. means call that method if it exists
    setMenuOpen(false);
  }

  // Right click opens the type menu instead of the browser's menu, turning the modifier on if it was off
  function handleRightClick(e) {
    if (!options) return;
    e.preventDefault();
    if (!on) onToggle?.(toggleKey, true);
    setMenuOpen(open => !open);
  }

  function pickOption(id) {
    onSelectOption?.(toggleKey, id);
    setMenuOpen(false);
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className={`
          relative
          w-10 h-10
          rounded-md
          flex items-center justify-center
          bg-th-toggle
          border-2
          transition-all duration-300 ease-in-out
          ${highlighted ? "border-green-600" : "border-th-toggle-border"}
          ${on ? "shadow-[0_0_10px_rgba(34,197,94,0.6)] bg-th-toggle-on" : ""}
        `}
      >
        <img src={icon} alt="" className="w-7 h-7 pointer-events-none" />
      </button>

      {/* VALUE BADGE - the picked option while on (e.g. +200 HP), click it to change the type */}
      {on && selected && (
        <button
          onClick={() => setMenuOpen(open => !open)}
          onContextMenu={handleRightClick}
          title="Change type"
          className="
            absolute -bottom-2 left-1/2 -translate-x-1/2 z-20
            px-1.5 rounded-full
            bg-green-600 border border-green-800
            text-white text-[10px] font-bold font-impress leading-4 whitespace-nowrap
            hover:bg-green-500
          "
        >
          {selected.value.replace(" HP", "")} ▾
        </button>
      )}

      {/* INFO POPUP - icon, name and effect, shown above the toggle while hovered */}
      {hovered && !menuOpen && name && (
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
            w-56 p-3
            bg-th-surface rounded-xl border-2 border-th-toggle-border
            shadow-[0_6px_12px_rgba(0,0,0,0.4)]
            pointer-events-none
            text-left
          "
        >
          {/* Little arrow pointing down at the toggle */}
          <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-th-surface border-r-2 border-b-2 border-th-toggle-border" />

          <div className="flex items-center gap-2 mb-1">
            <img src={icon} alt="" className="w-8 h-8" />
            <span className="font-minnie text-lg font-bold text-th-surface-text">
              {name}{selected && <span className="text-th-surface-muted text-sm"> · {selected.label}</span>}
            </span>
          </div>
          <p className="font-impress text-sm text-th-surface-text leading-snug">{selected?.description ?? description}</p>
          <p className={`font-impress text-xs mt-1 font-bold ${on ? "text-green-600" : "text-th-surface-muted"}`}>
            {on ? "Active" : "Click to activate"}
          </p>
        </div>
      )}

      {/* OPTION MENU - compact dark row of types, opens from the badge arrow or a right click */}
      {menuOpen && options && (
        <div
          className="
            absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50
            p-1.5 flex gap-1
            bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-white/10
            shadow-[0_6px_12px_rgba(0,0,0,0.4)]
          "
        >
          {/* Little arrow pointing up at the toggle */}
          <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-neutral-900/80 border-l border-t border-white/10" />

          {options.map((option, i) => {
            const isPicked = option.id === selectedOption;
            // Stronger types get a brighter, glowier icon so they're easy to tell apart
            const strength = options.length > 1 ? i / (options.length - 1) : 1;
            return (
              <button
                key={option.id}
                onClick={() => pickOption(option.id)}
                title={option.description}
                className={`
                  w-14 py-1 rounded-lg border flex flex-col items-center transition
                  ${isPicked ? "border-green-500 bg-green-500/20" : "border-transparent hover:bg-white/10"}
                `}
              >
                <img
                  src={icon}
                  alt=""
                  className="w-6 h-6"
                  style={{
                    filter: `brightness(${0.7 + strength * 0.5}) saturate(${0.7 + strength * 0.8})`
                      + (strength === 1 ? " drop-shadow(0 0 4px rgba(255,255,255,0.6))" : ""),
                  }}
                />
                <span className={`font-impress text-xs font-bold leading-tight whitespace-nowrap ${isPicked ? "text-green-400" : "text-white"}`}>
                  {option.value.replace(" HP", "")}
                </span>
                <span className="font-impress text-[10px] text-neutral-400 leading-tight">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
