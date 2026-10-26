/// TRACK ROW
// A coloured row with the track label followed by its gag buttons (passed as children).
// Props: track: { name, color }
export default function TrackRow({ track, children }) {
  return (
    <div className="flex items-center gap-1">
      <div
        className="relative z-10 flex gap-1 xl:gap-2 pr-1 xl:pr-2 rounded-xl w-full items-center h-14 xl:h-[70px]"
        style={{
          backgroundColor: track.color,
          boxShadow: `
            inset 0 1px 6px rgba(0, 0, 0, 0.8),
            0 6px 10px rgba(0, 0, 0, .7)
          `
        }}
      >
        {/* TRACK LABEL */}
        <div className="w-16 xl:w-24 shrink-0 flex items-center justify-center text-neutral-950 text-base xl:text-xl font-bold font-impress">
          {track.name.toUpperCase()}
        </div>
        {children}
      </div>
    </div>
  );
}
