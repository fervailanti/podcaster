<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project contribution guidelines

## Workflow

- Start each change from the up-to-date configured default branch and work in a focused branch named `<type>/<short-kebab-case-description>` (for example, `feat/episode-filter` or `docs/rendering-strategy`).
- Use Conventional Commits with a focused, imperative message (for example, `feat: add episode filter`).
- Never push directly to the configured default branch. Push the feature branch, create a pull request, and merge only after its checks pass and the change is reviewed.
- Do not commit, push, merge, deploy, or change dependencies without explicit user approval.

## Code and architecture

- Read the relevant code and follow its existing patterns before changing it. Prefer the simplest implementation that keeps responsibilities clear.
- Keep shared UI primitives in `src/components`, screen-specific composition in `src/screens`, and colocate CSS Modules with the component that uses them.
- Reuse the theme tokens and existing reusable components instead of introducing hardcoded visual values or duplicate UI patterns.
- Keep remote data concerns in `src/api`: define query configuration separately, expose it through the colocated hooks, and let server routes prefetch and dehydrate it.
- Keep navigation state in its Context provider; use local state for state that belongs to one screen. Extract a custom hook only when it represents reusable behaviour.
- Preserve TypeScript types at module boundaries and prefer small, composable functions and components over broad abstractions.
- Keep internationalised copy in the locale resources rather than hardcoding user-facing strings.

## Validation

- Add or update focused tests when behaviour changes, especially for pure utilities, data mapping, searching, and formatting.
- Before proposing a change, run the applicable checks: `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm test`, and `npm run build` when Next.js behaviour or configuration changes.
