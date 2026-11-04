import { useState } from "react";
import { GAG_TRACKS, GAGS, MAX_SELECTED, createSelectedGag, createSosGag } from "../data/gags";
import TrackRow from "./TrackRow";
import GagButton from "./GagButton";
import GagPreview from "./GagPreview";
import SosMenu from "./SosMenu";

/// GAG CALCULATOR COMPONENT
// When a gag is selected it is added to the 'selected' array in the parent component which can make calculations with it.
// Props: selected: array of selected gags
//        setSelected: function to update selected gags
//        panelClass: optional string for custom panel styling (menu background color)
//        glare: optional boolean, shows a glare effect on gags (e.g. damage up active)
//        summary: optional element shown in the right panel when no gag is hovered
//        onHoverChange({ gag, organic } | null): optional, called when the hovered gag changes
//        onArrowClick(side): optional, called with "left" or "right" when a side arrow is clicked (e.g. open the SOS menu)
export default function GagCalculator({ selected, setSelected, panelClass = "bg-th-panel border-th-panel-border", glare = false, summary = null, onHoverChange, onArrowClick }) {
  const [hoveredGag, setHoveredGag] = useState(null);
  const [organicHovered, setOrganicHovered] = useState(false);
  const [showSos, setShowSos] = useState(false); // Side arrows swap the gag list for the SOS menu

  // Update hover state and tell the parent (e.g. to preview damage on the cogs)
  function updateHover(gag, organic) {
    setHoveredGag(gag);
    setOrganicHovered(organic);
    onHoverChange?.(gag ? { gag, organic } : null);
  }

  function handleArrow(side) {
    setShowSos(show => !show);
    updateHover(null, false);
    onArrowClick?.(side);
  }

  function addGag(gag, org = false) {
    addSelected(createSelectedGag(gag, org));
  }

  // SOS cards are added just like gags of their track
  function addSos(card) {
    addSelected(createSosGag(card));
  }

  function addSelected(newGag) {
    if (selected.length >= MAX_SELECTED) return;

    setSelected(prev => {
      if (newGag.track !== "trap") return [...prev, newGag];

      // Insert traps right after any existing traps so they stay at the front
      const trapCount = prev.filter(g => g.track === "trap").length;
      return [...prev.slice(0, trapCount), newGag, ...prev.slice(trapCount)];
    });
  }


  return (
    <div
      className={`relative w-[90%] max-w-6xl min-w-[850px]
                  p-4 xl:p-6 rounded-3xl shadow-xl border-4
                  ${panelClass}`}
    >
      {/* SIDE ARROWS - yellow page arrows like the in-game gag menu, sticking out of both sides */}
      <SideArrow side="left" onClick={() => handleArrow("left")} />
      <SideArrow side="right" onClick={() => handleArrow("right")} />

      <div className="flex gap-3 xl:gap-4">
        {/* GAG LIST - stays in place (hidden) under the SOS menu so the panel keeps its height */}
        <div className="flex-1 relative">
        {showSos && <SosMenu onSelect={addSos} className="absolute inset-0 z-10" />}
        <div className={showSos ? "invisible" : ""}>
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
        </div>

        {/* RIGHT PANEL - absolutely positioned so its content never changes the panel height,
            the gag list alone sets it */}
        <div className="w-60 xl:w-80 shrink-0 relative">
        <div className="absolute inset-0 bg-th-surface text-th-surface-text rounded-xl p-3 xl:p-4 flex flex-col justify-between inner-shadow">
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

              toon-btn toon-btn-blue [--depth:3px]
            "
            style={{ textShadow: '2px 2px rgba(0,0,0,0.85)' }}
          >
            CLEAR
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

// Tall rounded yellow triangle pointing away from the panel
function SideArrow({ side, onClick }) {
  const isLeft = side === "left";
  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? "Previous menu" : "Next menu"}
      className={`
        absolute top-1/2 -translate-y-1/2
        ${isLeft ? "right-full -mr-1" : "left-full -ml-1"}
        w-8 xl:w-10 h-28 xl:h-36
        transition hover:brightness-110 hover:scale-105 active:scale-95
        drop-shadow-[0_3px_3px_rgba(0,0,0,0.35)]
      `}
    >
      <svg viewBox="0 0 40 140" className={`w-full h-full ${isLeft ? "-scale-x-100" : ""}`}>
        <defs>
          <linearGradient id={`arrow-fill-${side}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f7d51d" />
            <stop offset="0.55" stopColor="#fff36b" />
            <stop offset="1" stopColor="#f2c40f" />
          </linearGradient>
        </defs>
        <path
          d="M6 8 Q4 2 10 5 L36 63 Q39 70 36 77 L10 135 Q4 138 6 132 Z"
          fill={`url(#arrow-fill-${side})`}
          stroke="#c99a06"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Shine along the top edge */}
        <path d="M11 14 L30 60" stroke="#fffbd0" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </svg>
    </button>
  );
}
