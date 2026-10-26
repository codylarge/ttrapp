import { getGagImage } from "../data/gags";

/// GAG BUTTON
// A single gag in the gag picker. Shows the organic badge while hovered.
// Props: gag: gag data object
//        isHovered: whether this gag is the one being hovered
//        organicHovered: whether the organic badge is being hovered
//        glare: shows the damage up glare effect
//        onAdd(gag, org): called when the gag (or its organic badge) is clicked
//        onHover(gag), onLeave(): hover start / end
//        onOrganicHover(bool): organic badge hover start / end
export default function GagButton({
  gag,
  isHovered,
  organicHovered,
  glare,
  onAdd,
  onHover,
  onLeave,
  onOrganicHover,
}) {
  return (
    <button
      onClick={() => onAdd(gag, false)}
      onMouseEnter={() => onHover(gag)}
      onMouseLeave={onLeave}
      className="relative flex-1 min-w-0 flex justify-center px-1 py-1 xl:py-1.5 rounded-xl xl:rounded-2xl
      hover:brightness-125
      active:brightness-90 active:scale-95
      transition duration-150 ease-in-out"
      style={{
        backgroundColor: "#00a2ffff",
        boxShadow: `
          inset 0 0 2px rgb(0, 0, 0, .9),
          inset 0 0 5px rgba(0, 0, 0, 0.8),
          0 3px 2px #183269
        `,
      }}
    >
      {/* ORGANIC BADGE */}
      {isHovered && (
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation(); // prevent normal gag click
            onAdd(gag, true);
          }}
          onMouseEnter={() => onOrganicHover(true)}
          onMouseLeave={() => onOrganicHover(false)}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition"
        >
          <img
            src={organicHovered ? "/images/ui/organic-active.webp" : "/images/ui/organic-inactive.webp"}
            className="w-8 h-8 pointer-events-none"
          />
        </div>
      )}

      {/* GAG IMAGE */}
      <img
        src={getGagImage(gag)}
        alt={gag.name}
        className="w-9 h-9 xl:w-11 xl:h-11 object-contain"
      />
      {glare && <span className="gag-glare" />}
    </button>
  );
}
