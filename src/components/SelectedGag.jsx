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
      title={gag.sos ? `SOS: ${gag.sos}` : undefined}
      className={showPlus
        ? "shrink-0 grid grid-cols-[14px_auto] xl:grid-cols-[24px_auto] items-center gap-1 xl:gap-2"
        : "shrink-0 grid grid-cols-1 items-center"}
    >
      {showPlus && (
        <span className="text-th-surface-text text-2xl xl:text-3xl font-bold flex justify-center">
          +
        </span>
      )}

      <div
        className={`
        toon-btn ${gag.sos ? "toon-btn-sos" : gag.org ? "toon-btn-gold" : "toon-btn-blue"}
        relative
        px-2 py-1.5 xl:px-3 xl:py-2 rounded-xl
        `}
      >
        <img
          src={getGagImage(gag)}
          alt={gag.name}
          className="w-10 h-8 xl:w-14 xl:h-9 object-contain"
        />
        {gag.sos && (
          <span
            className="absolute top-0.5 left-1 text-[10px] xl:text-xs leading-none font-bold font-impress text-[#13575e] pointer-events-none"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.7)" }}
          >
            SOS
          </span>
        )}
        {glare && <span className="gag-glare" />}
      </div>
    </div>
  );
}
