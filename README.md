# Podcaster

A bilingual music podcast browser built for the Inditex front-end exercise. It shows Apple's top 100 music podcasts, a podcast's episodes, and an episode with a native audio player.

## Run it

Requires Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Development assets are served without production minification.

```bash
npm run build
npm start
```

The production build optimizes and minifies assets. Next.js splits bundles by route instead of emitting one concatenated file. The repository has no secrets or environment variables; it can be imported into Vercel as a Next.js project.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run format:check
```

The tests cover the 24-hour client cache, independent detail entries, Apple's data mapping, safe episode HTML, and accent-insensitive filtering.

## Architecture

| Location         | Responsibility                                                                |
| ---------------- | ----------------------------------------------------------------------------- |
| `src/app`        | Exact exercise routes, root layout, and same-origin API endpoints             |
| `src/screens`    | Composition and page-level state for the three views                          |
| `src/components` | Reusable visual and navigation components                                     |
| `src/podcasts`   | Domain types, Apple response mapping, server requests, client cache and hooks |
| `src/i18n`       | Spanish and English interface strings and i18next provider                    |

The app uses TypeScript, Next.js App Router, React, i18next, CSS Modules, and custom CSS. Route files stay small, and podcast data is kept separate from presentation. Shared UI state is handled through React Context; screen data stays close to each screen.

The browser calls `/api/podcasts` and `/api/podcasts/:id`. Next Route Handlers call Apple, avoiding the need for a public CORS proxy. The server caches upstream responses for a day. A separate client `localStorage` cache timestamps the list and each podcast detail; an entry is requested again after 24 hours. If browser storage is disabled, data loading still works. The lookup requests up to 200 recent episodes, the maximum documented by Apple's Search API. The podcast's reported `trackCount` is shown separately when there are more episodes than the API returns.

Episode descriptions are sanitized on the server before rendering their supported HTML. Audio uses the browser's native player. No user-facing error workflow was requested; failed requests are logged to the console and show a simple fallback message.

## Language and routes

The selector switches the interface between Spanish and English, persists the choice in a cookie, and updates the document language. Titles and descriptions from Apple remain in the language supplied by Apple. Routes retain the exercise's exact shape: `/`, `/podcast/:podcastId`, and `/podcast/:podcastId/episode/:episodeId`.

## Exercise notes

- The main list displays Apple's US top 100 music podcasts and filters immediately by title or author.
- Navigation uses Next links without `#` URLs or full page refreshes.
- The top-right indicator appears while a client transition is waiting for the next screen's data.
- The layout follows the supplied grid/sidebar/table composition, with responsive adjustments and components styled from scratch.
- The Apple lookup response does not contain the podcast summary shown in the top-100 feed. For podcasts reached from that list, the API combines both responses. A direct link to a podcast outside that list may have no sidebar description.
