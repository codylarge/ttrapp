import { getGagImage } from "../data/gags";

const MAX_ROUND_GAGS = 4; // A real round has at most 4 toons, so more gags than this is invalid

/// ROUND HISTORY
// Lists saved rounds (gags, modifiers, damage), then the current round and overall damage.
// Props: rounds: array of { gags, modifiers, total }
//        editingIndex: index of the round open in the calculator, or null
//        currentDamage: damage of the gags in the calculator right now
//        overallDamage: damage of every round combined
//        onSelectRound(index): called when a round is clicked
//        onRemoveRound(index): called when a round's × badge is clicked
//        onResetRounds(): deletes every saved round
export default function RoundHistory({ rounds, editingIndex, currentDamage, overallDamage, onSelectRound, onRemoveRound, onResetRounds }) {
  return (
    <div className="w-full max-h-full flex flex-col text-left font-impress text-neutral-800">
      <h2 className="font-bold text-lg xl:text-xl mb-1 xl:mb-2 text-center">Rounds</h2>

      {/* SAVED ROUNDS - two blue boxes per row, scrolls once it fills the panel */}
      <div className="min-h-0 overflow-y-auto grid grid-cols-2 content-start gap-2 p-1">
        {rounds.map((round, i) => {
          const isOpen = i === editingIndex;
          const isInvalid = round.gags.length > MAX_ROUND_GAGS;

          return (
          <div
            key={i}
            role="button"
            onClick={() => onSelectRound(i)}
            title={isInvalid
              ? `Invalid round: only ${MAX_ROUND_GAGS} gags can be used per round`
              : isOpen ? "Editing this round" : "Click to edit this round"}
            className={`
              group relative
              rounded-lg p-1.5
              border-2
              shadow-[0_2px_4px_rgba(0,0,0,0.25)]
              active:scale-[0.97]
              transition duration-150
              ${isOpen
                ? "border-yellow-400 ring-2 ring-yellow-400"
                : `hover:brightness-110 hover:border-yellow-400 ${isInvalid ? "border-red-600" : "border-[#1d3b7d]"}`
              }
              ${isInvalid
                ? "bg-red-500/25"
                : isOpen ? "bg-yellow-300/40" : "bg-[#00a2ff]/20"
              }
            `}
          >
            {/* REMOVE BADGE - appears in the corner on hover, like the organic badge on gags */}
            <span
              role="button"
              title="Remove this round"
              onClick={(e) => {
                e.stopPropagation(); // prevent opening the round
                onRemoveRound(i);
              }}
              className="
                absolute -top-1 -right-1 z-10
                w-5 h-5 rounded-full
                flex items-center justify-center
                bg-red-600 text-white text-sm font-bold leading-none
                border-2 border-white
                shadow-[0_1px_3px_rgba(0,0,0,0.5)]
                opacity-0 group-hover:opacity-100
                hover:scale-110
                transition
              "
            >
              ×
            </span>

            {/* TOP ROW - round number, tiny modifier icons, damage */}
            <div className="flex items-center gap-1 h-4 mb-1 text-xs leading-none">
              <span className={`font-bold ${isInvalid ? "text-red-600" : "text-neutral-500"}`}>
                {isInvalid && "⚠ "}#{i + 1}
              </span>
              <div className="flex gap-0.5 flex-1">
                {round.modifiers.map(modifier => (
                  <img key={modifier.key} src={modifier.icon} alt={modifier.key} className="w-3.5 h-3.5" />
                ))}
              </div>
              <span className={`font-bold text-sm ${isInvalid ? "text-red-600" : ""}`}>{round.total}</span>
            </div>

            {/* GAGS - 4 equal slots that fill the box width. An invalid round squeezes in an extra slot */}
            <div className={`grid gap-0.5 ${isInvalid ? "grid-cols-5" : "grid-cols-4"}`}>
              {round.gags.map((gag, j) => (
                <div
                  key={j}
                  className="aspect-square rounded p-0.5"
                  style={{ backgroundColor: gag.org ? "#FFBB00" : "#00a2ffff" }}
                >
                  <img src={getGagImage(gag)} alt={gag.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
          );
        })}
      </div>

      {/* RESET ROUNDS BUTTON - sits outside the scroll area */}
      <button
        onClick={onResetRounds}
        className="
          shrink-0
          w-full mt-2 py-0.5 xl:py-1
          text-white text-sm xl:text-base font-bold font-minnie
          rounded-lg bg-red-600
          transition-all
          hover:brightness-110
          shadow-[0_2px_0_rgba(0,0,0,0.9)]
          active:shadow-none active:translate-y-[2px]
        "
        style={{ textShadow: "1px 1px rgba(0,0,0,0.85)" }}
      >
        RESET ROUNDS
      </button>

      {/* TOTALS */}
      <div className="border-t-2 border-neutral-400 mt-2 xl:mt-3 pt-1 xl:pt-2 text-sm xl:text-lg">
        <div className="flex justify-between">
          <span>{editingIndex !== null ? `Round #${editingIndex + 1} damage` : "Current round damage"}</span>
          <span>{currentDamage}</span>
        </div>
        <div className="flex justify-between text-lg xl:text-2xl font-bold">
          <span>Total damage</span>
          <span>{overallDamage}</span>
        </div>
      </div>
    </div>
  );
}
