import { useState } from "react";

export default function GagCalculator() {
  const gagTracks = [
    { name: "TRAP", folder: "trap", color: "#fffc57ff" },
    { name: "LURE", folder: "lure", color: "#10b901ff" },
    { name: "SOUND", folder: "sound", color: "#416be7ff" },
    { name: "THROW", folder: "throw", color: "#ffa33aff" },
    { name: "SQUIRT", folder: "squirt", color: "#ff4bccff" },
    { name: "DROP", folder: "drop", color: "#3ef5ffff" },
  ];
  
  const [selected, setSelected] = useState([]);
  const [hoveredGag, setHoveredGag] = useState(null);

  const gags = {
    trap: [
      { name: "banana-peel", track: "trap", damage: 12, accuracy: 100, affectAll: false },
      { name: "rake", track: "trap", damage: 18, accuracy: 100, affectAll: false },
      { name: "marbles", track: "trap", damage: 35, accuracy: 100, affectAll: false },
      { name: "quicksand", track: "trap", damage: 50, accuracy: 100, affectAll: false },
      { name: "trapdoor", track: "trap", damage: 85, accuracy: 100, affectAll: false },
      { name: "tnt", track: "trap", damage: 180, accuracy: 100, affectAll: false },
      { name: "railroad", track: "trap", damage: 200, accuracy: 100, affectAll: true }
    ],
  
    lure: [
      { name: "$1-bill", track: "lure", damage: 0, accuracy: 65, affectAll: false },
      { name: "small-magnet", track: "lure", damage: 0, accuracy: 70, affectAll: true },
      { name: "$5-bill", track: "lure", damage: 0, accuracy: 75, affectAll: false },
      { name: "big-magnet", track: "lure", damage: 0, accuracy: 80, affectAll: true },
      { name: "$10-bill", track: "lure", damage: 0, accuracy: 85, affectAll: false },
      { name: "hypno-goggles", track: "lure", damage: 0, accuracy: 90, affectAll: true },
      { name: "presentation", track: "lure", damage: 0, accuracy: 95, affectAll: true }
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
      { name: "cupcake", track: "throw", damage: 6, accuracy: 80, affectAll: false },
      { name: "fruit-pie-slice", track: "throw", damage: 10, accuracy: 80 , affectAll: false },
      { name: "cream-pie-slice", track: "throw", damage: 17, accuracy: 80, affectAll: false },
      { name: "whole-fruit-pie", track: "throw", damage: 27, accuracy: 75, affectAll: false },
      { name: "whole-cream-pie", track: "throw", damage: 40, accuracy: 75, affectAll: false },
      { name: "birthday-cake", track: "throw", damage: 100, accuracy: 70, affectAll: false },
      { name: "wedding-cake", track: "throw", damage: 120, accuracy: 70, affectAll: true }
    ],
  
    squirt: [
      { name: "squirting-flower", track: "squirt", damage: 4, accuracy: 95, affectAll: false },
      { name: "glass-of-water", track: "squirt", damage: 8, accuracy: 95, affectAll: false },
      { name: "squirt-gun", track: "squirt", damage: 12, accuracy: 95, affectAll: false },
      { name: "seltzer-bottle", track: "squirt", damage: 21, accuracy: 95, affectAll: false },
      { name: "fire-hose", track: "squirt", damage: 30, accuracy: 95, affectAll: false },
      { name: "storm-cloud", track: "squirt", damage: 70, accuracy: 90, affectAll: false },
      { name: "geyser", track: "squirt", damage: 105, accuracy: 90, affectAll: true }
    ],
  
    drop: [
      { name: "flower-pot", track: "drop", damage: 10, accuracy: 70, affectAll: false },
      { name: "sandbag", track: "drop", damage: 18, accuracy: 65, affectAll: false },
      { name: "anvil", track: "drop", damage: 30, accuracy: 60, affectAll: false },
      { name: "big-weight", track: "drop", damage: 45, accuracy: 60, affectAll: false },
      { name: "safe", track: "drop", damage: 70, accuracy: 55, affectAll: false },
      { name: "grand-piano", track: "drop", damage: 170, accuracy: 50, affectAll: false },
      { name: "toontanic", track: "drop", damage: 180, accuracy: 50, affectAll: true }
    ]
  };
  
  function addGag(track, gag) {
    setSelected(prev => [...prev, {
      track,
      name: gag.name,
      damage: gag.damage,
      accuracy: gag.accuracy
    }]);
  }

  function clear() {
    setSelected([]);
  }

  return (
    <div className="w-[90%] max-w-6xl min-w-[850px] bg-red-600 p-6 rounded-3xl shadow-2xl border-4 border-red-700">
      <div className="bg-yellow-100 rounded-xl py-4 px-4 mb-6 text-center text-xl font-bold text-gray-700 flex flex-col">  
        {selected.length === 0 && (
          <p>No gags selected</p>
        )}    
        {selected.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {selected.map((gag, i) => (
              <div
                key={i}
                className={
                  i === 0
                    ? "grid grid-cols-1 items-center"
                    : "grid grid-cols-[24px_auto] items-center gap-2"
                }
              >
                {i > 0 && (
                  <span className="text-neutral-900 text-3xl font-bold flex justify-center">
                    +
                  </span>
                )}  
                <div
                  className="px-3 py-1 rounded-xl [&>*]:min-w-[48px]"
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
                    className="w-14 h-9 object-contain min-w-[48px] min-h-[48px]"
                  />
              </div>
            </div>
          ))}
        </div>
      )}  
      </div>  
      <div className="flex gap-4">  
        {/* LEFT SIDE */}
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
                {/* LABEL */}
                <div
                  className="w-24 py-6 flex items-center justify-center text-neutral-950 text-xl font-bold rounded-lg"
                  style={{ backgroundColor: track.color, fontFamily: 'Impress'}}
                >
                  {track.name}
                </div>  
                {/* GAG BUTTONS */}
                  {gags[track.folder].map((gag, idx) => (
                  <button
                  key={idx}
                  onClick={() => addGag(track.name, gag)}
                  onMouseEnter={() =>
                      setHoveredGag({
                      track: track.name,
                      name: gag.name,
                      damage: gag.damage,
                      accuracy: gag.accuracy
                      })
                  }
                  onMouseLeave={() => setHoveredGag(null)}
                  className="px-5 py-1.5 rounded-2xl hover:brightness-110 transition"
                  style={{
                    backgroundColor: "#00a2ffff",
                    boxShadow: `
                    inset 0 4px 6px rgba(0, 0, 0, 0.25),
                    2px 2px 0px #1d3b7d
                    `,
                  }}
                  >
                    <img
                    src={`/images/gags/${track.folder}/${gag.name}.webp`}
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
        <div className="w-80 bg-yellow-100 rounded-xl p-4 flex flex-col justify-between">  
        {/* HOVER PREVIEW ONLY */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">  
              {hoveredGag && (
              <div>
                  <img
                  src={`/images/gags/${hoveredGag.track.toLowerCase()}/${hoveredGag.name}.webp`}
                  className="w-24 h-24 mx-auto"
                  />
                  <h2 className="font-bold text-xl mt-2">{hoveredGag.name}</h2>
                  <p className="mt-1 text-lg">Damage: {hoveredGag.damage}</p>
                  <p className="text-lg">Accuracy: {hoveredGag.accuracy}%</p>
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
