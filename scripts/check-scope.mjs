// scripts/check-scope.mjs
//
// Fails the commit/PR if a "designer" diff touches off-limits areas.
// Reads the current mode from .workflow-mode (designer | dev) at repo root.
// In dev mode it does nothing. Adjust the `forbidden` patterns to your tree.

import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const mode = existsSync(".workflow-mode")
  ? readFileSync(".workflow-mode", "utf8").trim()
  : "dev";

if (mode !== "designer") process.exit(0); // dev mode: no restrictions

// Compare against the PR base in CI, or the last commit locally.
// On a fresh repo with no commits yet, `git diff HEAD` errors — treat that as
// "nothing to check" rather than failing init.
// In CI: three-dot against the merge base. Two-dot (`git diff origin/main`)
// also reports commits others landed on main as reversed changes, which fails
// PRs that never touched a forbidden path.
// Locally: --cached, so only what's actually being committed is judged —
// unstaged scratch work in /app shouldn't block an unrelated design commit.
const range = process.env.GITHUB_BASE_REF
  ? `${process.env.GITHUB_BASE_REF}...HEAD`
  : "--cached HEAD";

let files = [];
try {
  files = execSync(`git diff --name-only ${range}`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] })
    .split("\n")
    .filter(Boolean);
} catch {
  console.log("\u2713 scope check skipped (no git history to compare yet)");
  process.exit(0);
}

// Note: src/flows/ is intentionally NOT here — designers own navigable flows
// (screens + route tree) on mock data. Routing LOGIC lives in src/app/, which
// IS forbidden below, so the boundary holds: designers declare routes, dev
// wires loaders/guards/redirects.
const forbidden = [
  /^src\/features\/.*\/api\//,         // real integrations (TanStack Query hooks)
  /^src\/features\/.*\/controllers\//, // smart components / business logic
  /^src\/features\/.*\/store\//,       // state management (Zustand)
  /^src\/features\/.*\/models\//,      // data models and schemas (Zod)
  /^src\/app\//,                       // router instance, routing logic, global providers
  /^src\/tests?\//,                    // test suite
  /\.test\.[jt]sx?$/,                  // colocated tests
];

const bad = files.filter((f) => forbidden.some((re) => re.test(f)));

if (bad.length) {
  console.error(
    "\n\u2716 Design Mode (.workflow-mode=designer) may not touch:\n" +
      bad.map((f) => "   " + f).join("\n") +
      "\n\n  Move this work to a dev branch, or set .workflow-mode=dev " +
      "if this is integration work.\n"
  );
  process.exit(1);
}

console.log("\u2713 scope check passed (designer mode)");