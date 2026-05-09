# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript product experience simulator deployed under `/product-experience-lab/`. Source code lives in `src/`. Route screens are in `src/routes/`, layout shells in `src/layouts/`, reusable UI primitives in `src/components/`, and feature domains under `src/features/` such as `scenario`, `device`, `talk`, and `coworkplus`. Scenario fixtures are JSON files in `src/data/scenarios/` and are validated through schema utilities. Shared helpers belong in `src/lib/`, cross-feature types in `src/types/`, and static assets in `public/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite dev server at `http://localhost:5173/product-experience-lab/`.
- `npm run typecheck`: run TypeScript project checks without emitting files.
- `npm run build`: run `tsc -b` and produce the production bundle in `dist/`.
- `npm run preview`: preview the built bundle locally.

Run `npm run typecheck` before handing off changes. Run `npm run build` when touching routing, config, scenario loading, or deployment-sensitive behavior.

## Coding Style & Naming Conventions

Use strict TypeScript, React function components, and the `@/` path alias for imports from `src`. Components and routes use PascalCase filenames, for example `ScenarioCard.tsx` and `ScenarioExperienceRoute.tsx`. Zustand stores are named `store.ts` inside their feature folder. Keep feature-specific code within its feature directory unless it is clearly reusable.

Follow the existing formatting style: two-space indentation, single quotes, semicolons, named exports for components, and Tailwind utility classes for styling. Prefer concise comments only where behavior is non-obvious.

## Testing Guidelines

No automated test runner is currently configured. Treat `npm run typecheck` and `npm run build` as the required verification baseline. When adding tests in the future, colocate them near the module under test or use a clear `*.test.ts(x)` naming pattern, and add the corresponding `npm test` script.

## Commit & Pull Request Guidelines

The current git history uses short imperative commit subjects, for example `Add .gitignore to exclude .idea directory`. Keep commits focused and describe the change in present tense.

Pull requests should include a concise summary, verification commands run, linked issues when applicable, and screenshots or screen recordings for UI changes. Note scenario JSON changes explicitly so reviewers can validate simulator behavior.

## Security & Configuration Tips

Do not commit local IDE files, secrets, or machine-specific paths. Preserve `vite.config.ts` settings for `base`, `HashRouter` compatibility, and the dev server polling behavior unless the deployment target changes.
