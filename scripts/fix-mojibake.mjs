/**
 * fix-mojibake.mjs
 * ---------------------------------------------
 * Reverses the UTF-8 -> GBK mojibake baked into src/content Markdown.
 *
 * The corruption destroys the single character that followed an em/en-dash,
 * so dash ranges are reconstructed from domain knowledge (round numbers).
 *
 * Run: `node scripts/fix-mojibake.mjs`
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { globSync } from "glob";

const root = fileURLToPath(new URL("..", import.meta.url));

// 1) Chemical formulas / superscripts (longest first).
const FORMULA = [
  ["H鈧係O鈧?", "H₂SO₄"],
  ["HNO鈧?", "HNO₃"],
  ["TiB鈧?", "TiB₂"],
  ["TiO鈧?", "TiO₂"],
  ["H鈧係", "H₂S"],
  ["10鈦烩伖", "10⁻⁹"],
  ["10鈦?", "10⁷"],
];

// 2) Comparison / arrow relations.
const RELATIONS = [
  ["鈮?", "≤ "],
  ["鈫?", "→ "],
  ["MPa鈭歮", "MPa·√m"],
];

// 3) Numeric dash ranges: `X鈥?Y` -> `X–Z`, where the `?` swallowed the
//    leading digit/$ of the second number. Most-specific strings first.
const DASH_RANGES = [
  ["$3,000鈥?10,000+", "$3,000–$10,000+"],
  ["$500鈥?2,000", "$500–$2,000"],
  ["$800鈥?3,000+", "$800–$3,000+"],
  ["$800鈥?3,000", "$800–$3,000"],
  ["$200鈥?1,000", "$200–$1,000"],
  ["$500鈥?2,000+", "$500–$2,000+"],
  ["$150鈥?500", "$150–$500"],
  ["$200鈥?800", "$200–$800"],
  ["$30鈥?150", "$30–$150"],
  ["$50鈥?200", "$50–$200"],
  ["0.100鈥?.200", "0.100–0.200"],
  ["0.010鈥?.050", "0.010–0.050"],
  ["0.080鈥?.180", "0.080–0.180"],
  ["0.050鈥?.150", "0.050–0.150"],
  ["0.004鈥?.008", "0.004–0.008"],
  ["0.003鈥?.005", "0.003–0.005"],
  ["0.005鈥?.012", "0.005–0.012"],
  ["0.005鈥?.010", "0.005–0.010"],
  ["0.006鈥?.015", "0.006–0.015"],
  ["0.006鈥?.014", "0.006–0.014"],
  ["1000鈥?000 mm/s", "1000–2000 mm/s"],
  ["500鈥?000 mm/s", "500–2000 mm/s"],
  ["20鈥?0 碌m", "20–60 µm"],
  ["30鈥?0 碌m", "30–60 µm"],
  ["20鈥?0% improvement", "20–50% improvement"],
  ["20鈥?0%", "20–40%"],
  ["20鈥?0掳C", "20–40°C"],
  ["20鈥?00 碌m", "20–100 µm"],
  ["15鈥?0 minutes", "15–30 minutes"],
  ["100鈥?00 MPa", "100–200 MPa"],
  ["100鈥?00 W", "100–400 W"],
  ["200鈥?00 W", "200–400 W"],
  ["900鈥?50掳C", "900–950°C"],
  ["400鈥?00 HV", "400–600 HV"],
  ["500鈥?00 V", "500–700 V"],
  ["80鈥?20 mesh", "80–120 mesh"],
  ["60鈥?00 mesh", "60–100 mesh"],
  ["2000鈥?000+", "2000–4000+"],
  ["120鈥?40", "120–240"],
  ["800鈥?200", "800–1200"],
  ["2鈥?0脳 improvement", "2–10× improvement"],
  ["20鈥?0% improvement", "20–50% improvement"],
  ["10鈥?00 pcs", "10–100 pcs"],
  ["10鈥?0 pcs", "10–50 pcs"],
  ["50鈥?00+ pcs", "50–100+ pcs"],
  ["1鈥?0 pcs", "1–10 pcs"],
  ["100鈥?000+ pcs", "100–1000+ pcs"],
  ["3鈥? business days", "3–5 business days"],
  ["5鈥?0 business days", "5–10 business days"],
  ["3鈥? weeks", "3–4 weeks"],
  ["4鈥? weeks", "4–6 weeks"],
  ["1鈥? weeks", "1–2 weeks"],
  ["2鈥? weeks", "2–3 weeks"],
  ["150鈥?50", "150–250"],
  ["200鈥?50", "200–250"],
  ["250鈥?00", "250–400"],
  ["200鈥?00", "200–400"],
  ["6鈥?0 碌m Ra (as-built)", "6–10 µm Ra (as-built)"],
  ["6鈥?0 碌m Ra (standard)", "6–10 µm Ra (standard)"],
  ["6鈥?0 碌m Ra", "6–10 µm Ra"],
  ["80鈥?0% scrap", "80–90% scrap"],
  ["3鈥? 碌m Ra (fine", "3–5 µm Ra (fine"],
  ["0.80鈥?.60", "0.80–1.60"],
  ["0.05鈥?.20", "0.05–0.20"],
  ["0.05鈥?.15", "0.05–0.15"],
  ["1.6鈥?.2", "1.6–3.2"],
  ["1.2鈥?.6", "1.2–1.6"],
  ["0.6鈥?.8", "0.6–0.8"],
  ["0.4鈥?.8", "0.4–0.8"],
  ["0.3鈥?.4", "0.3–0.4"],
  ["0.2鈥?.4", "0.2–0.4"],
  ["0.1鈥?.2", "0.1–0.2"],
  ["6.0鈥?0.0", "6.0–10.0"],
  ["0.1鈥?.3 mm", "0.1–0.3 mm"],
  ["0.05鈥?.20 mm", "0.05–0.20 mm"],
  ["0.7鈥?.2 mm", "0.7–1.2 mm"],
  ["0.5鈥?.0掳", "0.5–1.0°"],
  ["75鈥?5%", "75–85%"],
  ["0.1鈥?.0%", "0.1–1.0%"],
  ["0.2鈥?.8 碌m Ra", "0.2–0.8 µm Ra"],
  ["0.4鈥?.8 碌m Ra", "0.4–0.8 µm Ra"],
  ["0.05鈥?.2 碌m Ra", "0.05–0.2 µm Ra"],
  ["0.05鈥?.8 碌m Ra", "0.05–0.8 µm Ra"],
  ["1.6鈥?.3 碌m Ra", "1.6–3.3 µm Ra"],
  ["0.8鈥?.2 碌m Ra", "0.8–1.2 µm Ra"],
  ["0.8鈥?.6 碌m", "0.8–1.6 µm"],
  ["1.2鈥?.2 碌m", "1.2–3.2 µm"],
  ["1鈥? 碌m", "1–2 µm"],
  ["2鈥? bar", "2–4 bar"],
  ["3鈥? bar", "3–5 bar"],
];

// 4) Single-character global maps (run last).
const SINGLE = [
  ["卤", "±"],
  ["碌", "µ"],
  ["掳", "°"],
  ["鲁", "³"],
  ["虏", "²"],
  ["路", "·"],
  ["脜", "Å"],
  ["脳", "×"],
];

function fix(text) {
  let out = text;
  for (const [from, to] of FORMULA) out = out.split(from).join(to);
  for (const [from, to] of RELATIONS) out = out.split(from).join(to);
  for (const [from, to] of DASH_RANGES) out = out.split(from).join(to);
  // Remaining 鈥? are em-dash glosses (a space was swallowed).
  out = out.split("鈥?").join("— ");
  for (const [from, to] of SINGLE) out = out.split(from).join(to);
  return out;
}

let changed = 0;
for (const file of globSync("src/content/**/*.{md,mdx}", { cwd: root, absolute: true })) {
  const original = readFileSync(file, "utf8");
  const fixed = fix(original);
  if (fixed !== original) {
    writeFileSync(file, fixed);
    changed++;
  }
}
console.log(`fix-mojibake: repaired ${changed} file(s).`);

