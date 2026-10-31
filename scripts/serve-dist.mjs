/**
 * Serves dist/ exactly the way vercel.json describes it (filesystem first,
 * then rewrites, then 404.html with a 404 status, plus every header rule) so
 * the production build — CSP included — can be tested locally.
 *
 *   node scripts/serve-dist.mjs [port]
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, createReadStream } from "node:fs";
import { join, extname, normalize } from "node:path";

const port = Number(process.argv[2] ?? 4173);
const root = "dist";
const cfg = JSON.parse(readFileSync("vercel.json", "utf8"));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

// Minimal path-to-regexp for the patterns used in vercel.json
const toRegex = (src) =>
  new RegExp(
    "^" +
      src
        .replace(/:(\w+)\*/g, "(?<$1>.*)")
        .replace(/:(\w+)/g, "(?<$1>[^/]+)")
        .replace(/\//g, "\\/") +
      "$",
  );

const headerRules = cfg.headers.map((h) => ({ re: toRegex(h.source), headers: h.headers }));
const rewrites = cfg.rewrites.map((r) => ({ re: toRegex(r.source), dest: r.destination }));

function fileFor(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const p = join(root, safe);
  if (existsSync(p) && statSync(p).isFile()) return p;
  if (existsSync(join(p, "index.html"))) return join(p, "index.html");
  return null;
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = url.pathname;
  for (const rule of headerRules)
    if (rule.re.test(path)) for (const h of rule.headers) res.setHeader(h.key, h.value);

  let file = fileFor(path);
  let status = 200;
  if (!file) {
    const rw = rewrites.find((r) => r.re.test(path));
    if (rw) file = fileFor(rw.dest);
  }
  if (!file) {
    file = join(root, "404.html");
    status = 404;
  }
  res.statusCode = status;
  res.setHeader("Content-Type", TYPES[extname(file)] ?? "application/octet-stream");
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`serving dist/ like Vercel on http://localhost:${port}`));
