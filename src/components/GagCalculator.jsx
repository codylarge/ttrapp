import { useState } from "react";
import { GAG_TRACKS, GAGS, MAX_SELECTED, createSelectedGag } from "../data/gags";
import TrackRow from "./TrackRow";
import GagButton from "./GagButton";
import GagPreview from "./GagPreview";

/// GAG CALCULATOR COMPONENT
// When a gag is selected it is added to the 'selected' array in the parent component which can make calculations with it.
// Props: selected: array of selected gags
//        setSelected: function to update selected gags
//        panelClass: optional string for custom panel styling (menu background color)
//        glare: optional boolean, shows a glare effect on gags (e.g. damage up active)
//        summary: optional element shown in the right panel when no gag is hovered
//        onHoverChange({ gag, organic } | null): optional, called when the hovered gag changes
export default function GagCalculator({ selected, setSelected, panelClass = "bg-red-600 border-red-700", glare = false, summary = null, onHoverChange }) {
  const [hoveredGag, setHoveredGag] = useState(null);
  const [organicHovered, setOrganicHovered] = useState(false);

  // Update hover state and tell the parent (e.g. to preview damage on the cogs)
  function updateHover(gag, organic) {
    setHoveredGag(gag);
    setOrganicHovered(organic);
    onHoverChange?.(gag ? { gag, organic } : null);
  }

  function addGag(gag, org = false) {
    if (selected.length >= MAX_SELECTED) return;

    const newGag = createSelectedGag(gag, org);

    setSelected(prev => {
      if (newGag.track !== "trap") return [...prev, newGag];

      // Insert traps right after any existing traps so they stay at the front
      const trapCount = prev.filter(g => g.track === "trap").length;
      return [...prev.slice(0, trapCount), newGag, ...prev.slice(trapCount)];
    });
  }


  return (
    <div
      className={`w-[90%] max-w-6xl min-w-[850px]
                  p-4 xl:p-6 rounded-3xl shadow-xl border-4
                  ${panelClass}`}
    >
      <div className="flex gap-3 xl:gap-4">
        {/* GAG LIST */}
        <div className="flex-1">
          {GAG_TRACKS.map(track => (
            <TrackRow key={track.name} track={track}>
              {GAGS[track.name].map(gag => (
                <GagButton
                  key={gag.name}
                  gag={gag}
                  isHovered={hoveredGag === gag}
                  organicHovered={organicHovered}
                  glare={glare}
                  onAdd={addGag}
                  onHover={hovered => updateHover(hovered, false)}
                  onLeave={() => updateHover(null, false)}
                  onOrganicHover={organic => updateHover(gag, organic)}
                />
              ))}
            </TrackRow>
          ))}
        </div>

        {/* RIGHT PANEL - absolutely positioned so its content never changes the panel height,
            the gag list alone sets it */}
        <div className="w-60 xl:w-80 shrink-0 relative">
        <div className="absolute inset-0 bg-gray-100 rounded-xl p-3 xl:p-4 flex flex-col justify-between inner-shadow">
          {/* HOVER PREVIEW - replaces the summary while a gag is hovered */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center">
            {hoveredGag
              ? <GagPreview gag={hoveredGag} organic={organicHovered} />
              : summary}
          </div>

          {/* CLEAR BUTTON */}
          <button
            onClick={() => setSelected([])}
            className="
              mt-3 xl:mt-4
              py-4 xl:py-8

              text-white
              text-xl xl:text-2xl
              font-bold
              font-minnie
              rounded-2xl

              transition-all
              shadow-[0_3px_0_rgba(0,0,0,0.9),0_7px_15px_rgba(0,0,0,0.45)]
              active:shadow-[0_1px_0_rgba(0,0,0,0.9)]
              active:translate-y-[2px]
            "
            style={{
              backgroundColor: "#00a2ffff",
              textShadow: '2px 2px rgba(0,0,0,0.85)',
            }}
          >
            CLEAR
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
