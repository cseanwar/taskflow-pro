/**
 * Inline script injected into <head> so the correct theme is applied before
 * first paint, preventing a flash of the wrong theme on hard loads.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("tfp_theme");var d=t==="light"||t==="dark"?t:"system";var s=d==="system"?(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):d;document.documentElement.setAttribute("data-theme",s);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;
