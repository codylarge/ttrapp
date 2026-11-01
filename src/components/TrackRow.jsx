/// TRACK ROW
// A coloured row with the track label followed by its gag buttons (passed as children).
// Props: track: { name, color }
export default function TrackRow({ track, children }) {
  return (
    <div className="flex items-center gap-1">
      <div
        className="relative z-10 flex gap-1 xl:gap-2 pr-1 xl:pr-2 rounded-xl w-full items-center h-14 xl:h-[70px]"
        style={{
          // The theme decides how much track colour shows (and the label's colour and outline)
          backgroundColor: `color-mix(in srgb, ${track.color} var(--th-track-mix), var(--th-track-base))`,
          boxShadow: "var(--th-track-shadow)",
        }}
      >
        {/* TRACK LABEL */}
        <div
          className="w-16 xl:w-24 shrink-0 flex items-center justify-center text-base xl:text-xl font-bold font-impress"
          style={{
            color: `color-mix(in srgb, ${track.color} var(--th-track-label-mix), var(--th-track-label-base))`,
            textShadow: "var(--th-track-label-shadow)",
          }}
        >
          {track.name.toUpperCase()}
        </div>
        {children}
      </div>
    </div>
  );
}
