// The theme the user last picked, or classic
export function loadTheme() {
  try {
    return localStorage.getItem("damageCalcTheme") === "tracker" ? "tracker" : "classic";
  } catch {
    return "classic";
  }
}
