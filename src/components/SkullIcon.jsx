/// SKULL ICON
// A red skull drawn in SVG. Sized with the text around it (1em), so set the size with a font size class.
// Props: className: optional extra classes
export default function SkullIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-[1em] h-[1em] drop-shadow-[0_0_4px_rgba(255,40,20,0.6)] ${className}`}
      aria-hidden="true"
    >
      {/* Head and jaw */}
      <path
        d="M12 2C7 2 3.5 5.6 3.5 10.2c0 2.9 1.4 5.2 3.5 6.5V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.3c2.1-1.3 3.5-3.6 3.5-6.5C20.5 5.6 17 2 12 2z"
        fill="#e02020"
        stroke="#3a0505"
        strokeWidth="1.5"
      />
      {/* Eyes, nose and teeth */}
      <circle cx="8.7" cy="10.8" r="2.3" fill="#3a0505" />
      <circle cx="15.3" cy="10.8" r="2.3" fill="#3a0505" />
      <path d="M12 13.6l-1.4 2.4h2.8z" fill="#3a0505" />
      <path d="M10 18v3M12 18v3M14 18v3" stroke="#3a0505" strokeWidth="1.2" />
    </svg>
  );
}
