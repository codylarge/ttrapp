import { getGagImage, getOrgDamage, getOrgAccuracy, formatGagName } from "../data/gags";

/// GAG PREVIEW
// Shows the hovered gag's stats, using organic stats while the organic badge is hovered.
// Props: gag: hovered gag data object, or null
//        organic: whether to show organic stats
export default function GagPreview({ gag, organic }) {
  if (!gag) return null;

  return (
    <div>
      <img src={getGagImage(gag)} className="w-16 h-16 xl:w-24 xl:h-24 mx-auto" />
      <h2 className="font-bold text-lg xl:text-xl mt-2">{formatGagName(gag.name)}</h2>
      <p className="mt-1 text-base xl:text-lg">Damage: {organic ? getOrgDamage(gag) : gag.damage}</p>
      <p className="text-base xl:text-lg">Accuracy: {organic ? getOrgAccuracy(gag) : gag.accuracy}%</p>
    </div>
  );
}
