import { Link } from "react-router-dom";

/// BACK BUTTON
// Toontown style "Back" button pinned to the top left, takes you to the home page.
export default function BackButton() {
  return (
    <Link
      to="/"
      className="
        toon-btn toon-btn-cyan [--depth:3px]
        fixed top-3 left-3 xl:top-4 xl:left-4 z-50
        px-6 xl:px-8 py-1 xl:py-1.5
        rounded-full
        font-minnie text-2xl xl:text-3xl text-[#ffe11a]
        back-btn-text
      "
    >
      Back
    </Link>
  );
}
