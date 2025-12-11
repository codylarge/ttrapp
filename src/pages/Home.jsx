export default function Home() {
  const pages = [
    "Skull Finder",
    "Damage Calculator",
    "Accuracy Calculator",
    "Page4",
    "Page5",
    "Page6",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/backgrounds/background-blue.png')] bg-cover bg-center p-6">
      <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
        {pages.map((page, i) => {
          const url = page.toLowerCase().replace(/\s+/g, "-"); // <<—— transform name for URL e.g "Skull Finder" -> "skull-finder"

          return (
            <a
              key={i}
              href={`/${url}`}
              className="aspect-square bg-white/80 shadow rounded-xl flex items-center justify-center text-xl font-semibold hover:bg-gray-200 transition"
            >
              {page}
            </a>
          );
        })}
      </div>
    </div>
  );
}
