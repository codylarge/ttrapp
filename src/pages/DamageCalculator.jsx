import { useState } from "react";
import GagCalculator from "../components/GagCalculator";

export default function DamageCalculator() {
  const [selected, setSelected] = useState([]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: "url('/images/backgrounds/background-blue-blur.jpg')",
      }}
    >
      <h1 className="text-4xl font-bold mb-4 text-white py-10">Damage Calculator</h1>
      <GagCalculator selected={selected} setSelected={setSelected} />
    </div>
  );
}
