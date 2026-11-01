import { useState } from "react";

// Props: icon: image path
//        name: optional display name, shown in the info popup on hover
//        description: optional effect text, shown in the info popup on hover
//        toggleKey: key passed back to onToggle
//        on: whether the toggle is on (controlled by the parent)
//        onToggle(key, nextValue): called when clicked
export default function Toggle({ icon, name, description, toggleKey, on, onToggle }) {
  const [hovered, setHovered] = useState(false);

  const highlighted = on || hovered;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => onToggle?.(toggleKey, !on)}  // ?. means call that method if it exists
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

      {/* INFO POPUP - icon, name and effect, shown above the toggle while hovered */}
      {hovered && name && (
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
            <span className="font-minnie text-lg font-bold text-th-surface-text">{name}</span>
          </div>
          <p className="font-impress text-sm text-th-surface-text leading-snug">{description}</p>
          <p className={`font-impress text-xs mt-1 font-bold ${on ? "text-green-600" : "text-th-surface-muted"}`}>
            {on ? "Active" : "Click to activate"}
          </p>
        </div>
      )}
    </div>
  );
}
