const fs = require("node:fs");
const path = require("node:path");
const esbuild = require("esbuild");

const dist = path.join(__dirname, "dist");
const minify = process.argv.includes("--minify");
const output = path.join(dist, minify ? "index.min.js" : "index.js");

try {
  fs.mkdirSync(dist, { recursive: true });
  esbuild.buildSync({
    entryPoints: [path.join(__dirname, "src", "main.ts")],
    bundle: true,
    minify,
    outfile: output,
    platform: "node",
    target: "node22",
    banner: { js: "#!/usr/bin/env node" },
  });

  if (minify) {
    fs.copyFileSync(output, path.join(dist, "backup.js"));
  }

  console.log(`Build completata: ${path.relative(__dirname, output)}`);
} catch (err) {
  console.error("Errore durante la build:", err);
  process.exitCode = 1;
}
