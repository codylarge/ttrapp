// SOS cards in public/images/sos, each image already has the track, name, face and stars on it
// gag: the gag the SOS attacks with (its icon), damage: the SOS's damage, stars: rarity shown on the card
// Ordered by stars (most first), then track (drop, trap, sound)
const SOS_CARDS = [
  { id: "bessie", name: "Barnacle Bessie", track: "drop", gag: "grand-piano", damage: 170, stars: 5 },
  { id: "clara", name: "Clerk Clara", track: "trap", gag: "tnt", damage: 180, stars: 5 },
  { id: "moe", name: "Moe Zart", track: "sound", gag: "foghorn", damage: 70, stars: 5 },
  { id: "franz", name: "Franz Neckvein", track: "drop", gag: "safe", damage: 100, stars: 4 },
  { id: "penny", name: "Clerk Penny", track: "trap", gag: "trapdoor", damage: 120, stars: 4 },
  { id: "sid", name: "Sid Sonata", track: "sound", gag: "elephant-trunk", damage: 55, stars: 4 },
  { id: "clumsyned", name: "Clumsy Ned", track: "drop", gag: "big-weight", damage: 60, stars: 3 },
  { id: "seville", name: "Barbara Seville", track: "sound", gag: "aoogah", damage: 35, stars: 3 },
];

/// SOS MENU
// Blue in-game style panel with the SOS cards in rows of 4 and a yellow scroll bar
// Props: onSelect(card): called when a card is clicked
//        className: optional extra classes (e.g. positioning)
export default function SosMenu({ onSelect, className = "" }) {
  return (
    <div className={`sos-frame flex flex-col rounded-2xl p-2 xl:p-3 ${className}`}>
      {/* TITLE */}
      <h2
        className="font-minnie text-white text-2xl xl:text-3xl leading-none pl-3 pt-1 pb-2 xl:pb-3"
        // Thin outline, then a thick drop shadow stepped out to the right and a little down
        style={{ textShadow: "-1px -1px 0 #0d2a45, 1px -1px 0 #0d2a45, -1px 1px 0 #0d2a45, 1px 1px 0 #0d2a45, 2px 1px 0 #0d2a45, 3px 1px 0 #0d2a45, 4px 2px 0 #0d2a45, 5px 2px 0 #0d2a45, 6px 3px 0 #0d2a45" }}
      >
        SOS Cards
      </h2>

      {/* CARD LIST - dark inset panel that scrolls */}
      <div className="sos-inner flex-1 min-h-0 rounded-xl p-1.5 xl:p-2">
        <div className="sos-scroll h-full overflow-y-auto pl-2 pr-3 py-2">
          <div className="grid grid-cols-4 gap-3 xl:gap-4">
            {SOS_CARDS.map(card => (
              <button
                key={card.id}
                onClick={() => onSelect?.(card)}
                title={`${card.name} - ${card.damage} damage`}
                className="
                  bg-white rounded-lg overflow-hidden
                  shadow-[0_3px_5px_rgba(0,0,0,0.45)]
                  transition hover:-translate-y-0.5 hover:shadow-[0_6px_8px_rgba(0,0,0,0.45)]
                "
              >
                <img src={`/images/sos/${card.id}.webp`} alt={card.name} className="w-full aspect-[150/195] block" draggable="false" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
