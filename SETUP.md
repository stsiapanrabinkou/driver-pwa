# SETUP.md – Project initialization (run once, in an empty folder)

This is the bootstrap runbook. A designer drops the guardrail files into an empty folder and tells an AI agent to run this. The agent scaffolds an empty-but-armed React + Mantine project, incorporating Domain-Driven Design constraints, then stops.

**No product UI is created** — just one readiness screen that confirms the setup and lists what was done.

## For the designer
1. Create an empty folder and drop these files into its root:
   `AGENTS.md`, `SETUP.md`, `check-scope.mjs`, `scope-guard.yml`, `.workflow-mode`,
   `eslint.presentation.js`, `router.tsx`, `routes.tsx`, `flatten.ts`, `DevBar.tsx`,
   `DevBar.styles.ts`, `ReadyView.tsx`, `ReadyView.styles.ts`,
   `ThemeShowcase.stories.tsx`, `FlowMap.stories.tsx`.
2. Open the folder in Claude Code (or Cursor/Copilot) and send **one** message:
   > Read `SETUP.md` and initialize the project. Do exactly the steps in it, nothing else. Don't build any product UI — end on the readiness screen.
3. Wait. When it finishes, **both servers are running** — the app on `http://localhost:5173` and Storybook on `http://localhost:6006` — and your browser shows **"We're ready to start"** with the checklist. From then on, just describe screens and flows — they get built in Mantine under `/src/flows`, clickable and navigable on mock data (Design Mode, per `AGENTS.md`).

## For the agent — execute in order

Scaffold **in the current folder** (the guardrail files already here are the policy; wire them in, don't overwrite them). Read `AGENTS.md` first.

> **Three things in this runbook are non-negotiable, because getting them wrong breaks the whole premise:**
> - **Step 7** — the router bridge must be **generic from the start**. Do NOT hardcode an index route. If you do, the designer's first flow forces an `/app` edit, which means a dev-mode commit for work that is purely design. The bridge file is dropped in for you; use it as-is.
> - **Step 9** — the current template ships **oxlint**, not eslint, so you **create** `eslint.config.js` with the standard react-ts baseline (typescript-eslint + react-hooks + react-refresh) and **append** the presentation fragment to it. Those baseline rules must be present, or `--max-warnings=0` is a green check over an empty config. (Step 3 removes oxlint so there's a single linter, not two.)
> - **Step 6** — `ReadyView` goes in `/src/flows`, **not** `/src/app`. The designer's first prompt deletes it, and Design Mode cannot touch `/app`.

1. **Scaffold Vite + React + TS** into the current directory:
   `npm create vite@latest . -- --template react-ts` then `npm install`.
   (If the CLI refuses because files exist, scaffold in a temp dir and copy `src/`, `index.html`, `vite.config.ts`, and config files in — keep the dropped guardrail files untouched.)
   > **The current react-ts template ships `oxlint`, not ESLint** — an `.oxlintrc.json` plus a `"lint": "oxlint"` script, and **no `eslint.config.js`**. This kit is ESLint-based (its guardrails *are* ESLint rules), so step 3 removes oxlint and installs the ESLint baseline, and step 9 *creates* `eslint.config.js`. The goal is **one linter**, not two side by side.
   Then **`git init`** if the folder isn't a repo yet — both Husky (step 10) and `check-scope.mjs` (step 11) need one, and they'll fail without it.

2. **Install core dependencies:**
   `npm i @mantine/core @mantine/hooks @mantine/form @mantine/dates @mantine/notifications @mantine/modals @tabler/icons-react dayjs zustand @tanstack/react-query @tanstack/react-router zod`.
   **Unpinned on purpose** — every new project gets the current Mantine major
   (v9 at the time of writing). After installing, check what you actually got
   (`npm ls @mantine/core`) and report it on the readiness screen.
   - **Keep every `@mantine/*` package on the exact same version.** They're
     released in lockstep and mixing versions (e.g. `@mantine/core@9` with
     `@mantine/dates@8`) causes type and runtime breakage. If `npm` resolved
     different versions, pin them to match.
   - `dayjs` is a **peer dependency of `@mantine/dates`** — the date components
     won't work without it.
   - `@tabler/icons-react` is the icon set the components and stories import.
   - **Mantine v9 requires React 18+** (works with React 19). The Vite react-ts
     template already gives you a compatible React.
   - If the installed major is **newer than v9**, don't assume these notes still
     hold: check Mantine's migration guide for that major, and expect the Theme
     Showcase to surface any removed/renamed APIs immediately (that's its job).
   - Mantine also publishes an **`llms.txt`** (every doc page + demo, ~1.8 MB) —
     handy to feed your agent if it needs current component APIs.

3. **Install dev tooling:** `npm i -D husky lint-staged concurrently eslint-plugin-react`.
   - `concurrently` — step 11 runs the app and Storybook together.
   - `eslint-plugin-react` — step 9's `react/forbid-elements` needs it. This is what
     makes "Mantine-only" an actual rule instead of a note in a README.

   **Mantine PostCSS preset** (recommended by Mantine; required if you later opt into CSS Modules):
   `npm i -D postcss postcss-preset-mantine postcss-simple-vars`, then create `postcss.config.cjs`:
   ```js
   module.exports = {
     plugins: {
       "postcss-preset-mantine": {},
       "postcss-simple-vars": {
         variables: {
           "mantine-breakpoint-xs": "36em",
           "mantine-breakpoint-sm": "48em",
           "mantine-breakpoint-md": "62em",
           "mantine-breakpoint-lg": "75em",
           "mantine-breakpoint-xl": "88em",
         },
       },
     },
   };
   ```

   **Consolidate to one linter — remove oxlint, add the ESLint baseline.** The
   scaffold shipped oxlint; the guardrails are ESLint rules, so keeping both is
   just dead config side by side. Do this here:
   - Delete `.oxlintrc.json`, remove `oxlint` from `devDependencies`, and drop the
     `"lint": "oxlint"` script from `package.json` (step 10 wires the real lint scripts).
   - Install the ESLint baseline the template no longer provides — the same stack the
     old react-ts template used to ship, which step 9 builds on:
     `npm i -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals`.

4. **Install Storybook:** `npx storybook@latest init --no-start` (it auto-detects Vite + React; `--no-start` stops it hijacking the terminal — step 11 launches it properly).
   Then make every story render under the real theme by adding the ThemeProvider decorator **and the Mantine style imports** to `.storybook/preview.tsx`:
   ```tsx
   import "@mantine/core/styles.css";
   import "@mantine/dates/styles.css";
   import "@mantine/notifications/styles.css";
   import type { Preview } from "@storybook/react-vite";
   import { ThemeProvider } from "../src/theme/ThemeProvider";

   const preview: Preview = {
     decorators: [(Story) => (<ThemeProvider><Story/></ThemeProvider>)],
   };
   export default preview;
   ```
   (The ThemeProvider itself also imports these CSS files, so the imports here are
   belt-and-braces; keep them — Storybook orders CSS more predictably this way.)
   > Storybook 8+ moved the framework types out of `@storybook/react` into
   > `@storybook/react-vite`. Both dropped story files already import from
   > `@storybook/react-vite`. If `npx storybook init` pinned an older major that
   > doesn't export it, fall back to `@storybook/react` **in all three files**
   > (`preview.tsx`, `ThemeShowcase.stories.tsx`, `FlowMap.stories.tsx`) — don't
   > leave them mismatched.

   Delete Storybook's generated example stories (`src/stories/*` **and** `src/stories/assets/`) — but keep the folder; the dropped stories move in at step 5.

5. **Create the DDD folder structure** under `/src` and file the dropped files into it:
   ```text
   /app
     router.tsx   (Dev: router instance + the bridge that consumes /flows.
                   ReadyView is NOT here — see step 6.)
   /flows
     routes.tsx   (Designer: declarative route tree. ReadyView pre-registered at "/".)
     /_ready
       ReadyView.tsx         (Designer-owned: the init status screen. Deleted on first real flow.)
       ReadyView.styles.ts   (its co-located style objects)
     /_devbar
       DevBar.tsx            (dev-only nav bar, reads routes.tsx)
       DevBar.styles.ts      (its co-located style objects)
       flatten.ts            (shared tree-flattening; DevBar + Flow Map both use it)
     (Designer: navigable user-flows on mock data live here — route-group folders)
   /features
     (empty — smart controllers and business logic live here later)
   /shared
     /ui (empty — shared dumb presentation lives here later)
   /theme
     tokens.ts, ThemeProvider.tsx
   /stories
     ThemeShowcase.stories.tsx, FlowMap.stories.tsx
   ```
   Moves — **do not rewrite these files, just move them**:
   - `routes.tsx` → `src/flows/routes.tsx`
   - `ReadyView.tsx`, `ReadyView.styles.ts` → `src/flows/_ready/`
   - `DevBar.tsx`, `DevBar.styles.ts` → `src/flows/_devbar/`
   - `flatten.ts` → `src/flows/_devbar/flatten.ts`
   - `router.tsx` → `src/app/router.tsx`
   - `ThemeShowcase.stories.tsx`, `FlowMap.stories.tsx` → `src/stories/`

   Then write the two theme files:
   - `theme/tokens.ts` — export a Mantine theme via `createTheme` (`primaryColor`, a custom colour tuple, `defaultRadius`, `fontFamily`, `headings`). Start minimal; it's the single source of visual truth. **The only file allowed to contain raw hex** (step 9 enforces this — and Mantine custom colours *are* hex tuples, so this is genuinely where they belong):
     ```ts
     import { createTheme, type MantineColorsTuple } from "@mantine/core";

     const brand: MantineColorsTuple = [
       "#eef2ff","#e0e7ff","#c7d2fe","#a5b4fc","#818cf8",
       "#6366f1","#4f46e5","#4338ca","#3730a3","#312e81",
     ];

     export const theme = createTheme({
       primaryColor: "brand",
       primaryShade: { light: 6, dark: 5 },
       defaultRadius: "md",
       colors: { brand },
       fontFamily:
         '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
       headings: { fontWeight: "600" },
     });
     ```
   - `theme/ThemeProvider.tsx` — wraps children in `<MantineProvider theme={theme}>`, mounts `ModalsProvider` + `<Notifications />` (so the imperative `modals.*` / `notifications.*` APIs work app-wide and in Storybook), and imports Mantine's CSS **once, here** (core first). Export it as a **named** export (`export function ThemeProvider`) — `router.tsx` and `.storybook/preview.tsx` both import it that way:
     ```tsx
     import "@mantine/core/styles.css";
     import "@mantine/dates/styles.css";
     import "@mantine/notifications/styles.css";

     import type { ReactNode } from "react";
     import { MantineProvider } from "@mantine/core";
     import { ModalsProvider } from "@mantine/modals";
     import { Notifications } from "@mantine/notifications";
     import { theme } from "./tokens";

     export function ThemeProvider({ children }: { children: ReactNode }) {
       return (
         <MantineProvider theme={theme} defaultColorScheme="light">
           <ModalsProvider>
             <Notifications />
             {children}
           </ModalsProvider>
         </MantineProvider>
       );
     }
     ```
     > **CSS import order matters:** `@mantine/core/styles.css` must come before the
     > package styles (`dates`, `notifications`). The DevBar's light/dark toggle
     > uses `useMantineColorScheme()` directly — no prop threading needed, so
     > `defaultColorScheme` here is all the wiring the theme switch requires.

6. **The readiness screen is already placed and already wired.** `ReadyView.tsx` moved to `src/flows/_ready/` in step 5, and `src/flows/routes.tsx` already registers it as the `/` route. Nothing else to do — the router in step 7 picks it up generically, like any other flow.
   - Update its `"Mantine (@mantine/core, @mantine/hooks) + @tabler/icons-react"` checklist entry to include the version actually installed (e.g. `"Mantine 9.4.1 (@mantine/core) + @tabler/icons-react"`), so the designer can see at a glance which major this project is on. That's the only edit.
   - **It lives in `/flows` deliberately.** `/app` is dev-owned and off-limits in Design Mode; if ReadyView lived there, the designer's first act — replacing it — would trip the scope guard on day one.

7. **Wire the app to the router bridge.** `src/app/router.tsx` was dropped in at step 5 and is **already generic** — it recursively converts `flows/routes.tsx` into TanStack routes, translates `:id` → `$id`, and mounts `ThemeProvider` → `DevBar` → `<Outlet/>` at the root. **Do not simplify it to a hardcoded index route.** That one shortcut is what forces a dev-mode `/app` commit the moment the designer adds their first screen.

   Your job here is only to connect it:
   - Delete the Vite demo markup, logos, `App.css`, and `index.css` defaults. `App.tsx` can go entirely.
   - Rewrite `src/main.tsx`:
     ```tsx
     import { StrictMode } from "react";
     import { createRoot } from "react-dom/client";
     import { RouterProvider } from "@tanstack/react-router";
     import { router } from "./app/router";

     createRoot(document.getElementById("root")!).render(
       <StrictMode>
         <RouterProvider router={router} />
       </StrictMode>
     );
     ```
     (Mantine's CSS is imported inside `ThemeProvider`, which the router mounts at
     the root — so `main.tsx` stays clean and there's a single place the styles
     come from.)
   - The DevBar's theme switch works out of the box via `useMantineColorScheme()`;
     unlike the antd kit, there's no `isDark` state to lift or props to thread.

   This is the router **shell**, not routing logic: no loaders, no guards, no data. Dev extends it during integration. Mounting the DevBar here is the one-time step that touches dev-owned `/app`, done now so designers never need to.

8. **File the guardrails into place:**
   - move `check-scope.mjs` → `scripts/check-scope.mjs`
   - move `scope-guard.yml` → `.github/workflows/scope-guard.yml`
   - leave `AGENTS.md`, `.workflow-mode` and `eslint.presentation.js` at root.
   - symlink or copy `AGENTS.md` to `.cursorrules` and `CLAUDE.md`.

9. **Create the ESLint config — baseline first, then APPEND the fragment.** The current template ships **no** `eslint.config.js` (it uses oxlint, removed in step 3), so write one with the standard react-ts baseline — `js.configs.recommended`, `typescript-eslint`, `react-hooks`, `react-refresh` — and add the dropped `eslint.presentation.js` fragment (Mantine-only, tokens-not-hex, no-logic-in-presentation) at the **end**:
   ```js
   // eslint.config.js
   import js from "@eslint/js";
   import globals from "globals";
   import reactHooks from "eslint-plugin-react-hooks";
   import reactRefresh from "eslint-plugin-react-refresh";
   import tseslint from "typescript-eslint";
   import { globalIgnores } from "eslint/config";
   import { presentationRules } from "./eslint.presentation.js";

   export default tseslint.config([
     globalIgnores(["dist", "storybook-static"]),
     {
       files: ["**/*.{ts,tsx}"],
       extends: [
         js.configs.recommended,
         tseslint.configs.recommended,
         reactHooks.configs["recommended-latest"],
         reactRefresh.configs.vite,
       ],
       languageOptions: { ecmaVersion: 2020, globals: globals.browser },
     },
     ...presentationRules,   // last, so its bans win any conflict
   ]);
   ```
   Order matters: `presentationRules` last. This is the same baseline the old
   react-ts template used to ship — you're recreating it, then extending it, so
   nothing else about the kit changes.
   **Sanity check before moving on:** `npx eslint --print-config src/flows/routes.tsx`
   must list `react-hooks/rules-of-hooks` **and** `react/forbid-elements`. If either
   is missing, the baseline didn't take — go back.

10. **Wire package.json for scripts, Husky & lint-staged:**
    - Replace the `dev` script so **both servers come up together** — Storybook isn't optional, the DevBar links straight into it:
      ```json
      "scripts": {
        "dev": "concurrently -k -n app,storybook -c cyan,magenta \"npm:dev:app\" \"npm:dev:storybook\"",
        "dev:app": "vite",
        "dev:storybook": "storybook dev -p 6006 --no-open",
        "prepare": "husky"
      }
      ```
      (`-k` kills both when one dies, so Ctrl-C actually stops everything.)
    - Add to package.json: `"lint-staged": { "src/{shared/ui,features/*/ui,flows,theme,stories}/**/*.{ts,tsx}": ["eslint --max-warnings=0"] }`
    - run `npm run prepare` (or `npx husky init`)
    - create `.husky/pre-commit` containing:
      ```bash
      npx lint-staged
      node scripts/check-scope.mjs
      ```

11. **Verify, then launch:**
    - `npx tsc --noEmit` passes.
    - `npx eslint "src/**/*.{ts,tsx}"` passes with zero warnings.
    - `node scripts/check-scope.mjs` passes (mode is `designer`; no forbidden paths touched yet).
    - `npm run dev` — **leave it running.** Confirm **both** are actually up before reporting:
      - app responds at `http://localhost:5173` and renders the readiness screen
      - Storybook responds at `http://localhost:6006`
      - the **Theme Showcase** story renders
      - the **Flow Map** story renders at `/?path=/story/system-flow-map--all-flows` — this is the exact URL the DevBar's "Flow map" button opens. If it 404s, the story's `title`/export name drifted; fix it, don't ship a dead button.
    - Click the DevBar's **Storybook** and **Flow map** buttons once. Both must land on a real page.

## Definition of done
- App compiles, `tsc` and `eslint` are clean, and **both** dev servers are running (5173 + 6006).
- Browser shows **only** the readiness screen ("We're ready to start" + checklist).
- Storybook shows the **Theme Showcase** and the **Flow Map**, and both DevBar buttons reach them.
- `eslint --print-config` proves react-hooks and react/forbid-elements are both live.
- **One linter:** the scaffold's oxlint is gone — no `.oxlintrc.json`, no `oxlint` dep or `oxlint` script — and `eslint.config.js` is the single source of lint rules.
- `src/app/router.tsx` builds its tree from `flows/routes.tsx` generically — grep it for hardcoded screen paths; there should be none.
- No product components, forms, or features exist yet.
- `.workflow-mode` is `designer`; guardrails (ESLint, pre-commit, CI) are armed against modifying `api/`, `controllers/`, `store/`, `models/`, and `app/`.
- Report the checklist of what was installed/created and **both** URLs, then stop and wait for the designer's first screen prompt.
