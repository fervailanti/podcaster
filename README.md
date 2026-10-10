<img height="80" alt="Podcaster icon" src="src/app/icon.svg" />

# Podcaster

### **English** · [Español](README.es.md)

Podcaster is a responsive browser for Apple's [**top 100 music podcasts**](https://podcasts.apple.com/us/charts). It lets you filter the list by title or author, explore a podcast's available episodes, and listen to an episode with the browser's native audio player. The interface is available in English and Spanish.

This project was built with Next.js, React, TypeScript, TanStack Query, i18next and CSS Modules.

#### Live demo: 🌐 [podcaster-top.vercel.app](https://podcaster-top.vercel.app)

<br />

https://github.com/user-attachments/assets/5848bdf7-2038-4ef1-b9e0-068d25c0bf43

<br />

## Getting started

Requires Node.js **20.9 or later** and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API key or environment variables are required.

To run a production build locally:

```bash
npm run build
npm start
```

## Available commands

| Command                | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Start the Next.js development server              |
| `npm run build`        | Build the production application                  |
| `npm start`            | Serve the production build                        |
| `npm run typecheck`    | Check TypeScript types without emitting files     |
| `npm run lint`         | Run ESLint, including import and formatting rules |
| `npm test`             | Run the Vitest suite                              |
| `npm run format`       | Format the project with Prettier                  |
| `npm run format:check` | Check formatting without changing files           |

## How the app works

| Route                                      | Screen                                                       |
| ------------------------------------------ | ------------------------------------------------------------ |
| `/`                                        | Top 100 music podcasts, with a local title and author filter |
| `/podcast/[podcastId]`                     | Podcast information and available episodes                   |
| `/podcast/[podcastId]/episode/[episodeId]` | Episode description and audio player                         |

The home page shows Apple's US top 100 music podcasts. The search field filters that downloaded list immediately by title or author, ignoring case and accents; it does not search Apple's full catalog. Selecting a card opens the podcast page, where a sidebar presents its artwork, author and available description alongside the recent episodes returned by Apple. Selecting an episode opens its description, publication date, duration and native audio player when an audio URL is available.

The language selector changes the interface between English and Spanish. The fixed header also contains a small spinner in its **top-right corner**, beside that selector. It indicates that a client-side navigation is waiting for the destination screen's data. Empty results, request failures, unavailable episodes and missing audio have separate messages.

The interface text and page metadata are localized. Podcast titles, authors and descriptions remain in the language supplied by Apple.

### Why there is no episode pagination

The exercise's lookup example uses `limit=20`, which this implementation follows. The current query returns one recent slice of episodes; the app has no request that fetches the rest of a podcast's archive. Paginating those results in memory would imply that older episodes were accessible when they are not. For that reason, the page shows the podcast's **reported total** separately from the **number of episodes returned** and describes them as the latest available episodes. Supporting a complete archive would first require a reliable way to fetch older episodes, followed by real data pagination.

## Architecture

This is a small **layered, component-based Next.js application**. It uses the App Router for entry points, a query/data layer for external information, screen components for page composition and reusable components for presentation. The layers are intentionally shallow: there is no extra service, repository or feature framework where it would only forward calls.

### Project structure

```text
src/
  app/          Next.js routes, root layout and server prefetching
  api/          Apple requests, response types, mappers and query options
    hooks/      Client hooks for remote podcast data
    tanstack/   Query client, persistence provider and hydration boundary
  components/   Reusable UI and layout components, each with its own CSS Module when needed
  screens/      Home, podcast and episode screen composition
  i18n/         Locale configuration, translation JSON and metadata
  navigation/   Navigation links, provider and navigation hooks
    hooks/      Context access and navigation completion hooks
  styles/       Global styles and design tokens
  utils/        Date/duration formatting and accent-insensitive search
```

The route files in `src/app` resolve route parameters, select page metadata and prefetch the appropriate query. Client screens in `src/screens` assemble the UI and own screen-level state, such as the home search. The data layer owns Apple URLs, response types, request helpers and mapping. Shared components accept presentation props instead of Apple response objects: `SummaryCard` receives a title, image and caption; `Sidebar` receives a title, subtitle and body.

The main patterns are visible in the code:

- **Data mapping at the boundary:** `src/api/mappers` converts Apple's response shapes into `PodcastSummary`, `PodcastDetail` and `Episode` before screens consume them. This keeps provider-specific field names out of the UI.
- **Query options as one source of truth:** `src/api/queries.ts` defines keys and typed query functions once; server prefetching and client `useQuery` use those same definitions.
- **Composition over screen-specific UI copies:** `Card`, `Artwork`, `Sidebar` and `SummaryCard` provide reusable presentation building blocks. The screens supply their labels, routes and content.
- **Small, focused state ownership:** the home search stays local to `HomeScreen`; TanStack Query owns remote data; React Context owns only navigation progress. Components do not receive a global app state object.
- **Colocated component styles:** each component and shared layout keeps its CSS Module beside its TSX file, while global rules and tokens live in `src/styles`.

Application code is TypeScript/TSX with explicit response and domain types and typed component props. The goal is readable code that can be extended without introducing abstractions ahead of a real use case. Apple JSON is mapped and checked for required fields; it is not fully validated against a runtime schema.

## SSR, data flow and caching

1. A Next.js server page passes a query from `src/api/queries.ts` to `PrefetchBoundary`. A fresh `QueryClient` is created for that server render, so cache data is not shared between requests.
2. The query uses `fetch` to request Apple's RSS feed or podcast lookup. Mappers convert the response to the app's types and sanitize descriptions before presentation.
3. `PrefetchBoundary` dehydrates the query cache into the server-rendered page. The client screen calls `useQuery` with the **same query key**, so hydration can reuse the prefetched result instead of immediately repeating the request.
4. Later client navigation reuses fresh entries, fetches missing or stale data and persists the browser query cache to `localStorage` when storage is available.

The top list uses Apple's US music podcast feed. Podcast detail uses Apple's lookup endpoint with `media=podcast`, `entity=podcastEpisode` and `limit=20`. Detail also reads the top list through TanStack Query to reuse its summary description when the podcast appears there. On a direct detail visit, both Apple responses may be needed; on later visits, the cached top list can be reused. A podcast outside the top 100 can therefore have no sidebar description.

The cache policy is centralized in `src/api/config.ts`:

- TanStack Query uses a **24-hour `staleTime`**, so fresh data is not refetched just because a component remounts.
- Its **24-hour `gcTime`** controls how long unused entries may stay in memory. The browser persister uses a **24-hour `maxAge`** for stored data.
- Server `fetch` calls ask Next.js to **revalidate after 24 hours**. This is separate from TanStack Query's client cache.
- Retries are disabled, so a failed Apple request reaches the screen's error state without repeated automatic attempts.

The app calls Apple directly; it has no internal API route or public CORS proxy. If browser storage is unavailable, data requests still work without persistence. These settings reduce repeat requests while keeping a predictable refresh interval; they do not guarantee that Apple always returns unchanged content within that interval.

The home artwork loads lazily as cards enter view, while the prominent artwork on a detail page loads eagerly. The audio element preloads metadata so its duration can appear before playback without downloading the whole episode up front.

### Why TanStack Query?

The same podcast can be opened from several routes, and both server rendering and client navigation need the same data. TanStack Query provides stable query keys, request deduplication, cache freshness, loading and error states, persistence and hydration without maintaining a custom cache implementation. `src/api/queries.ts` keeps the two query definitions together and infers the returned types from their query functions.

### State management responsibilities

The application uses complementary mechanisms according to the lifetime and origin of each value:

- **TanStack Query manages remote state:** Apple responses, query keys, cache freshness, request deduplication, persistence, server prefetching and client hydration.
- **React Context manages shared interface state:** `NavigationProvider` exposes whether a client-side navigation is pending. `NavigationLink` begins the pending state, each destination screen completes it when its data is ready, and `Header` uses it to show the spinner beside the language selector.
- **React local state manages screen interaction:** the home search text belongs only to `HomeScreen` and stays there.

The decision follows data ownership rather than a preference for a particular library. Apple data is asynchronous, shared by several routes and subject to a freshness policy. React Context can distribute that data, but its cache lifecycle, request deduplication, persistence, stale-data policy and server hydration would still need application-specific implementation. TanStack Query supplies those capabilities through the same typed query definitions used for server prefetching and client `useQuery`, so the application has one source of truth for each remote resource.

Navigation progress has different characteristics: it is transient interface state, has a small global audience and needs no cache or persistence policy. Context is deliberately limited to that responsibility. The result avoids duplicating server-state logic in a provider while keeping the navigation signal available to `NavigationLink`, destination screens and `Header`.

Using both mechanisms demonstrates practical use of React's built-in Context API and TanStack Query, a widely used server-state library. Each tool handles the concerns it is designed for, keeping the code explicit, focused and easier to extend.

### Custom hooks

The project has four small hooks, each located with the module that owns the state or integration it abstracts:

| Hook                    | Location               | Responsibility                                                                                          |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `useTopPodcasts`        | `src/api/hooks`        | Connects the home screen to the typed top-podcasts query.                                               |
| `usePodcastDetail`      | `src/api/hooks`        | Connects podcast and episode screens to the shared typed detail query.                                  |
| `useNavigation`         | `src/navigation/hooks` | Provides safe access to the navigation context, its `pending` state and `begin` and `complete` actions. |
| `useNavigationComplete` | `src/navigation/hooks` | Completes pending navigation when a destination screen's data has finished loading.                     |

The API hooks keep screens independent from TanStack Query configuration while `queries.ts` remains the single definition reused by server prefetching. The navigation hooks keep context consumption and the navigation lifecycle out of presentational components.

There is no project-wide `src/hooks` directory. Each hook stays inside its owning module so its dependencies and responsibility are visible from its location: API hooks depend on API queries, and navigation hooks depend on navigation context. Local `index.ts` files provide concise imports and leave room to split a hook into further files when a real need appears.

## Rendering and styling decisions

### Next.js App Router

The App Router provides the requested routes and a server-rendered entry point. Each page prefetches its data before rendering the client screen, then hydrates TanStack Query in the browser. The root layout resolves the locale for the initial HTML; each page generates localized metadata for its route without an additional Apple request. The screens remain client components because they use `useQuery`, i18next and local interaction state, while server pages handle route parameters and prefetching.

### CSS Modules

CSS Modules keep component styles next to their markup and scope class names locally. This makes shared UI components easier to move or reuse without accidental selector collisions. The approach also keeps layout rules close to the component that uses them, instead of growing one global stylesheet.

The small design system has two parts:

- `src/styles/globals.css` is the runtime source of truth for CSS variables: the color palette, spacing scale, text sizes and line heights, radii, shadows and focus treatment. It also contains the reset and page-wide primitives.
- `src/styles/theme.ts` exposes the matching variable names through a typed object for TypeScript use. It references CSS variables instead of duplicating their raw values; component CSS Modules currently consume the variables directly.

Reusable components such as `Card`, `Eyebrow`, `SectionHeading`, `SearchBar` and `EmptyState` apply those tokens consistently. Screens compose those pieces and add only their own layout rules. This keeps typography, spacing and interaction states visually coherent while making a palette or scale adjustment central and predictable. The shared two-column detail composition lives in `src/components/DetailLayout`.

### Internationalization

English is the default language. Translation strings live in `src/i18n/translations/en.json` and `es.json`, with supported locales and the cookie name centralized in `src/i18n/config.ts`. The language selector updates i18next, the document language and a cookie. The server reads that cookie for the initial HTML language and route metadata. Dates use the active interface language; durations use a consistent `mm:ss` or `h:mm:ss` format.

### External content

Episode descriptions are prepared to display HTML, including paragraphs, emphasis and links. Apple's descriptions pass through `sanitize-html` in the mappers before the UI renders them; unsafe markup and links are removed. During inspection for this exercise, nearly all sampled episode descriptions arrived as plain text, so the HTML support is rarely visible in normal browsing. A test fixture containing a valid link, formatting and unsafe markup verifies the path even when live data does not exercise it.

Episode audio URLs are accepted only when they use HTTPS. Playback uses native `<audio controls>` for keyboard support and familiar browser controls. Search and language controls have accessible labels, and interactive elements use visible focus styles.

## Tests and quality checks

The Vitest suite focuses on the boundaries and behavior most likely to break:

| Area              | Cases covered                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| Apple mappers     | Feed-to-domain mapping; reported episode total; safe HTML and link preservation; removal of unsafe markup |
| Queries and cache | Reuse of the top list while loading a detail; separate server query clients and a stable browser client   |
| Request utilities | JSON responses, HTTP errors, server revalidation option and podcast ID validation                         |
| Formatting        | Durations with and without hours, rounding, invalid values and localized dates                            |
| Search            | Matching across fields while ignoring accents, case and surrounding spaces; empty and missing matches     |

These are focused unit and query tests. They do not claim end-to-end browser coverage. Run the local checks with:

```bash
npm run lint
npm run typecheck
npm test
npm run format:check
```

The formatting and lint rules were chosen to keep reviews focused on behavior:

- Prettier uses a 100-character print width, two-space indentation, single quotes in code, double quotes in JSX, semicolons and no trailing commas.
- ESLint includes Next.js and TypeScript rules, then `eslint-config-prettier` prevents conflicts with Prettier. Additional rules catch unused or duplicate imports, sort imports and exports, prefer arrow functions and reject stray whitespace.
- VS Code workspace settings enable format-on-save and ESLint fixes on save. The **Prettier - Code formatter** extension is required for that editor integration; the CLI commands use only local project dependencies.

## Deployment

The project is deployed from `main` to [podcaster-top.vercel.app](https://podcaster-top.vercel.app) through Vercel's GitHub integration. Vercel detects Next.js and uses its default production build settings. No application secrets are needed. Apple must be reachable from the deployment environment, and audio playback depends on the URLs supplied by Apple.

### CI/CD and deployment checks

Every change is validated before it can be published to the production aliases:

1. A push to `main` or a pull request starts the **Validate** GitHub Actions workflow. It runs `npm ci`, ESLint, TypeScript, Prettier, Vitest and a production build.
2. A push to `main` also creates a Vercel production deployment from the connected repository.
3. Once Vercel finishes building that deployment, it emits `vercel.deployment.ready`. The **Deployment check** workflow receives the event, checks out the exact deployed SHA and repeats the same validation suite.
4. Its `vercel/repository-dispatch/actions/status@v1` step reports the resulting status as **`Vercel - podcaster: validate`**. Vercel requires that GitHub status before assigning the production aliases.

The two workflows deliberately serve different points in the release process. **Validate** gives immediate feedback for a push or pull request. **Deployment check** validates the precise revision Vercel built and controls whether that deployment is promoted to production. This is configured in Vercel as a GitHub Deployment Check that blocks `deployment-alias` for production until it succeeds.
