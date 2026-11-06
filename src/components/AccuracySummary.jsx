import { GAG_TRACKS } from "../data/gags";

/// ACCURACY SUMMARY
// Each selected track's chance to hit at a few cog levels, shown in the gag calculator's right panel.
// Props: gags: selected gags
//        columns: array of { level, tracks, cogDies } from calculateAccuracy, one per level shown
//        hitTracks: tracks marked as already hit
//        onToggleHit(track): called by clicking a track's row
//        onPrevLevels(), onNextLevels(): called by the level arrows, null when there are no more levels that way
export default function AccuracySummary({ gags, columns, hitTracks, onToggleHit, onPrevLevels, onNextLevels }) {
  // Keep tracks in game order (trap, lure, sound, ...)
  const tracks = GAG_TRACKS.filter(track => gags.some(gag => gag.track === track.name));
  const anyMarkable = tracks.some(track => canMarkHit(track.name, gags));

  return (
    <div className="w-full text-sm xl:text-lg font-impress text-th-surface-text">
      <h2 className="font-bold text-lg xl:text-xl mb-2 xl:mb-3">Accuracy Summary</h2>

      <SummaryRow
        label="Cog level"
        values={columns.map(column => column.level)}
        before={<LevelArrow direction="left" onClick={onPrevLevels} />}
        after={<LevelArrow direction="right" onClick={onNextLevels} />}
      />
      {anyMarkable && <p className="mb-1 text-xs xl:text-sm text-left text-th-surface-muted">Click a track to guarantee it hits</p>}
      {tracks.map(track => (
        <SummaryRow
          key={track.name}
          label={capitalize(track.name)}
          color={track.color}
          values={columns.map(column => formatPercent(column.tracks[track.name]))}
          marked={hitTracks.includes(track.name)}
          onClick={canMarkHit(track.name, gags) ? () => onToggleHit(track.name) : undefined}
        />
      ))}

      <div className="border-t-2 border-th-divider mt-2 pt-2">
        <SummaryRow label="Cog dies" values={columns.map(column => formatPercent(column.cogDies))} bold />
      </div>
    </div>
  );
}

// With onClick the whole row is a button, and marked rows turn green
function SummaryRow({ label, values, color, before, after, onClick, marked = false, bold = false }) {
  const Row = onClick ? "button" : "div";
  return (
    <Row
      onClick={onClick}
      aria-pressed={onClick ? marked : undefined}
      title={onClick ? (marked ? "Undo already hit" : "Mark this track as already hit") : undefined}
      className={`
        flex items-center w-full -mx-1 px-1 box-content rounded transition-colors
        ${bold || marked ? "font-bold" : "text-th-surface-muted"}
        ${marked ? "bg-green-500/30" : onClick ? "hover:bg-green-500/15" : ""}
      `}
    >
      <span className="flex items-center gap-2 flex-1 min-w-0 text-left whitespace-nowrap">
        {color && (
          <span className="w-3 h-3 rounded-full border border-neutral-700 flex items-center justify-center" style={{ backgroundColor: color }}>
            {marked && (
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 5.5 L4.2 7.5 L8 2.5" />
              </svg>
            )}
          </span>
        )}
        {label}
      </span>
      {before}
      {values.map((value, i) => (
        <span key={i} className="w-10 xl:w-14 text-center whitespace-nowrap">{value}</span>
      ))}
      {/* Every row keeps this slot so the values line up under the level numbers */}
      <span className="w-4 xl:w-5 shrink-0 flex justify-end">{after}</span>
    </Row>
  );
}

// Trap follows the lure, and an SOS track is already 100%
function canMarkHit(track, gags) {
  return track !== "trap" && !gags.some(gag => gag.track === track && gag.sos);
}

// Small triangle that moves the shown levels, faded out when there's nowhere left to go
function LevelArrow({ direction, onClick }) {
  const isLeft = direction === "left";
  return (
    <button
      onClick={onClick ?? undefined}
      disabled={!onClick}
      aria-label={isLeft ? "Lower cog levels" : "Higher cog levels"}
      className="w-4 xl:w-5 h-4 xl:h-5 shrink-0 flex items-center justify-center text-th-surface-text transition hover:scale-125 disabled:opacity-25 disabled:hover:scale-100"
    >
      <svg viewBox="0 0 10 12" className="w-2.5 h-3 xl:w-3 xl:h-3.5" fill="currentColor">
        <path d={isLeft ? "M9 1 L1 6 L9 11 Z" : "M1 1 L9 6 L1 11 Z"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function formatPercent(value) {
  return value == null ? "—" : `${value}%`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
