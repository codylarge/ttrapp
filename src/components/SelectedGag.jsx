import { getGagImage } from "../data/gags";

/// SELECTED GAG
// A gag in the results bar. Clicking it removes it. Shows a "+" before every gag but the first.
// Props: gag: selected gag object
//        showPlus: whether to show the "+" before this gag
//        glare: shows the damage up glare effect
//        onRemove(): called when clicked
export default function SelectedGag({ gag, showPlus, glare = false, onRemove }) {
  return (
    <div
      role="button"
      onClick={onRemove}
      className={showPlus
        ? "shrink-0 grid grid-cols-[14px_auto] xl:grid-cols-[24px_auto] items-center gap-1 xl:gap-2"
        : "shrink-0 grid grid-cols-1 items-center"}
    >
      {showPlus && (
        <span className="text-neutral-900 text-2xl xl:text-3xl font-bold flex justify-center">
          +
        </span>
      )}

      <div
        className="
        relative
        px-2 py-1.5 xl:px-3 xl:py-2 rounded-xl
        hover:brightness-125
        active:brightness-90 active:scale-95
        transition duration-150 ease-in-out
        "
        style={{
          backgroundColor: gag.org ? "#FFBB00" : "#00a2ffff", // Gold when organic
          boxShadow: `
            inset 0 4px 6px rgba(0, 0, 0, 0.25),
            2px 2px 0px #1d3b7d
          `,
        }}
      >
        <img
          src={getGagImage(gag)}
          alt={gag.name}
          className="w-10 h-8 xl:w-14 xl:h-9 object-contain"
        />
        {glare && <span className="gag-glare" />}
      </div>
    </div>
  );
}
