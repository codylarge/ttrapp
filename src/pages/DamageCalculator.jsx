import { useState, useMemo } from "react";
import GagCalculator from "../components/GagCalculator";

export default function DamageCalculator() {
  const [selected, setSelected] = useState([]);
  const [activeMode, setActiveMode] = useState("normal");

  const currentTotalDamage = useMemo(() => calculateDamage(), [selected]);

  const levelsNormal = [
    { level: 1, health: 6 },
    { level: 2, health: 12 },
    { level: 3, health: 20 },
    { level: 4, health: 30 },
    { level: 5, health: 42 },
    { level: 6, health: 56 },
    { level: 7, health: 72 },
    { level: 8, health: 90 },
    { level: 9, health: 110 },
    { level: 10, health: 132 },
    { level: 11, health: 156 },
    { level: 12, health: 196 },
    { level: 13, health: 224 },
    { level: 14, health: 254 },
    { level: 15, health: 286 },
    { level: 16, health: 320 },
    { level: 17, health: 356 },
    { level: 18, health: 394 },
    { level: 19, health: 434 },
    { level: 20, health: 476 },
  ];

  const levelsFieldOffice = [
    { level: 9, health: 110 },
    { level: 10, health: 132 },
    { level: 11, health: 156 },
    { level: 12, health: 196 },
    { level: 13, health: 224 },
    { level: 14, health: 254 },
    { level: 17, displayLevel: "1 ⭐", health: 4000, color: "#FF5900" },
    { level: 18, displayLevel: "2 ⭐", health: 4500, color: "#FF5900" },
    { level: 19, displayLevel: "3 ⭐", health: 5000, color: "#FF5900" },
    { level: 20, displayLevel: "4 ⭐", health: 5500, color: "#FF5900" },
  ];

  const levelsSupers = [
    { level: 1, displayLevel: "Scrap", health: 250, color: "#B86E89"},
    { level: 2, displayLevel: "Steel", health: 750, color: "#B86E89" },
    { level: 3, displayLevel: "Coin", health: 750, color: "#54AB8C" },
    { level: 4, displayLevel: "Bull", health: 1150, color: "#54AB8C" },
    { level: 5, displayLevel: "Junior", health: 1100, color: "#5483B0" },
    { level: 6, displayLevel: "Senior", health: 1500, color: "#5483B0" },
    { level: 7, displayLevel: "Fairway", health: 1200, color: "#5483B0"},
    { level: 8, displayLevel: "Fringe", health: 1750, color: "#5483B0" },
  ];

  const levelsBoss = [
    { level: 1, health: 6 },
    { level: 2, health: 12 },
    { level: 3, health: 20 },
    { level: 4, health: 30 },
    { level: 5, health: 42 },
    { level: 6, health: 56 },
    { level: 7, health: 72 },
    { level: 8, health: 90 },
    { level: 9, health: 110 },
    { level: 10, health: 132 },
    { level: 11, health: 156 },
    { level: 12, health: 196 },
    { level: 13, health: 224 },
    { level: 14, health: 254 },
    { level: 15, health: 286 },
    { level: 16, health: 320 },
    { level: 17, health: 356, color: "#00FFFF" },
    { level: 18, health: 394, color: "#00FFFF" },
    { level: 19, health: 434, color: "#00FFFF" },
    { level: 20, health: 476, color: "#00FFFF" },
  ];

  const levelModes = [
    {
      id: "normal",
      levels: levelsNormal,
      image: "/images/buttons/modes/normal.webp",
    },
    {
      id: "field-office",
      levels: levelsFieldOffice,
      image: "/images/buttons/modes/field-office.webp"
    },
    {
      id: "supervisors",
      levels: levelsSupers,
      image: "/images/buttons/modes/supervisors.webp"
    },    
  ];
  
  const levels =
  levelModes.find(mode => mode.id === activeMode)?.levels
  ?? [];


  function calculateTrapDamage() {
    const isTrapGag = selected.find(gag => gag.track === "trap"); // Return trap gag
    const isLureGag = selected.some(gag => gag.track === "lure"); // Return lure gag

    if (isTrapGag && isLureGag) {
      return isTrapGag.damage;
    }
    return 0;
  }
  function calculateDamage() {
    if (selected.length === 0) return 0;
    let totalDamage = 0;
    totalDamage += calculateTrapDamage();
    const organizedGags = getOrganizedGags();

    for (const track in organizedGags) {
      let trackDamage = 0;
      const trackGags = organizedGags[track];
      console.log(track);
      for (let i = 0; i < trackGags.length; i++) {
        trackDamage += trackGags[i].damage;
      }

      let boostedDamage = 0;
      if (trackGags.length > 1) {
        boostedDamage = Math.ceil(trackDamage * 1.2);
        totalDamage += boostedDamage;
      }

      else {
        totalDamage += trackGags[0].damage;
      }
      
    }
    return totalDamage;
  }

  function getOrganizedGags() {
    const groupedGags = {};

    for (let i = 0; i < selected.length; i++) {
      const gag = selected[i];

      if (gag.track === "trap") continue;

      // If this track does not exist yet, create an empty array
      if (!groupedGags[gag.track]) {
        groupedGags[gag.track] = [];
      }
      groupedGags[gag.track].push(gag);
    }
    return groupedGags;
  }

  const handleRemoveGag = (indexToRemove) => {
    setSelected(prev =>
      prev.filter((_, i) => i !== indexToRemove)
    );
  };


  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: "url('/images/backgrounds/background-blue-blur.jpg')",
      }}
    >

    <h1
      className="
        text-7xl font-bold mb-4 text-yellow-300 py-10 font-minnie
        [text-shadow:0_5px_0_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.4)]
      "
    >
      Damage Calculator
    </h1>

      {/* COG LEVELS */ }
      <div
        className="
          w-[90%] max-w-6xl min-w-[850px]
          h-20
          bg-gray-400
          p-3
          mb-4
          rounded-2xl
          shadow-[0_12px_36px_rgba(0,0,0,0.4)]
        "
      >
        <div className="flex h-full items-center overflow-hidden">
          {levels.map((entry, i) => (
            <div
              key={i}
              className={`
                relative
                flex-1
                h-full
                box-border
                flex flex-col items-center justify-center
                border-2 border-gray-900
                text-gray-900
                font-remington
                ${currentTotalDamage === 0 
                  ? "bg-gray-500"
                  : currentTotalDamage >= entry.health 
                  ? "bg-green-500"
                  : "bg-red-500"
                }
              `}
            >
              {entry.color && (
                <div
                  className={`
                    pointer-events-none
                    absolute inset-0
                    border-4
                    ${entry.pulse ? "animate-pulse" : ""}
                  `}
                  style={{
                    borderStyle: "solid",
                    borderColor: `${entry.color}`,
                    backgroundColor: `${entry.color}44`, // ~~27% opacity
                  }}
                />
              )}
              <div className="text-lg font-bold leading-none">
                {entry.displayLevel ?? entry.level}
              </div>
              <div className="text-s leading-none mt-1 opacity-90">
                {entry.health - currentTotalDamage < 0 ? 0 : entry.health - currentTotalDamage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODE BUTTONS */ }
      <div className="flex gap-4 justify-center mb-4">
        {levelModes.map(mode => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`
                relative
                p-1
                rounded-xl
                border-2
                transition
                duration-150
                ${isActive
                  ? "border-yellow-400 bg-yellow-300/20 shadow-[0_4px_0_rgba(0,0,0,0.8)]"
                  : "border-black/40 bg-black/20 hover:bg-black/30"
                }
                active:translate-y-[2px]
                active:shadow-none
              `}
            >
              <img
                src={mode.image}
                alt={mode.id}
                className={`
                  w-[200px]
                  h-[60px]
                  object-contain
                  transition
                  ${isActive
                    ? "brightness-110"
                    : "opacity-80 hover:opacity-100"
                  }
                `}
              />
            </button>

          );
        })}
      </div>


      {/* RESULTS BAR */ }
      <div className="w-[90%] max-w-6xl min-w-[850px] bg-red-600 pt-6 px-3 pb-1 rounded-3xl shadow-2xl border-4 border-red-700">

        <div className="bg-gray-100 rounded-xl mb-6 px-4 flex items-center justify-between h-20 overflow-hidden text-center text-gray-700 inner-shadow">
          {selected.length === 0 && ( 
            <p className="text-2xl justify-center w-full font-impress">
              No gags selected
            </p>
          )}    
  
          {/* SELECTED GAGS */}
          {selected.length > 0 && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-3 flex-wrap">
                {selected.map((gag, i) => (
                  <div
                    role="button"
                    onClick={() => handleRemoveGag(i)}
                    key={i}
                    className={i === 0 ? "grid grid-cols-1 items-center" : "grid grid-cols-[24px_auto] items-center gap-2" } // Plus sign for all but first
                  >
                    {i > 0 && (
                      <span className="text-neutral-900 text-3xl font-bold flex justify-center">
                        +
                      </span>
                    )}
          
                    <div // Selected Gag Button
                      className="
                      px-3 py-2 rounded-xl [&>*]:min-w-[48px] 
                      hover:brightness-125
                      active:brightness-90 active:scale-95
                      transition duration-150 ease-in-out
                      "
                      style={{
                        backgroundColor: gag.org ? "#FFBB00" : "#00a2ffff", // teal-green when organic
                        boxShadow: `
                          inset 0 4px 6px rgba(0, 0, 0, 0.25),
                          2px 2px 0px #1d3b7d
                        `,
                      }}
                    >
                      <img
                        src={`/images/gags/${gag.track.toLowerCase()}/${gag.name}.webp`}
                        alt={gag.name}
                        className="w-14 h-9 object-contain min-w-[36px] min-h-[36px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
    
              {/* Total damage */}
              <div className="text-5xl font-impress text-neutral-900/50 whitespace-nowrap">
                = {currentTotalDamage}
              </div> 
    
            </div>
          )}
        </div>  
      </div>
      <GagCalculator selected={selected} setSelected={setSelected} />
      <div className="mt-8 w-full text-center text-lg text-neutral-900 pt-3 font-impress">
        Inspired by master reggie, check out his version{" "}
        <a
          href="https://big.brain.town/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-blue-300 underline transition"
        >
          here
        </a>
      </div>
    </div>
  );
}
