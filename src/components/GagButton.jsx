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
      className="
        toon-btn toon-btn-blue
        relative flex-1 min-w-0 flex justify-center
        px-1 py-1
        rounded-xl xl:rounded-2xl
      "
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
            src={organicHovered ? "/images/ui/organic-inactive.png" : "/images/ui/organic-active.png"}
            className="w-8 h-8 pointer-events-none"
          />
        </div>
      )}

      {/* GAG IMAGE */}
      <img
        src={getGagImage(gag)}
        alt={gag.name}
        className="w-9 h-9 xl:w-11 xl:h-10 object-contain"
      />
      {glare && <span className="gag-glare" />}
    </button>
  );
}
