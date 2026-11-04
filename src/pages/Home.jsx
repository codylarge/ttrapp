// Each tile: in-game menu colour and a slight tilt so they look hand-placed, like Toontown's menus
const pages = [
  { name: "Skull Finder", color: "#f2464b", tilt: "-4deg" },
  { name: "Damage Calculator", color: "#a3dc50", tilt: "3deg" },
  { name: "Accuracy Calculator", color: "#9152e3", tilt: "-2deg" },
  { name: "Page4", color: "#3ea6f5", tilt: "2deg" },
  { name: "Page5", color: "#e65cb8", tilt: "-3deg" },
  { name: "Page6", color: "#f5d43c", tilt: "4deg" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/backgrounds/background-blue.png')] bg-cover bg-center p-6">
      <div className="grid grid-cols-3 gap-8 xl:gap-20 w-full max-w-3xl xl:max-w-6xl">
        {pages.map(page => {
          const url = page.name.toLowerCase().replace(/\s+/g, "-"); // <<—— transform name for URL e.g "Skull Finder" -> "skull-finder"

          return (
            <a
              key={page.name}
              href={`/${url}`}
              className="toon-tile aspect-square flex items-center justify-center p-4 text-center text-2xl xl:text-4xl font-minnie text-white"
              style={{ "--tile-color": page.color, "--tilt": page.tilt }}
            >
              {page.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}
