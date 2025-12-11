import { useState } from "react";

export default function DamageCalculator() {
  const gagTracks = [
    { name: "TRAP", folder: "trap", color: "#FFD94A" },
    { name: "LURE", folder: "lure", color: "#8FE563" },
    { name: "SOUND", folder: "sound", color: "#7396FF" },
    { name: "THROW", folder: "throw", color: "#FFAC4A" },
    { name: "SQUIRT", folder: "squirt", color: "#FF6BD6" },
    { name: "DROP", folder: "drop", color: "#6AF7FF" },
  ];

  const gagImages = {
    trap: ["banana-peel", "rake", "marbles", "quicksand", "trapdoor", "tnt", "railroad"],
    lure: ["$1-bill", "small-magnet", "$5-bill", "big-magnet", "$10-bill", "hypno-goggles", "presentation"],
    sound: ["bike-horn", "whistle", "bugle", "aoogah", "elephant-trunk", "foghorn", "opera-singer"],
    throw: ["cupcake", "fruit-pie-slice", "cream-pie-slice", "whole-fruit-pie", "whole-cream-pie", "birthday-cake", "wedding-cake"],
    squirt: ["squirting-flower", "glass-of-water", "squirt-gun", "seltzer-bottle", "fire-hose", "storm-cloud", "geyser"],
    drop: ["flower-pot", "sandbag", "anvil", "big-weight", "safe", "grand-piano", "toontanic"],
  };

  const [selected, setSelected] = useState([]);

  function addGag(track, filename) {
    const newSelected = selected.slice();
    const newGag = { track: track, filename: filename };
    newSelected.push(newGag);
    setSelected(newSelected);
  }


  function clear() {
    setSelected([]);
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('/images/backgrounds/background-black.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[90%] max-w-6xl bg-red-500 p-6 rounded-3xl shadow-2xl border-4 border-red-700">

        <div className="bg-yellow-100 rounded-xl py-4 text-center mb-6 text-xl font-bold text-gray-700">
          {selected.length === 0 ? "No gags selected" : `${selected.length} gags selected`}
        </div>

        <div className="flex gap-4">

          {/* LEFT SIDE */}
          <div className="flex-1 space-y-4">
            {gagTracks.map((track) => (
              <div key={track.name} className="flex items-center gap-2">
                
                {/* FULL ROW */}
                <div
                  className="flex gap-2 p-2 rounded-xl w-full"
                  style={{
                    backgroundColor: track.color,
                  }}
                >
                  {/* LABEL */}
                  <div
                    className="w-24 flex items-center justify-center text-white text-xl font-bold rounded-lg"
                    style={{ backgroundColor: track.color }}
                  >
                    {track.name}
                  </div>

                  {/* GAG BUTTONS */}
                    {gagImages[track.folder].map((file, idx) => (
                    <button
                        key={idx}
                        onClick={() => addGag(track.name, file)}
                        className="p-2 rounded-xl shadow-lg hover:brightness-110 transition"
                        style={{
                        backgroundColor: "#53a9ffff",   // universal light blue
                        }}
                    >
                        <img
                        src={`/images/gags/${track.folder}/${file}.webp`}
                        alt={file}
                        className="w-12 h-12 object-contain"
                        />
                    </button>
                ))}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div className="w-80 bg-yellow-100 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {selected.length === 0 && (
                <p className="text-gray-600">No gags selected...</p>
              )}

              {selected.map((g, i) => (
                <div key={i} className="flex items-center gap-2 bg-white p-2 rounded shadow">
                  <img
                    src={`/images/gags/${g.track.toLowerCase()}/${g.filename}.webp`}
                    className="w-10 h-10"
                  />
                  <span className="font-semibold">{g.track}</span>
                </div>
              ))}
            </div>

            <button
              onClick={clear}
              className="mt-4 bg-blue-500 text-white text-2xl font-bold py-3 rounded-xl shadow hover:bg-blue-600 transition"
            >
              CLEAR
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
