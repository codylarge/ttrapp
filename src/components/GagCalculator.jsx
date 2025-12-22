import { useState } from "react";

export default function GagCalculator({ selected, setSelected }) {
  const gagTracks = [
    { name: "trap", color: "#fffc57ff" },
    { name: "lure", color: "#10b901ff" },
    { name: "sound", color: "#416be7ff" },
    { name: "throw", color: "#ffa33aff" },
    { name: "squirt", color: "#ff4bccff" },
    { name: "drop", color: "#3ef5ffff" },
  ];
  
  const [hoveredGag, setHoveredGag] = useState(null);
  const [organicHovered, setOrganicHovered] = useState(false);

  const gags = {
    trap: [
      { name: "banana-peel", track: "trap", damage: 12, accuracy: 0, affectAll: false },
      { name: "rake", track: "trap", damage: 18, accuracy: 0, affectAll: false },
      { name: "marbles", track: "trap", damage: 35, accuracy: 0, affectAll: false },
      { name: "quicksand", track: "trap", damage: 50, accuracy: 0, affectAll: false },
      { name: "trapdoor", track: "trap", damage: 85, accuracy: 0, affectAll: false },
      { name: "tnt", track: "trap", damage: 180, accuracy: 0, affectAll: false },
      { name: "railroad", track: "trap", damage: 200, accuracy: 0, affectAll: true }
    ],
  
    lure: [
      { name: "$1-bill", track: "lure", damage: 0, accuracy: 60, affectAll: false },
      { name: "small-magnet", track: "lure", damage: 0, accuracy: 55, affectAll: true },
      { name: "$5-bill", track: "lure", damage: 0, accuracy: 70, affectAll: false },
      { name: "big-magnet", track: "lure", damage: 0, accuracy: 65, affectAll: true },
      { name: "$10-bill", track: "lure", damage: 0, accuracy: 80, affectAll: false },
      { name: "hypno-goggles", track: "lure", damage: 0, accuracy: 75, affectAll: true },
      { name: "presentation", track: "lure", damage: 0, accuracy: 90, affectAll: true }
    ],
  
    sound: [
      { name: "bike-horn", track: "sound", damage: 4, accuracy: 95, affectAll: true },
      { name: "whistle", track: "sound", damage: 7, accuracy: 95, affectAll: true },
      { name: "bugle", track: "sound", damage: 11, accuracy: 95, affectAll: true },
      { name: "aoogah", track: "sound", damage: 16, accuracy: 95, affectAll: true },
      { name: "elephant-trunk", track: "sound", damage: 21, accuracy: 95, affectAll: true },
      { name: "foghorn", track: "sound", damage: 50, accuracy: 95, affectAll: true },
      { name: "opera-singer", track: "sound", damage: 90, accuracy: 95, affectAll: true }
    ],
  
    throw: [
      { name: "cupcake", track: "throw", damage: 6, accuracy: 75, affectAll: false },
      { name: "fruit-pie-slice", track: "throw", damage: 10, accuracy: 75 , affectAll: false },
      { name: "cream-pie-slice", track: "throw", damage: 17, accuracy: 75, affectAll: false },
      { name: "whole-fruit-pie", track: "throw", damage: 27, accuracy: 75, affectAll: false },
      { name: "whole-cream-pie", track: "throw", damage: 40, accuracy: 75, affectAll: false },
      { name: "birthday-cake", track: "throw", damage: 100, accuracy: 75, affectAll: false },
      { name: "wedding-cake", track: "throw", damage: 120, accuracy: 75, affectAll: true }
    ],
  
    squirt: [
      { name: "squirting-flower", track: "squirt", damage: 4, accuracy: 95, affectAll: false },
      { name: "glass-of-water", track: "squirt", damage: 8, accuracy: 95, affectAll: false },
      { name: "squirt-gun", track: "squirt", damage: 12, accuracy: 95, affectAll: false },
      { name: "seltzer-bottle", track: "squirt", damage: 21, accuracy: 95, affectAll: false },
      { name: "fire-hose", track: "squirt", damage: 30, accuracy: 95, affectAll: false },
      { name: "storm-cloud", track: "squirt", damage: 80, accuracy: 95, affectAll: false },
      { name: "geyser", track: "squirt", damage: 105, accuracy: 95, affectAll: true }
    ],
  
    drop: [
      { name: "flower-pot", track: "drop", damage: 10, accuracy: 50, affectAll: false },
      { name: "sandbag", track: "drop", damage: 18, accuracy: 50, affectAll: false },
      { name: "anvil", track: "drop", damage: 30, accuracy: 50, affectAll: false },
      { name: "big-weight", track: "drop", damage: 45, accuracy: 50, affectAll: false },
      { name: "safe", track: "drop", damage: 70, accuracy: 50, affectAll: false },
      { name: "grand-piano", track: "drop", damage: 170, accuracy: 50, affectAll: false },
      { name: "toontanic", track: "drop", damage: 180, accuracy: 50, affectAll: true }
    ]
  };
  
  function addGag(gag, org=false) {
    if (selected.length >= 6) return; 
    
    if (org) {
      if (gag.track === "lure") {
        gag.accuracy += 10;
      } else {
        gag.damage = getOrgDamage(gag)
      }
    }

    if(gag.track === "trap") {
      const alreadySelectedTrap = selected.some(selectedGag => selectedGag.track === "trap");
      if (alreadySelectedTrap) {
        // Replace existing trap gag
        setSelected(prev => prev.map(selectedGag => 
          selectedGag.track === "trap" ? {
            track: gag.track,
            name: gag.name,
            damage: gag.damage,
            accuracy: gag.accuracy
          } : selectedGag
        ));
        return;
      }
    }

    setSelected(prev => [...prev, {
      track: gag.track,
      name: gag.name,
      damage: gag.damage,
      accuracy: gag.accuracy
    }]);
  }

  function calculateDamage() {
    let totalDamage = 0;
    totalDamage += calculateTrapDamage();
    const organizedGags = getOrganizedGags();

    for (const track in organizedGags) {
      let trackDamage = 0;
      const trackGags = organizedGags[track];
      
      for (let i = 0; i < trackGags.length; i++) {
        trackDamage += trackGags[i].damage;
      }

      if (trackGags.length > 1) {
        const boostedDamage = Math.ceil(trackDamage * 1.2);
        totalDamage += boostedDamage;
      }
      else {
        totalDamage += trackGags[0].damage;
      }
    }

    return totalDamage;
  }
  
  
  function getOrgDamage(gag) {
    if (gag.track === "squirt" || gag.track === "drop") 
      return  Math.ceil((gag.damage * 115) / 100);
    else 
      return  Math.ceil((gag.damage * 110) / 100);
  }

  function getOrgAccuracy(gag) {
    return gag.track === "lure" ? Math.min(gag.accuracy + 10, 95) : gag.accuracy
  }

  function calculateTrapDamage() {
    const isTrapGag = selected.find(gag => gag.track === "trap"); // Return trap gag
    const isLureGag = selected.some(gag => gag.track === "lure"); // Return lure gag

    if (isTrapGag && isLureGag) {
      return isTrapGag.damage;
    }
    return 0;
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


  function convertGagName(name) {
    return name
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
  }

  const handleRemoveGag = (indexToRemove) => {
    setSelected(prev =>
      prev.filter((_, i) => i !== indexToRemove)
    );
  };

  function clear() {
    setSelected([]);
  }

  return (
    <div className="w-[90%] max-w-6xl min-w-[850px] bg-red-600 p-6 rounded-3xl shadow-2xl border-4 border-red-700">
      {/* RESULTS BAR */} 
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
                    backgroundColor: "#00a2ffff",
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
            = {calculateDamage()}
          </div> 

        </div>
      )}

      {/* GAG LIST */}
      </div>  
      <div className="flex gap-4">  
        <div className="flex-1">
          {gagTracks.map((track) => (
            <div key={track.name} className="flex items-center gap-1">
              
              {/* FULL ROW */}
              <div 
              className="flex gap-2 rounded-xl w-full items-center py-"
              style={{
                  backgroundColor: track.color,
                  minHeight: "64px",
                  boxShadow: "0 0 15px 4px rgba(0, 0, 0, 0.35)" // glowing shadow
              }}
              >  
                {/* TRACK LABEL */}
                <div
                  className="w-24 py-6 flex items-center justify-center text-neutral-950 text-xl font-bold rounded-lg"
                  style={{ backgroundColor: track.color, fontFamily: 'Impress'}}
                >
                  {track.name.toUpperCase()}
                </div>  
              {/* GAG BUTTONS */}
              {gags[track.name].map((gag, idx) => (
                <button
                  key={idx}
                  onClick={() => addGag(gag)}
                  onMouseEnter={() =>
                    setHoveredGag({
                      track: gag.track,
                      name: gag.name,
                      damage: gag.damage,
                      accuracy: gag.accuracy,
                      gagObj: gag,
                    })
                  }
                  onMouseLeave={() => {
                    setHoveredGag(null);
                    setOrganicHovered(false);
                  }}
                  className="relative px-5 py-1.5 rounded-2xl
                  hover:brightness-125
                  active:brightness-90 active:scale-95
                  transition duration-150 ease-in-out"
                  style={{
                    backgroundColor: "#00a2ffff",
                    boxShadow: `
                      inset 0 4px 6px rgba(0, 0, 0, 0.25),
                      2px 3px 3px #1d3b7d
                    `,
                  }}
                >
                  {/* ORGANIC OVERLAY */}
                  {hoveredGag?.name === gag.name &&
                    hoveredGag?.track === gag.track && (
                      <div
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent normal gag click
                          addGag(gag, true);
                        }}
                        onMouseEnter={() => setOrganicHovered(true)}
                        onMouseLeave={() => setOrganicHovered(false)}
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition"
                      >
                        <img
                          src={
                            organicHovered
                              ? "/images/ui/organic-active.webp"
                              : "/images/ui/organic-inactive.webp"
                          }
                          className="w-8 h-8 pointer-events-none"
                        />
                      </div>
                    )}
              
                  {/* GAG IMAGE */}
                  <img
                    src={`/images/gags/${track.name}/${gag.name}.webp`}
                    alt={gag.name}
                    className="w-11 h-11 object-contain min-w-[24px] min-h-[24px]"
                  />
                </button>
              ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}  
        <div className="w-80 bg-gray-100 rounded-xl p-4 flex flex-col justify-between inner-shadow">  
        {/* HOVER PREVIEW */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">  
              {hoveredGag && (
              <div>
                  <img
                  src={`/images/gags/${hoveredGag.track.toLowerCase()}/${hoveredGag.name}.webp`}
                  className="w-24 h-24 mx-auto"
                  />
                  <h2 className="font-bold text-xl mt-2">{convertGagName(hoveredGag.name)}</h2>
                  <p className="mt-1 text-lg">Damage: {organicHovered ? getOrgDamage(hoveredGag) : hoveredGag.damage}</p>
                  <p className="text-lg">Accuracy: {organicHovered ? getOrgAccuracy(hoveredGag) : hoveredGag.accuracy}%</p>
              </div>
              )}  
          </div>  
          {/* CLEAR BUTTON */}
          <button
              onClick={clear}
              className="mt-4 bg-blue-500 text-white text-2xl font-bold py-3 rounded-xl shadow hover:bg-blue-600 transition"
          >
              CLEAR
        </button>
      </div>
      </div>
    </div>
  );
}
