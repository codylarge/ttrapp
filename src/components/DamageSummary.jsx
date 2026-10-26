import { GAG_TRACKS } from "../data/gags";

/// DAMAGE SUMMARY
// Lists each part of the total damage, shown in the gag calculator's right panel.
// Props: breakdown: { trackDamage, lureBonus, groupBonus, multiplier, total } from calculateDamage
export default function DamageSummary({ breakdown }) {
  const { trackDamage, lureBonus, groupBonus, multiplier, total } = breakdown;

  // Keep tracks in game order (trap, sound, throw, ...)
  const tracks = GAG_TRACKS.filter(track => track.name in trackDamage);

  return (
    <div className="w-full text-sm xl:text-lg font-impress text-neutral-800">
      <h2 className="font-bold text-lg xl:text-xl mb-2 xl:mb-3">Damage Summary</h2>

      {tracks.map(track => (
        <SummaryRow key={track.name} label={`${capitalize(track.name)} damage`} value={trackDamage[track.name]} color={track.color} />
      ))}
      <SummaryRow label="Lure bonus" value={lureBonus} />
      <SummaryRow label="Group bonus" value={groupBonus} />
      {multiplier !== 1 && <SummaryRow label="Modifiers" value={`×${Number(multiplier.toFixed(2))}`} />}

      <div className="border-t-2 border-neutral-400 mt-2 pt-2">
        <SummaryRow label="Total damage" value={total} bold />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, color, bold = false }) {
  return (
    <div className={`flex justify-between items-center ${bold ? "text-lg xl:text-2xl font-bold" : ""}`}>
      <span className="flex items-center gap-2">
        {color && <span className="w-3 h-3 rounded-full border border-neutral-700" style={{ backgroundColor: color }} />}
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
