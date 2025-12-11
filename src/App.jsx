import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import SkullFinder from "./pages/SkullFinder.jsx";
import DamageCalculator
 from "./pages/DamageCalculator.jsx";
function Placeholder({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-4xl font-bold">
      {title}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/skull-finder" element={<SkullFinder />} />
      <Route path="/damage-calculator" element={<DamageCalculator />} />
      <Route path="/page3" element={<Placeholder title="Page 3" />} />
      <Route path="/page4" element={<Placeholder title="Page 4" />} />
      <Route path="/page5" element={<Placeholder title="Page 5" />} />
      <Route path="/page6" element={<Placeholder title="Page 6" />} />
    </Routes>
  );
}
