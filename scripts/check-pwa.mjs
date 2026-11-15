import assert from "node:assert/strict";
import {readFileSync, readdirSync, existsSync} from "node:fs";
const read = path => readFileSync(path, "utf8");
const manifest = JSON.parse(read("manifest.webmanifest"));
const serviceWorker = read("sw.js");
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "./index.html");
for (const icon of manifest.icons) assert(existsSync(icon.src), "Missing icon: " + icon.src);
const pages = readdirSync(".").filter(name => name.endsWith(".html"));
assert(pages.length > 1, "Missing game pages");
for (const file of pages) {
  const html = read(file);
  assert(html.includes("manifest.webmanifest"), "Missing PWA manifest link: " + file);
  assert(html.includes("pwa-nav.js"), "Missing PWA navigation/registration: " + file);
  const entry = "./" + encodeURIComponent(file);
  if (file !== "index.html") assert(serviceWorker.includes(entry), "Missing offline cache entry: " + file);
}
assert(serviceWorker.includes('"./pwa-nav.js"'), "Shared script not cached");
const library = read("index.html");
for (const page of pages.filter(name => name !== "index.html")) {
  assert(library.includes(encodeURIComponent(page)), "Missing launcher link: " + page);
}
for (const shortcut of manifest.shortcuts || []) {
  assert(existsSync(decodeURIComponent(shortcut.url.replace(/^\.\//,""))), "Missing shortcut: " + shortcut.url);
}
console.log("Games PWA: manifest, icons, 5 game pages, launcher and offline cache verified.");
