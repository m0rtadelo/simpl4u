# Simpl4u — Agent instructions

## Project status

WIP / POC. No tests, no CI, no TypeScript.

## Entrypoints

- `index.js` — public entrypoint (imports `components/index.js`)
- `components/index.js` — side-effect-imports every component (self-registering custom elements)

## Commands

| Command | Action |
|---|---|
| `npm run lint` | ESLint check (flat config, `eslint.config.mjs`) |
| `npm run lint:fix` | Auto-fix |
| `npm test` | Stub — errors out |

## Code style

- 2-space indent, LF line endings, UTF-8 (`.editorconfig`)
- Single quotes, semicolons required (ESLint enforces)
- `no-console` allowed (explicitly off in ESLint)
- JSDoc comments on all classes/methods

## Architecture

- **Pure ES modules** — no build step, loaded directly in browser / Electron renderer
- **Web Components** — all custom elements register themselves via `customElements.define`
- **Class hierarchy**: `HTMLElement` → `Element` (core/element.js) → `StaticElement` / `ReactiveElement` / `FormElement`
- **State**: `SimplModel` singleton, context-namespaced keys, Proxy-based reactivity, 20ms debounced notifications
- **Event binding**: `(click)="methodName"` attribute syntax in component templates
- **Vendored deps** in `lib/`: Bootstrap 5 (CSS + JS bundle), Notyf (toast notifications), to-excel (XLS export)
- **Adapters** in `adapters/`: `StorageAdapter` (pluggable backend for `StorageService`)

## Services (in `services/`)

| Service | Role |
|---|---|
| `RouterService` | Hash-based SPA routing |
| `LanguageService` | i18n, 5 locales in `assets/i18n/` |
| `ThemeService` | Light/dark, `data-bs-theme`, system preference detection |
| `ModalService` | Bootstrap modal dialogs (message/confirm/prompt) |
| `ToastService` | Notyf notifications (success/error/warning/info) |
| `SpinnerService` | Full-page loading overlay |
| `StorageService` | 3-tier persistence (localStorage / sessionStorage / Electron IPC) |
| `FileService` | Download in browser, full filesystem in Electron (IPC) |
| `TextService` | `unaccent()`, `sanitize()`, `localDate()` |

## Storage tiers (`StorageService` + `StorageAdapter` — `adapters/storage-adapter.js`)

| Tier | Backend | Scope |
|---|---|---|
| App | `localStorage` | Cross-session |
| User | `sessionStorage` | Per tab |
| System | `window.api.*` (Electron IPC) | File-system |

## Conventions

- Component files: `simpl-{name}.js` under `components/`
- All classes are un-exported within component files; the component file exports nothing (it registers the custom element as a side effect)
- Core classes (`Element`, `StaticElement`, `ReactiveElement`, `FormElement`) are exported from `core/`
- No external runtime dependencies — only ESLint dev dependency

## Notes

- `rollup` appears in `package-lock.json` but has no config or script — likely vestigial, do not rely on it
- No test framework is set up (roadmap item: "Unit tests")
- Vendored deps in `lib/` are committed to the repo (not in `.gitignore`)
- License file says MIT; `package.json` says ISC — discrepancy exists, LICENSE file is authoritative
