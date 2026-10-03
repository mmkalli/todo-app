export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const THEME_COLORS: Record<Theme, string> = { light: "#f6f6f8", dark: "#0b0b0e" };

/**
 * Runs in <head> before first paint: applies the saved theme, or the system
 * theme if the user never picked one (and follows system changes live).
 */
export const themeInitScript = `(function(){
var d=document.documentElement,c=${JSON.stringify(THEME_COLORS)},q=window.matchMedia("(prefers-color-scheme: dark)");
function saved(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");return t==="light"||t==="dark"?t:null}catch(e){return null}}
function apply(t){d.setAttribute("data-theme",t);d.style.colorScheme=t;var m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++){m[i].setAttribute("content",c[t])}}
apply(saved()||(q.matches?"dark":"light"));
q.addEventListener("change",function(e){if(!saved())apply(e.matches?"dark":"light")});
window.__applyTheme=apply;
})()`;

declare global {
  interface Window {
    __applyTheme?: (theme: Theme) => void;
  }
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (e.g. private mode): the theme still applies for this visit.
  }
  if (window.__applyTheme) {
    window.__applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}
