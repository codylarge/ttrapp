import { useState } from "react";

export default function Toggle({ icon, onChange }) {
  const [on, setOn] = useState(false);
  const [hovered, setHovered] = useState(false);

  const active = on || hovered;

  const handleClick = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };

  return (
    <button
      onClick={handleClick}
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
        ${active ? "border-green-600" : "border-gray-700"}
        ${on ? "shadow-[0_0_10px_rgba(34,197,94,0.6)]  bg-gray-600" : ""}
      `}
    >
      {/* Icon */}
      <img
        src={icon}
        alt=""
        className="w-7 h-7 pointer-events-none"
      />
    </button>
  );
}
