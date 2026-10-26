import { useState } from "react";

// Props: icon: image path
//        toggleKey: key passed back to onToggle
//        on: whether the toggle is on (controlled by the parent)
//        onToggle(key, nextValue): called when clicked
export default function Toggle({ icon, toggleKey, on, onToggle }) {
  const [hovered, setHovered] = useState(false);

  const highlighted = on || hovered;

  return (
    <button
      onClick={() => onToggle?.(toggleKey, !on)}  // ?. means call that method if it exists
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative
        w-10 h-10
        rounded-md
        flex items-center justify-center
        bg-gray-500
        border-2
        transition-all duration-300 ease-in-out
        ${highlighted ? "border-green-600" : "border-gray-700"}
        ${on ? "shadow-[0_0_10px_rgba(34,197,94,0.6)] bg-gray-600" : ""}
      `}
    >
      <img src={icon} alt="" className="w-7 h-7 pointer-events-none" />
    </button>
  );
}
