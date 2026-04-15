# Copilot Instructions for aka-service

## Build, Test, and Lint

```bash
npm run build          # TypeScript compile + Vite build
npm test               # Run all tests (Vitest, watch mode)
npx vitest run         # Run all tests once (no watch)
npx vitest run src/test/routing.test.ts   # Run a single test file
npx vitest run -t "should find correct routing"  # Run a single test by name
npm run lint           # ESLint (zero warnings allowed)
npm run lint:fix       # ESLint with auto-fix
npm run format:check   # Prettier check
npm run type-check     # tsc --noEmit
```

The CI pipeline (`.github/workflows/azure-static-web-apps-ci-cd.yml`) runs lint → type-check → test → build on every push to `main` and on PRs.

## Architecture

This is a **URL shortener/redirect service** deployed as an **Azure Static Web App**. It has two entrypoints:

- **Redirect interface** (`index.html` → `src/redirect.ts`): Zero-UI instant redirect. Parses the current URL, matches it against routing config, and does `window.location.href` redirect. Falls back to `/status.html` when no query params are present.
- **Status interface** (`status.html` → `src/app.ts`): Admin dashboard for monitoring service health, viewing config, and testing redirects interactively. Uses KERN UX web components (`@kern-ux-annex/webc`).

### Core flow

1. `AKAService` (`src/main.ts`) initializes by loading `public/config.json` via `ConfigurationService`
2. `RoutingService` validates the config and performs route matching: path extraction → case-insensitive group match → dependency check (`dependsOnKey`/`dependsOnValue`) → redirect target resolution
3. `findRedirect()` returns a structured `RedirectResult` (`{ found, targetUrl, error }`) — it does **not** throw on no-match

### Key services (all singletons)

| Module | Export | Role |
|--------|--------|------|
| `src/main.ts` | `akaService` | Orchestrator — init, redirect, status |
| `src/services/configuration.ts` | `configurationService` | Loads/caches JSON config via `fetch()` |
| `src/services/routing.ts` | `RoutingService` (class) | Route matching engine |
| `src/utils/logger.ts` | `logger` | Structured console logging with `[AKA-Service]` prefix |
| `src/utils/url.ts` | `URLUtils` | URL parsing/validation helpers |

## Conventions

### TypeScript

- **Strict mode** is fully enabled (`strict`, `noUnusedLocals`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`).
- Use `import type { ... }` for type-only imports.
- Path alias `@/*` maps to `src/*` (configured in tsconfig, Vite, and Vitest).
- Target is ES2022 with bundler module resolution.

### Code patterns

- **Singleton pattern**: Services export a pre-instantiated singleton (e.g., `export const logger = new Logger()`). Do not create new instances.
- **Result objects over exceptions**: `findRedirect()` returns `{ found: boolean, targetUrl?: string, error?: string }`. Only unexpected errors are thrown.
- **Case-insensitive matching**: Routing group names are matched case-insensitively via `.toLowerCase()`.
- **Structured logging**: Use `logger.info/warn/error()` (from `src/utils/logger.ts`) instead of raw `console.log`.

### Formatting

- Prettier: single quotes, semicolons, 100-char print width, `arrowParens: avoid`, LF line endings.
- ESLint: `no-console` is a warning (use the logger), `no-explicit-any` is a warning, `eqeqeq` and `curly` are enforced.

### Testing

- Tests live in `src/test/` and use Vitest with `jsdom` environment and global APIs enabled.
- Tests use inline config fixtures (not file-based) — construct a `RoutingConfiguration` object directly.
- Use `beforeEach` to reset service state between tests.

### Configuration

- Routing rules live in `public/config.json` as static JSON — there is no dynamic API.
- The schema is: `RoutingConfiguration` → `RoutingGroup[]` → `Routing[]`, with optional `dependsOnKey`/`dependsOnValue` at both group and routing level.
- Azure SWA routing is configured in `public/staticwebapp.config.json` (catch-all rewrite to `/index.html`).

### Deployment

- Hosted on Azure Static Web Apps; infrastructure is defined in `infra/main.bicep`.
- Deploy via `azd up` or `npm run deploy`. The `azure.yaml` configures the project as a `staticwebapp`.
- Build output goes to `build/`.
