/* Shared PWA bootstrapping. Leaves the games' original logic untouched. */
(() => {
  "use strict";
  function boot() {
    const home = new URL("./index.html", location.href);
    const onHome = location.pathname.endsWith("/") || location.pathname === home.pathname;
    if (!onHome) {
      const hasHomeLink = [...document.querySelectorAll('a[href]')].some(link => {
        try { return new URL(link.getAttribute("href"), location.href).pathname === home.pathname; }
        catch { return false; }
      });
      if (!hasHomeLink) {
        const css = document.createElement("style");
        css.textContent = '#pwa-library-home{position:fixed;z-index:2147483000;right:calc(12px + env(safe-area-inset-right));bottom:calc(12px + env(safe-area-inset-bottom));display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:8px 13px;border-radius:99px;border:1px solid #ffffff80;background:#263444ed;color:white;font:600 13px/1.3 -apple-system,BlinkMacSystemFont,"Hiragino Sans",sans-serif;text-decoration:none;box-shadow:0 3px 15px #0004;max-width:55vw}#pwa-library-home:focus-visible{outline:3px solid #ffcd76;outline-offset:2px}';
        document.head.append(css);
        const link = document.createElement("a");
        link.id = "pwa-library-home";
        link.href = "./index.html";
        link.textContent = "⌂ ゲーム一覧";
        link.setAttribute("aria-label", "ゲーム一覧に戻る");
        document.body.append(link);
      }
    }
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
      navigator.serviceWorker.register("./sw.js").catch(error => console.warn("PWA registration failed:", error));
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, {once:true});
  else boot();
})();
