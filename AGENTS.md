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
| `./s4u component <static\|reactive> <Name>` | Scaffold a new component (Bash CLI) |

### `s4u` CLI

- Bash scaffolder at repo root, intended for **consumer applications** that use the library (not for simpl4u's own components). Generates `components/{name}.js` from a `StaticElement` or `ReactiveElement` base and auto-registers it by appending the import to `components/index.js`.
- Resolves the base-class import path whether run inside `simpl4u/` or a sibling consumer project.
- Converts the given name to kebab-case for the file and custom-element tag (e.g. `MyComponent` → `my-component.js`, tag `<my-component>`). A leading `Simpl` in the name is stripped. **No `simpl-` prefix is added** — that prefix is reserved for simpl4u's built-in components; consumer components use whatever name the author chooses.

## Code style

- 2-space indent, LF line endings, UTF-8 (`.editorconfig`)
- Single quotes, semicolons required (ESLint enforces)
- `no-console` allowed (explicitly off in ESLint)
- JSDoc comments on all classes/methods

## Architecture

- **Pure ES modules** — no build step, loaded directly in browser / Electron renderer
- **Web Components** — all custom elements register themselves via `customElements.define`
- **Class hierarchy**: `HTMLElement` → `Element` (core/element.js) → `StaticElement` / `ReactiveElement` / `FormElement`
- **State**: `SimplModel` singleton, context-namespaced keys, Proxy-based reactivity, 20ms debounced notifications with content-dedup to prevent render loops
- **Rendering**: morphdom-based in-place DOM patching (`childrenOnly: true`) to avoid flicker; toggle via `Element.useMorphdom` (default `true`). `core/element_old.js` is the legacy `innerHTML` implementation kept for reference
- **Event binding**: `(click)="methodName"` attribute syntax in component templates
- **Inter-component messaging**: `MessageService` publish/subscribe bus for decoupled (sibling) components. Inside components use the `Element` helpers `this.on(topic, handler)` (lifecycle-managed subscription, auto-unsubscribed on disconnect) and `this.emit(topic, payload)` rather than calling `MessageService` directly. Subscribe in `connectedCallback`, not `onReady` (which runs on every render)
- **Vendored deps** in `lib/`: Bootstrap 5 (CSS + JS bundle), Bootstrap Icons, morphdom (DOM diffing), Notyf (toast notifications), to-excel (XLS export)
- **Adapters** in `adapters/`: `StorageAdapter` (pluggable backend for `StorageService`)

## Services (in `services/`)

| Service | Role |
|---|---|
| `RouterService` | Hash-based SPA routing |
| `LanguageService` | i18n, 5 locales in `assets/i18n/` |
| `ThemeService` | Light/dark, `data-bs-theme`, system preference detection |
| `ModalService` | Bootstrap modal dialogs (message/confirm/prompt) |
| `ToastService` | Notyf notifications (success/error/warning/info), configurable via `duration`/`dismissible`/`position` |
| `SpinnerService` | Full-page loading overlay |
| `StorageService` | 3-tier persistence (localStorage / sessionStorage / Electron IPC) |
| `FileService` | Download in browser, full filesystem in Electron (IPC) |
| `TextService` | `unaccent()`, `sanitize()`, `localDate()` |
| `ConfigService` | Global persistence flags (`saveApp`, `saveUser`) read by `core/element.js` to gate state save/restore |
| `MessageService` | Publish/subscribe message bus (`subscribe`/`unsubscribe`/`emit`) for decoupled components; prefer the `Element` `on()`/`emit()` helpers over using it directly |

## Storage tiers (`StorageService` + `StorageAdapter` — `adapters/storage-adapter.js`)

| Tier | Backend | Scope |
|---|---|---|
| App | `localStorage` | Cross-session |
| User | `sessionStorage` | Per tab |
| System | `window.api.*` (Electron IPC) | File-system |

## Conventions

- Component files: `simpl-{name}.js` under `components/` — this `simpl-` prefix is reserved for the library's **own built-in** components. Components scaffolded by the `s4u` CLI for consumer apps do NOT use this prefix.
- All classes are un-exported within component files; the component file exports nothing (it registers the custom element as a side effect)
- Core classes (`Element`, `StaticElement`, `ReactiveElement`, `FormElement`) are exported from `core/`
- No external runtime dependencies — only ESLint dev dependency

## Notes

- `rollup` appears in `package-lock.json` but has no config or script — likely vestigial, do not rely on it
- No test framework is set up (roadmap item: "Unit tests")
- Vendored deps in `lib/` are committed to the repo (not in `.gitignore`)
- License is MIT in both `LICENSE` and `package.json`
- `AUDIT.md` holds a code/architecture audit; consult it for known issues before large refactors
