import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

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

      <Route path="/page1" element={<Placeholder title="Page 1" />} />
      <Route path="/page2" element={<Placeholder title="Page 2" />} />
      <Route path="/page3" element={<Placeholder title="Page 3" />} />
      <Route path="/page4" element={<Placeholder title="Page 4" />} />
      <Route path="/page5" element={<Placeholder title="Page 5" />} />
      <Route path="/page6" element={<Placeholder title="Page 6" />} />
    </Routes>
  );
}
