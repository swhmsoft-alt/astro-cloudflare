import { execSync } from "child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
process.chdir(ROOT);

console.log("=== P0 Build Verification ===");
console.log("CWD:", ROOT);

// Check node_modules
console.log("node_modules/astro:", existsSync("node_modules/astro"));

// Run build
try {
  const r = execSync("pnpm build", { stdio: "pipe", timeout: 180000, shell: true });
  console.log("BUILD_EXIT_CODE:", r.status);
  const out = r.stdout.toString();
  const lines = out.split("\n");
  // Save full output
  writeFileSync(resolve(ROOT, "build-output.txt"), out, "utf8");
  // Print last 30 lines
  console.log("=== Last 30 lines of build output ===");
  console.log(lines.slice(-30).join("\n"));
} catch (e) {
  console.log("BUILD_EXIT_CODE:", e.status);
  console.log("BUILD_ERROR:", e.message?.slice(0, 500));
  if (e.stdout) {
    const out = e.stdout.toString();
    writeFileSync(resolve(ROOT, "build-output.txt"), out, "utf8");
    const lines = out.split("\n");
    console.log("=== Last 30 lines of build output ===");
    console.log(lines.slice(-30).join("\n"));
  }
  if (e.stderr) {
    const err = e.stderr.toString();
    console.log("=== STDERR (last 30 lines) ===");
    const errLines = err.split("\n");
    console.log(errLines.slice(-30).join("\n"));
  }
}

// Check dist
if (existsSync("dist")) {
  const items = readdirSync("dist", { recursive: true }).filter(f => f.endsWith(".html"));
  console.log("Total HTML pages:", items.length);
  // Group by locale
  const localeCounts = {};
  for (const f of items) {
    const parts = f.replace(/\\/g, "/").split("/");
    const locale = parts[0] === "en" || parts[0] === "de" || parts[0] === "ja" || parts[0] === "fr" || parts[0] === "es" || parts[0] === "pt-br" || parts[0] === "it" || parts[0] === "ko" || parts[0] === "nl" || parts[0] === "pl" ? parts[0] : "root";
    localeCounts[locale] = (localeCounts[locale] || 0) + 1;
  }
  console.log("Page distribution:", JSON.stringify(localeCounts, null, 2));
  
  // Check _redirects
  if (existsSync("dist/_redirects")) {
    const redirects = readFileSync("dist/_redirects", "utf8");
    const redirectLines = redirects.split("\n").filter(l => l.trim());
    console.log("_redirects rules:", redirectLines.length);
    console.log("_redirects first 5:", redirectLines.slice(0, 5));
    console.log("_redirects last 5:", redirectLines.slice(-5));
  } else {
    console.log("_redirects: MISSING");
  }
}

console.log("=== DONE ===");