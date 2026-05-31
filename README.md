# Simpl4u

**Simpl4u** is a modular framework for building [Electron](https://www.electronjs.org) and web applications using native **Web Components**, [Bootstrap 5](https://getbootstrap.com), and a reactive state management system. It provides a library of reusable components, services, and base classes to streamline the creation of dynamic, interactive user interfaces — with no build step required.

> **WIP** — Work in Progress  
> **POC** — Proof of Concept

---

## Features

- **Custom Web Components** — 17+ reusable components: tables, forms, buttons, inputs, navbars, modals, color/date pickers, file uploads, progress bars, toggles, combo-boxes, todo/kanban boards, and more.
- **Reactive State Management** — Proxy-based global state store (`SimplModel`) with context namespacing, deep reactivity, and subscriber notification.
- **Localization** — Built-in multi-language support with 5 locales (English, Catalan, Spanish, German, Japanese) and string interpolation.
- **Theme Management** — Dynamic light/dark theme switching with system preference detection.
- **CRUD Operations** — Full create, read, update, delete flows via `SimplCrud` and `SimplTable`.
- **Hash-based Routing** — Lightweight single-page application routing via `RouterService`.
- **Modal Dialogs** — Bootstrap-powered message, confirm, and prompt dialogs via `ModalService`.
- **Toast Notifications** — Success, error, warning, and info notifications via `ToastService` (powered by Notyf).
- **Storage Abstraction** — Three-tier persistence (localStorage, sessionStorage, Electron IPC) via `StorageService`/`StorageAdapter`.
- **File Operations** — Download files in the browser, plus full file system access in Electron (read, write, copy, delete, directory selection).
- **Bootstrap 5** — All components render Bootstrap-compatible markup.
- **No Build Step** — Pure ES modules loaded directly in modern browsers or Electron renderers.

---

## Architecture

```
HTMLElement
  └── Element                    # Base class: rendering, events, validation, view state
        ├── StaticElement        # State-aware, manual re-render
        │     └── FormElement    # Form input base (required, disabled, reactive, etc.)
        │           ├── simpl-button
        │           ├── simpl-checkboxes
        │           ├── simpl-color
        │           ├── simpl-combobox
        │           ├── simpl-combobox-list
        │           ├── simpl-date
        │           ├── simpl-file
        │           ├── simpl-input
        │           ├── simpl-progress
        │           ├── simpl-select
        │           ├── simpl-switch
        │           └── simpl-textarea
        │
        └── ReactiveElement      # Auto re-renders on state changes
              ├── simpl-navbar
              ├── simpl-table
              └── simpl-todo

StaticElement (direct)
  ├── simpl-crud
  └── simpl-spinner
```

### Core (`/core`)

| Class | Description |
|---|---|
| `Element` | Root base extending `HTMLElement`. Provides templating (`template()`, `render()`), attribute-based event binding (`(click)="method"`), model integration, Bootstrap form validation, view state persistence, and CSS scoping. |
| `StaticElement` | Extends `Element`. Subscribes to `SimplModel` changes and calls `onUpdateState(property)` — does not auto-re-render. |
| `FormElement` | Extends `StaticElement`. Base for form input components with `required`, `disabled`, `hidden`, `reactive`, `type`, `placeholder` attributes. |
| `ReactiveElement` | Extends `Element`. Subscribes to `SimplModel` and automatically re-renders the template on state changes. Uses HTML diffing to avoid unnecessary DOM replacement. |

---

## Getting Started

### Install

```sh
npm install
```

The project has no runtime dependencies — only ESLint for development.

### Lint

```sh
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix lint issues
```

### Usage

Import the library in your HTML or JavaScript entry point:

```html
<script type="module" src="node_modules/simpl4u/index.js"></script>
```

All components are automatically registered as custom elements.

---

## Components

### `simpl-table`
A dynamic, sortable, filterable data table with CRUD actions and XLS export.

```html
<simpl-table name="users" actions="crude" context="myapp"></simpl-table>
```

| Attribute | Type | Description |
|---|---|---|
| `name` | string | Model key for the table data |
| `context` | string | State context namespace |
| `actions` | string | Action flags: `c`(create), `r`(read/detail), `u`(update), `d`(delete), `e`(export) |

Events are emitted via `subscribe()`:
- `create`, `update`, `delete`, `detail`, `export`

### `simpl-crud`
Full CRUD component wrapping `simpl-table` with modal forms for data entry.

```html
<simpl-crud name="products" actions="crude"></simpl-crud>
```

| Method | Description |
|---|---|
| `setHeaders([...])` | Define column headers |
| `setForm([...])` | Define form fields with type, validation, and options |

Form field definition supports: `name`, `required`, `disabled`, `class`, `unique`, `index`, `type`, `items` (for selects).

### `simpl-input`
Text input with label, validation, and reactive binding.

```html
<simpl-input name="email" type="email" required placeholder="Enter email"></simpl-input>
```

### `simpl-textarea`
Multi-line text input.

```html
<simpl-textarea name="description" rows="5" required></simpl-textarea>
```

### `simpl-select`
Dropdown select.

```html
<simpl-select name="country" items='[{"id":"es","text":"Spain"},{"id":"de","text":"Germany"}]'></simpl-select>
```

### `simpl-switch`
Bootstrap toggle switch (boolean).

```html
<simpl-switch name="active"></simpl-switch>
```

### `simpl-checkboxes`
Button-group checkboxes for multi-select.

```html
<simpl-checkboxes name="roles" values="admin,user,guest"></simpl-checkboxes>
```

### `simpl-combobox`
Combobox with autocomplete filtering.

```html
<simpl-combobox name="city" items='[{"id":"1","text":"Barcelona"},{"id":"2","text":"Madrid"}]'></simpl-combobox>
```

### `simpl-date`
HTML5 date picker.

```html
<simpl-date name="birthdate" required></simpl-date>
```

### `simpl-color`
HTML5 color picker.

```html
<simpl-color name="bgColor"></simpl-color>
```

### `simpl-file`
File input with optional multiple selection.

```html
<simpl-file name="documents" multiple></simpl-file>
```

### `simpl-button`
Bootstrap-styled button.

```html
<simpl-button type="primary" title="Save"></simpl-button>
```

### `simpl-progress`
Bootstrap progress bar.

```html
<simpl-progress name="uploadProgress"></simpl-progress>
```

### `simpl-spinner`
Full-page loading overlay. Controlled via `SpinnerService`.

```html
<simpl-spinner></simpl-spinner>
```

### `simpl-navbar`
Responsive navigation bar with language and theme toggles.

```html
<simpl-navbar items='[{"id":"home","name":"Home"},{"id":"settings","name":"Settings"}]'></simpl-navbar>
```

| Attribute | Type | Description |
|---|---|---|
| `items` | array | Navigation items `{ id, name, emmit }` |
| `hideLang` | boolean | Hide language dropdown |
| `hideTheme` | boolean | Hide theme switcher |

### `simpl-todo`
Kanban/Trello-style board with drag-and-drop cards.

```html
<simpl-todo></simpl-todo>
```

### `simpl-combobox-list`
Filterable list (internal component used by `simpl-combobox`).

---

## Services

| Service | Description |
|---|---|
| `RouterService` | Hash-based SPA routing. `view` property, `setView(hash)`, `subscribe(callback)`. |
| `LanguageService` | i18n with 5 built-in locales. `lang` getter/setter, `i18n(key, params)` for translation with `{{param}}` interpolation, `set(languages)` to merge custom translations. |
| `ThemeService` | Light/dark theme management. `theme` getter/setter, `switchTheme()`, persists choice, detects system preference. |
| `ModalService` | Bootstrap modal dialogs. `message(text, title)`, `confirm(text, title)` → Promise\<boolean\>, `prompt(text, title, value)` → Promise\<string\>, `open(body, title, hideCancel)`. |
| `ToastService` | Notyf-powered notifications. `success(msg)`, `error(msg)`, `warning(msg)`, `info(msg)`. |
| `SpinnerService` | Spinner overlay control. `show()`, `hide()` with debounce to prevent flickering. |
| `StorageService` | High-level storage API wrapping `StorageAdapter`. `saveApp(key)`, `loadApp(key)`, `saveUser(key)`, `loadUser(key)`, `saveSystem(key)`, `loadSystem(key)`, `saveAppModel()`, `loadAppModel()`. |
| `FileService` | Browser/Electron file operations. `download(filename, data)` for browser; in Electron: `readFile`, `writeFileSync`, `mkdir`, `selectDirectory`, `ls`, `cp`, `rm`, `rmdir` via IPC. |
| `TextService` | String utilities. `unaccent(value)` (remove diacritics), `sanitize(value)` (escape HTML), `localDate(dateString)` (format ISO date). |

---

## State Management

`SimplModel` is a singleton reactive state container. Data is organized by **context** (namespaced keys).

```js
import { SimplModel } from './models/simpl-model.js';

// Set a value
SimplModel.set('John Doe', 'name', 'userform');

// Get a value
const name = SimplModel.get('name', 'userform');

// Subscribe to changes
const unsubscribe = SimplModel.subscribe((model, property) => {
  console.log(`State changed: ${property}`);
});
```

State changes are batched via a 20ms debounce to optimize performance.

---

## Localization

Built-in locales (located in `assets/i18n/`):

| Locale | Language |
|---|---|
| `en` | English |
| `ca` | Catalan |
| `es` | Spanish |
| `de` | German |
| `ja` | Japanese |

```js
import { LanguageService } from './services/language-service.js';

// Get a translated string
LanguageService.i18n('confirm'); // "Are you sure?"

// With parameters
LanguageService.i18n('error-unique', { field: 'Email' });

// Change language
LanguageService.lang = 'ca';

// Add custom translations
LanguageService.set({ myKey: 'My Translation' });
```

---

## Themes

`ThemeService` manages light/dark themes using Bootstrap 5's `data-bs-theme` attribute:

```js
import { ThemeService } from './services/theme-service.js';

ThemeService.theme = 'dark';   // Switch to dark mode
ThemeService.switchTheme();    // Toggle
```

The service automatically respects the user's `prefers-color-scheme` system setting on first load if no preference has been saved.

---

## Storage

Three-tier persistence via `StorageService`:

| Tier | Backend | Scope |
|---|---|---|
| **App** | `localStorage` | Persistent across sessions |
| **User** | `sessionStorage` | Per browser tab |
| **System** | Electron IPC (`window.api.*`) | File-system persistence in Electron |

---

## Event Binding

Components use an attribute-based event binding syntax in their templates:

```html
<button (click)="handleSave">Save</button>
```

This automatically calls `this.handleSave(event)` on the component instance.

---

## Roadmap

- [ ] Unit tests
- [ ] Build/bundler integration examples
- [ ] TypeScript definitions
- [ ] More built-in components (charts, trees, etc.)
- [ ] Accessibility improvements
- [ ] Documentation site

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see the [LICENSE](LICENSE) file for details.
