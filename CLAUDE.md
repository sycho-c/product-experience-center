# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server at `http://localhost:5173/product-experience-center/` (note the subpath; HMR uses polling)
- `npm run typecheck` — `tsc -b --noEmit`
- `npm run build` — `tsc -b && vite build` → `dist/`
- `npm run preview` — preview the built bundle locally

There is **no test runner**. Treat `npm run typecheck` (always) and `npm run build` (when touching routing / `vite.config.ts` / scenario loading) as the verification baseline before handing off changes.

## Deployment

`main` → `.github/workflows/deploy.yml` builds and publishes to GitHub Pages. `vite.config.ts` sets `base: '/product-experience-center/'`. Routing uses **HashRouter**, so no GH Pages 404 fallback is required — do not switch to BrowserRouter without also fixing the `base` and 404 story.

## Architecture

This is a **dummy-data product experience simulator** for DWORKS / Cowork+. There is no real backend — every interaction is driven by scenario data and synthetic UI state. The system simulates PC backoffice + mobile in parallel.

### Three layers that interact via zustand stores

1. **Scenario layer** (`src/features/scenario/`) — owns playback (`status`, `stepIndex`, `actionIndex`, `mode: 'after' | 'before'`). `runner.ts` is the single ticker: 100 ms tick, default step duration 8 s, auto-action interval 1.4 s. ⏭/⏮ operate at **action granularity when a step has `actions[]`**, otherwise at step granularity with time-offset `talks[]` emission. `applyScenarioSeed` resets all domain stores then applies `scenario.seed`.
2. **UI-simulation layer** (`src/features/ui-simulation/`) — synthetic UI state (open modals, active tabs, current step within a modal, etc.). `actions.ts#applyUIAction` is the dispatcher: it switches on `UIAction.kind` (`open_modal`, `close_modal`, `set_modal_step`, `set_tab`, …) and writes into the UISim store **and** the relevant domain stores.
3. **Domain layer** (`src/features/domain/{tasks,bizforms,knowledge,knowledge-base,todos,participants,contracts,external-users,settings}/`) — per-domain zustand stores with a `reset()` method (called by `applyScenarioSeed`). Components read from these directly; the scenario runner never reaches into components, only into stores.

All stores use `zustand` + `immer`. When adding a new store, expose a `reset()` and ensure `applyScenarioSeed` invokes it, otherwise scenario replays will leak state across runs.

### Scenarios

Scenario fixtures live in `src/data/scenarios/<id>.ts` (full data, lazy-loaded) with a sibling `<id>.meta.ts` (eagerly-imported summary). Both are wired into `src/data/scenarios/_index.ts#scenarioRegistry`. **A new scenario requires three edits**: `<id>.ts`, `<id>.meta.ts`, and a registry entry.

Scenarios may set `extends: <parentId>` — `extract-final-seed.ts` derives the parent's terminal state and uses it as the child's starting seed; the child's own `seed` is layered on top. `beforeSteps[]` (when present) is the "before" comparison track surfaced via `mode: 'before'`. Validation is via zod (`src/lib/schema.ts`).

### Routing & shell

`HashRouter` in `src/App.tsx` mounts everything under `AppShell` (`src/layouts/`). The five top-level routes are `/`, `/scenarios`, `/scenarios/:id/experience` (with a redirect from `/scenarios/:id`), `/features` (playground), and `*` (404). The experience route composes `ExperienceLayout` + `DeviceFramePC` / `DeviceFrameMobile` + scenario controls; the embedded product shell is `CoworkShell` (Cowork+) or `KakaoPCShell` depending on the scenario.

### Conventions

- Path alias `@/` → `src/`. Use it for cross-feature imports; keep feature-internal imports relative.
- Two-space indent, single quotes, semicolons, named exports for components, PascalCase component/route filenames, Tailwind utilities for styling.
- Keep feature code inside its feature directory unless clearly reusable (then promote to `src/components/` or `src/lib/`).
- Don't add comments that restate the code. Korean comments are fine and idiomatic here.

### Pitfalls

- Selectors that return arrays/objects must return a **stable reference** when empty — see `EMPTY_STEPS` in `features/scenario/store.ts`. Returning a fresh `[]` each call triggers `useSyncExternalStore` infinite loops.
- `runner.ts` holds module-level state (`tickerHandle`, `visited`). Do not instantiate multiple runners; route any new playback features through the existing ticker.
- `vite.config.ts` forces `usePolling` for HMR — required on some macOS mounts. Don't remove without a replacement.
