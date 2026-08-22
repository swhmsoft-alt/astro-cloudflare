#!/usr/bin/env node
// scripts/build-no-pagefind.mjs
//
// Cross-platform wrapper that sets SKIP_PAGEFIND=true and runs `astro build`.
// Needed because Windows cmd.exe does NOT support inline env-var assignment
// (`KEY=val command` is a POSIX-only idiom).
//
// astro.config.ts reads `process.env.SKIP_PAGEFIND` at integration-init time
// (line ~170, `starlight({ pagefind: ... })`) and disables the Pagefind
// search index. This lets the Starlight `astro:build:done` hook resolve
// immediately instead of hanging on a Node-26/Pagefind race, so `@astrojs/sitemap`
// and the rest of the post-build pipeline can complete normally.
//
// CI / Cloudflare Pages: set `SKIP_PAGEFIND=true` as a *build* env var in
// the Pages dashboard. `wrangler.jsonc` vars are runtime-only.

import { spawn } from "node:child_process";
import process from "node:process";

// On Windows, .cmd / .bat binaries require `shell: true` to be spawned
// without EINVAL. Pass the command as a single string in that case so the
// shell can resolve PATH and PATHEXT.
const useShell = process.platform === "win32";
const cmd = useShell ? "astro build" : "astro";
const args = useShell ? [] : ["build"];

const child = spawn(cmd, args, {
  stdio: "inherit",
  env: { ...process.env, SKIP_PAGEFIND: "true" },
  shell: useShell,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
