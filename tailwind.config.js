/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Fonts and "th-" colours read CSS variables, so a theme (see THEMES in index.css) can swap them
      fontFamily: {
        remington: ["var(--font-remington)", "sans-serif"],
        impress: ["var(--font-impress)", "sans-serif"],
        minnie: ["var(--font-minnie)", "sans-serif"],
      },
      colors: {
        th: {
          title: "var(--th-title)",
          bar: "var(--th-bar)",                   // cog bar + modifier tab
          "cell": "var(--th-cell)",               // cog cell, untouched
          "cell-hit": "var(--th-cell-hit)",       // damaged, survives
          "cell-dead": "var(--th-cell-dead)",     // defeated
          "cell-preview": "var(--th-cell-preview)", // hover would defeat
          "cell-border": "var(--th-cell-border)",
          "cell-text": "var(--th-cell-text)",
          panel: "var(--th-panel)",               // the big gag calculator panels
          "panel-border": "var(--th-panel-border)",
          surface: "var(--th-surface)",           // light inner panels (results bar, right panel, popups)
          "surface-text": "var(--th-surface-text)",
          "surface-muted": "var(--th-surface-muted)",
          divider: "var(--th-divider)",
          toggle: "var(--th-toggle)",
          "toggle-on": "var(--th-toggle-on)",
          "toggle-border": "var(--th-toggle-border)",
          footer: "var(--th-footer)",
        },
      },
    },
  },
  plugins: [],
}
