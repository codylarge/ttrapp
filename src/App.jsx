import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import BackButton from "./components/BackButton.jsx";
import SkullFinder from "./pages/SkullFinder.jsx";
import DamageCalculator from "./pages/DamageCalculator.jsx";
import AccuracyCalculator from "./pages/AccuracyCalculator.jsx";
function Placeholder({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-4xl font-bold">
      {title}
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
    {/* Every page except home gets the back button */}
    {pathname !== "/" && <BackButton />}

    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/skull-finder" element={<SkullFinder />} />
      <Route path="/damage-calculator" element={<DamageCalculator />} />
      <Route path="/accuracy-calculator" element={<AccuracyCalculator />} />
      <Route path="/page4" element={<Placeholder title="Page 4" />} />
      <Route path="/page5" element={<Placeholder title="Page 5" />} />
      <Route path="/page6" element={<Placeholder title="Page 6" />} />
    </Routes>
    </>
  );
}
