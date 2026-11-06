import { useState, useMemo } from "react";
import GagCalculator from "../components/GagCalculator";
import SelectedGag from "../components/SelectedGag";
import CogLevelBar from "../components/CogLevelBar";
import AccuracySummary from "../components/AccuracySummary";
import { COG_LEVELS, calculateAccuracy } from "../data/accuracy";
import { loadTheme } from "../data/theme";

// The right panel shows 3 levels per track, its arrows move them 1 level at a time
const SUMMARY_SIZE = 3;

export default function AccuracyCalculator() {
  const [selected, setSelected] = useState([]);
  const [theme] = useState(loadTheme); // Follows the style picked on the damage calculator
  const [summaryStart, setSummaryStart] = useState(11); // First level shown in the right panel
  const [hitTracks, setHitTracks] = useState([]); // Tracks the user marked as already hit

  // A track that's no longer selected loses its mark, so adding it again starts fresh
  const liveHitTracks = hitTracks.filter(track => selected.some(gag => gag.track === track));
  if (liveHitTracks.length !== hitTracks.length) setHitTracks(liveHitTracks);

  // Every level's accuracy for the selected gags
  const levels = useMemo(
    () => COG_LEVELS.map(entry => ({ level: entry.level, ...calculateAccuracy(selected, entry.def, entry.health, hitTracks) })),
    [selected, hitTracks]
  );

  // The track whose accuracy the bar shows instead of the chance to kill, or null
  const barTrack = getBarTrack(selected);

  // The chance shown in the bar's cells
  const barLevels = levels.map(entry => ({ level: entry.level, health: barTrack ? entry.tracks[barTrack] : entry.cogDies }));

  const summaryColumns = levels.slice(summaryStart - 1, summaryStart - 1 + SUMMARY_SIZE);

  // Green when it's nearly certain, light green with any chance, red with none
  // Track accuracy: green at 95% or more, light green from 80%, red below that
  function getCellColor(chance) {
    if (chance === null) return "bg-th-cell";
    if (chance >= (barTrack ? 95 : 90)) return "bg-th-cell-dead";
    return chance >= (barTrack ? 80 : 1) ? "bg-th-cell-preview" : "bg-th-cell-hit";
  }

  function toggleHitTrack(track) {
    setHitTracks(prev => prev.includes(track) ? prev.filter(hit => hit !== track) : [...prev, track]);
  }

  const handleRemoveGag = (indexToRemove) => {
    setSelected(prev =>
      prev.filter((_, i) => i !== indexToRemove)
    );
  };

  return (
    <div
      data-theme={theme}
      className="th-page min-h-screen w-full flex flex-col items-center justify-start p-6"
    >
      <h1
        className="
          text-4xl xl:text-6xl font-bold mb-4 text-th-title py-4 xl:py-8 font-minnie
          [text-shadow:var(--th-title-shadow)]
        "
      >
        Accuracy Calculator
      </h1>

      {/* BAR LABEL - tab on top of the levels bar, in the spot the damage calculator has its modifiers */}
      <div className="bg-th-bar px-5 pt-2 pb-4 rounded-t-2xl -mb-3">
        <p
          className="text-white text-base xl:text-xl font-bold font-minnie"
          style={{ textShadow: "1px 1px rgba(0,0,0,0.85)" }}
        >
          {barTrack === "lure" ? "Lure hit chance" : barTrack ? "Gag Accuracy" : "Chance cog dies"}
        </p>
      </div>

      {/* COG LEVELS - each cell shows the chance named in the label above */}
      <CogLevelBar
        levels={barLevels}
        className="mb-4"
        getHealth={chance => chance}
        getCellColor={getCellColor}
        formatValue={chance => chance === null ? "__" : `${chance}%`}
      />

      {/* RESULTS BAR */ }
      <div className="w-[90%] max-w-6xl min-w-[850px] bg-th-panel pt-4 xl:pt-6 px-3 pb-1 rounded-3xl shadow-2xl border-4 border-th-panel-border">
        <div className="bg-th-surface rounded-xl mb-4 xl:mb-6 px-3 xl:px-4 flex items-center gap-4 h-16 xl:h-20 overflow-hidden text-center text-th-surface-muted inner-shadow">
          {selected.length === 0 && (
            <p className="text-xl xl:text-2xl flex-1 font-impress">
              No gags selected
            </p>
          )}

          {/* SELECTED GAGS - always a single row */}
          {selected.length > 0 && (
            <div className="flex flex-nowrap gap-1.5 xl:gap-3">
              {selected.map((gag, i) => (
                <SelectedGag
                  key={i}
                  gag={gag}
                  showPlus={i > 0}
                  onRemove={() => handleRemoveGag(i)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <GagCalculator
        selected={selected}
        setSelected={setSelected}
        summary={selected.length > 0 && (
          <AccuracySummary
            gags={selected}
            columns={summaryColumns}
            hitTracks={hitTracks}
            onToggleHit={toggleHitTrack}
            onPrevLevels={summaryStart > 1 ? () => setSummaryStart(summaryStart - 1) : null}
            onNextLevels={summaryStart + SUMMARY_SIZE <= levels.length ? () => setSummaryStart(summaryStart + 1) : null}
          />
        )}
      />
    </div>
  );
}

// Only lure, or lure and trap, shows the lure. Any other single track shows that track
// Trap alone has no accuracy of its own, so it stays on the chance to kill
function getBarTrack(selected) {
  const tracks = new Set(selected.map(gag => gag.track));
  if (tracks.has("lure") && [...tracks].every(track => track === "lure" || track === "trap")) return "lure";
  return tracks.size === 1 && !tracks.has("trap") ? [...tracks][0] : null;
}
