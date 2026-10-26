import { useState, useMemo } from "react";
import GagCalculator from "../components/GagCalculator";
import SelectedGag from "../components/SelectedGag";

export default function AccuracyCalculator() {
  const [selected, setSelected] = useState([]);
  const currentTotalAccuracy = useMemo(() => calculateAccuracy(), [selected]);

  const levels = [
    { level: 1, def: -2 },
    { level: 2, def: -5 },
    { level: 3, def: -10 },
    { level: 4, def: -15 },
    { level: 5, def: -20 },
    { level: 6, def: -25 },
    { level: 7, def: -30 },
    { level: 8, def: -35 },
    { level: 9, def: -40 },
    { level: 10, def: -45 },
    { level: 11, def: -50 },
    { level: 12, def: -55 },
    { level: 13, def: -60 },
    { level: 14, def: -65 },
    { level: 15, def: -65 },
    { level: 16, def: -65 },
    { level: 17, def: -65 },
    { level: 18, def: -65 },
    { level: 19, def: -65 },
    { level: 20, def: -65 },
  ];

  const borderColors = "bg-fuchsia-500 border-fuchsia-600";

  function calculateAccuracy() {
    return 95;
  }

  function getOrganizedGags() {
    const groupedGags = {};

    for (let i = 0; i < selected.length; i++) {
      const gag = selected[i];

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
      
      <h1 className="text-4xl font-bold mb-4 text-white py-10">Accuracy Calculator</h1>

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
                w-16
                h-full
                box-border
                flex flex-col items-center justify-center
                bg-gray-500
                border-2 border-gray-900
                text-gray-900
                font-remington
                ${selected.length === 0 
                  ? "bg-gray-500"  // When no gags selected, make it gray
                  : currentTotalAccuracy + entry.def >= 95
                  ? "bg-green-500"  // When currentTotalAccuracy >= 95, green
                  : "bg-red-500"  // Otherwise, red
                }
              `}
            >
              <div className="text-lg font-bold leading-none">
                {entry.level}
              </div>
              <div className="text-s leading-none mt-1 opacity-90">
                {selected.length === 0
                ? "__"
                : Math.min(95, currentTotalAccuracy + entry.def)}              
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`w-[90%] max-w-6xl min-w-[850px] pt-6 px-3 pb-1 rounded-3xl shadow-2xl border-4 ${borderColors}`}>

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
                  <SelectedGag
                    key={i}
                    gag={gag}
                    showPlus={i > 0}
                    onRemove={() => handleRemoveGag(i)}
                  />
                ))}
              </div>
    
              {/* Total damage */}
              <div className="text-5xl font-impress text-neutral-900/50 whitespace-nowrap">
                = {calculateAccuracy()}
              </div> 
    
            </div>
          )}
        </div>  
      </div>
      <GagCalculator
        selected={selected}
        setSelected={setSelected}
        panelClass= {borderColors}
      />
    </div>
  );
}
