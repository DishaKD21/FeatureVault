/** @param {'light' | 'dark'} next */
export function applyThemeDom(next) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", next === "dark");
}
