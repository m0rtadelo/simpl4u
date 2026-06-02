# Simpl4u — Codebase Audit

> Generated: 2026-06-02  
> Scope: Full codebase review (core, models, services, components, config, i18n)

---

## Severity Legend

| Icon | Severity | Meaning |
|------|----------|---------|
| 🔴 | **Critical** | Breaks core functionality, causes data loss, or is a security vulnerability |
| 🟠 | **High** | Significant bug, partial feature breakage, or notable security concern |
| 🟡 | **Medium** | Minor bug, performance issue, or maintainability concern |
| 🟢 | **Low** | Code smell, convention violation, or cosmetic issue |

---

## 🔴 Critical

### 1. Language/route refresh only hits the first element ever created

**File:** `core/element.js:22-28`

```js
if (!Element.loaded) {
  Element.loaded = true;
  RouterService.subscribe(() => {
    this.refresh();   // 'this' is the FIRST element
  });
  LanguageService.subscribe(() => {
    this.refresh();   // 'this' is the FIRST element
  });
}
```

The `Element.loaded` static guard ensures this block runs exactly once — when the very first `Element` subclass instance is constructed. The arrow functions capture that single instance via `this`. When `RouterService` or `LanguageService` fires a notification, only that one element's `refresh()` is called. **All other components in the application never react to route or language changes.**

Additionally, the unsubscribe functions returned by both `RouterService.subscribe()` and `LanguageService.subscribe()` are never stored or called — the first element instance is permanently leaked.

---

### 2. `addListenersFromTemplate` — bound/unbound mismatch prevents listener removal

**File:** `core/element.js:75-76`

```js
el.removeEventListener(eventName, this[methodName]);           // removes UNBOUND method
el.addEventListener(eventName, this[methodName].bind(this));   // adds BOUND method
```

`this[methodName]` is the unbound prototype method. `.bind(this)` produces a **new** function reference every call. The `removeEventListener` targets the unbound function, but the previously added listener was a bound function (from the prior render). **The removal never matches**, so on every `refresh()` cycle, duplicate bound listeners accumulate. This is both a memory leak and causes event handlers to fire multiple times.

---

### 3. `setEventListener` — shared `this.buttonBound` overwrites previous references

**File:** `core/element.js:92-99`

```js
setEventListener(id, event, callback) {
  const element = this.querySelector('#' + id);
  if (element) {
    element.removeEventListener(event, this.buttonBound);
    this.buttonBound = callback.bind(this);
    element.addEventListener(event, this.buttonBound);
  }
}
```

A single instance property `this.buttonBound` tracks the last registered bound function. If this method is called for element A, then element B, the bound function for A is overwritten and **A's listener can never be removed** — it continues firing forever. On subsequent `onReady()` → `setEventListener()` cycles, listeners pile up on all elements except the last one registered.

---

### 4. Bootstrap validation IIFE registers duplicate global listeners on every render

**File:** `core/element.js:124-141`

```js
render() {
  this.innerHTML = ...;
  (() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => { ... }, false);
    });
  })();
}
```

This IIFE runs inside `render()`, which is called on every component during every `refresh()`. Each call registers **anonymous** `submit` listeners on **every `.needs-validation` form in the entire document**. Since the callbacks are anonymous arrow functions, they can never be removed. After N renders across any components, each form has N identical submit listeners — a significant memory and performance leak.

---

### 5. `prependTagNameToCSS()` breaks CSS at-rules

**File:** `core/element.js:156`

```js
cssString.replace(/([^{}]+)\s*\{/g, (match, selectors) => { ... });
```

The regex captures everything before `{` that doesn't contain `{` or `}`. This incorrectly matches at-rule declarations such as:

- `@media (max-width: 600px) {` → `SIMPL-TABLE @media (max-width: 600px) {` — **invalid CSS**
- `@keyframes mymove {` → `SIMPL-TABLE @keyframes mymove {` — **breaks keyframe declarations**
- `@font-face {` → `SIMPL-TABLE @font-face {` — **invalid CSS**
- `@supports`, `@page`, `@layer`, `@container` — all broken similarly

Any component that uses `@media`, `@keyframes`, `@font-face`, etc. in its `style` property will have broken CSS.

---

### 6. Array mutations (push, splice, pop, etc.) silently skip notifications

**File:** `models/simpl-model.js:112-117` (Proxy `get` trap)

When the `get` trap returns a raw function like `push` or `splice` (since `typeof` a function is `'function'`, not `'object'`, the Proxy-wrapping branch is skipped), these methods execute on the raw target array, bypassing the Proxy `set` trap entirely. No `#notify` is ever called.

**Affected call sites:**
- `components/simpl-crud.js:129` — `this.model[this.#dataKey].push(...)`
- `components/simpl-todo.js:288` — `model[key].push(...)`
- `components/simpl-todo.js:245` — `model[dest].push(item)`

---

### 7. Circular references crash `JSON.stringify`, breaking all notifications

**File:** `models/simpl-model.js:71-74`

`#notify` calls `JSON.stringify(SimplModel.#model)`. If any part of the model graph contains a circular reference, `JSON.stringify` throws a `TypeError: Converting circular structure to JSON`. This crashes the notification loop entirely, leaving the model in a broken reactive state where subsequent changes also fail to notify.

---

### 8. Form submission causes page reload on validation failure

**File:** `services/modal-service.js:164`

```js
if(!form.checkValidity()) return;  // returns BEFORE preventDefault
event.preventDefault();            // never reached on failure
```

If the form is invalid (e.g., a required field is empty), the function returns early, `event.preventDefault()` is never called, and the browser submits the form to the current URL — **reloading the page**.

---

### 9. XSS vector in `ModalService.open()`

**File:** `services/modal-service.js:133,157`

The `body` parameter is directly interpolated into HTML passed to `document.body.insertAdjacentHTML('beforeend', ...)`:

```js
<div class="mb-3">${body}
```

No escaping is applied. If `body` contains `<script>` or event handlers, they execute.

---

### 10. `LanguageService.i18n()` only replaces first occurrence of each placeholder

**File:** `services/language-service.js:98`

```js
base.replace(`{{${param}}}`, params[param])
```

`String.prototype.replace` replaces only the **first** occurrence. If the same placeholder appears twice (e.g., `"Hello {{name}}, your code is {{name}}"`), the second occurrence is left unsubstituted. Should use `replaceAll` or a global regex.

---

### 11. `StorageService` promises never reject — adapter failures cause silent hangs

**File:** `services/storage-service.js:50-101`

Every method wraps the adapter call in `new Promise(resolve => ...)`, but **none** have a `.catch()` handler on the inner promise chain, and **none** use `reject`. If `StorageAdapter` throws or rejects, the outer promise **hangs forever**. Callers like `ThemeService.load()` and `LanguageService.load()` block indefinitely with no error feedback.

---

### 12. `SimplCrud` — `subscription` field shadowing causes memory leak

**File:** `components/simpl-crud.js:28,63,67`

`SimplCrud` declares `subscription;` as a class field. Due to JavaScript class field initialization order:
1. `super()` calls `StaticElement` constructor, which sets `this.subscription` to the `SimplModel` unsubscribe function.
2. After `super()` returns, `SimplCrud`'s field `subscription;` runs, resetting `this.subscription = undefined`.
3. In `onReady()`, `this.subscription` is replaced with the table's unsubscribe function.

Result: The `SimplModel` subscription is **never cleaned up** — the subscriber callback persists in `SimplModel.#subscribers` forever.

---

### 13. `simpl-crud` — default `actions='crude'` shows unexpected export button

**File:** `components/simpl-crud.js:24`

```js
actions = this.getAttribute('actions') || 'crude';
```

Typo: `'crude'` is likely meant to be `'crud'`. The extra `e` enables the **export** action by default (since `simpl-table` checks `actions.includes('e')`). Every CRUD component will show an unexpected export button unless explicitly overridden.

---

### 14. `simpl-navbar` — broken HTML in `renderLanguages()` (triple quotes)

**File:** `components/simpl-navbar.js:124-128`

```js
return `<li>
    <a id="${lang.id}" (click)="changeLang" class="dropdown-item ${
      LanguageService.lang === lang.id ? 'active" aria-current="page"' : '"'
    }"" href="#">${LanguageService.i18n(lang.name)}</a>
</li>`;
```

**When active**, the ternary produces: `active" aria-current="page"`. Then `""` is appended as literal text. The resulting HTML has **three double quotes** (`"""`) after `page`, breaking Bootstrap active styling.

---

## 🟠 High

### 1. Re-connected reactive elements never re-subscribe

**File:** `core/reactive-element.js:10-12,16-18`, `core/static-element.js:9-11,20`

`SimplModel.subscribe()` is called in the constructor, and `this.subscription()` (unsubscribe) is called in `disconnectedCallback`. But there is **no re-subscription in `connectedCallback`**. If a reactive element is moved in the DOM (disconnected then re-connected), it loses its model subscription permanently.

### 2. Fire-and-forget promises in `saveViewState()`

**Files:** `core/element.js:213-215`, `core/static-element.js:19`

`StorageService.saveUser()` returns a Promise but is called without `await` or `.catch()` in `disconnectedCallback`. During page teardown, this fire-and-forget Promise may be cancelled before completion, potentially losing state.

### 3. `SimplModel.get()` mutates model as a side-effect

**File:** `models/simpl-model.js:38-39`

```js
if (id && !SimplModel.model[context][id]) {
    SimplModel.model[context][id] = '';
}
```

Calling `SimplModel.get('key')` silently creates `model.global.key = ''` if the key doesn't exist. A read-only access has a write side-effect that inflates the model with empty-string entries and triggers reactive notifications.

### 4. System preference change overwrites user's explicit theme choice

**File:** `services/theme-service.js:20-23`

When the OS system preference changes (e.g., sunset triggers dark mode), the listener calls `ThemeService.theme = systemTheme`, which **persists** the value to storage via `StorageService.saveApp`. This overwrites any explicit user choice.

### 5. Path traversal vulnerability in Electron file operations

**File:** `services/file-service.js:54-131`

All Electron IPC methods (`writeFileSync`, `mkdir`, `ls`, `cp`, `rm`, `rmdir`, `readFile`) accept user-controlled `path`/`source`/`destination` parameters with **zero validation**. If attacker-controlled values reach these methods (e.g., `../../etc/passwd`), files outside the intended directory can be read or written.

### 6. Hardcoded MIME type in `FileService.download()`

**File:** `services/file-service.js:28`

```js
new Blob([data], { type: 'text/csv' })
```

Always uses `text/csv` regardless of file extension or data content. If called with JSON, PDF, or image data, the browser may misinterpret the file.

### 7. `TextService.unaccent()` crashes on null/undefined/non-string

**File:** `services/text-service.js:10`

```js
unaccent(value) {
    return value.normalize('NFD')...
}
```

With `null`, `undefined`, or a non-string (number, object), this throws `TypeError: value.normalize is not a function`.

### 8. `simpl-date` — missing `id` on `<input>`, label association broken

**File:** `components/simpl-date.js:10`

The `<label>` has `for="${this.name || this.id}"` but the `<input>` only has `name="${this.name || this.id}"`. Without a matching `id`, clicking the label does not focus the date input, and accessibility is broken.

### 9. `simpl-textarea` — missing `id` on `<textarea>`, label association broken

**File:** `components/simpl-textarea.js:12-13`

Same issue as #8. The `<label>` references `for` but the `<textarea>` has no matching `id`.

### 10. Operator precedence bug in `focus()` methods (3 components)

**Files:** `components/simpl-file.js:23`, `components/simpl-color.js:22`, `components/simpl-textarea.js:23`

```js
document.querySelector('input#' + this.name || this.id).focus()
// Evaluates as:
// ('input#' + this.name) || this.id
// If this.name is null → selector is 'input#null' (truthy) → this.id fallback is DEAD CODE
```

Only `simpl-input.js:22-23` gets this right with proper parentheses and optional chaining.

### 11. ESLint config requires ESLint >=9.25 but package.json allows 9.24+

**File:** `eslint.config.mjs:1`, `package.json`

```js
import { defineConfig } from 'eslint/config'
```

The `defineConfig` helper was introduced in ESLint **v9.25.0**, but `package.json` allows `^9.24.0`. If the lockfile pins to 9.24.0, this import will fail at runtime.

### 12. Missing `"type": "module"` in package.json

**File:** `package.json`

The entire project uses ESM `import`/`export` syntax, but `package.json` does not set `"type": "module"`. While the project targets browser/Electron (using `<script type="module">`), this omission would cause Node.js to treat `.js` files as CommonJS, breaking any server-side scripts or test runners.

---

## 🟡 Medium

### 1. `deleteProperty` bypasses the 20ms debounce

**File:** `models/simpl-model.js:119-124`

`deleteProperty` calls `#notify()` directly without the debounce that `set` uses. Rapid `delete` operations trigger one notification per delete rather than coalescing.

### 2. `JSON.stringify` comparison is a performance bottleneck

**File:** `models/simpl-model.js:72-74`

Serializes the **entire** model on every notification cycle. For large models this causes measurable GC churn. Also produces false equalities (e.g., `model.a = undefined` serializes to `{}`, same as an empty model).

### 3. Subscriber re-entrancy risk

**File:** `models/simpl-model.js:75-77`

`for...of` iterates a live `Set` of subscribers. If a subscriber callback modifies the subscriber list during iteration, behavior is spec-compliant but potentially surprising.

### 4. Non-plain objects (Date, Map, Set) wrapped in Proxy — may break internal slots

**File:** `models/simpl-model.js:114-115`

The `get` trap wraps *any* non-null object in a reactive Proxy. For built-ins that rely on internal slots (`[[DateValue]]`, `[[MapData]]`, etc.), this can break method calls because `this` inside those methods is the proxy, not the target.

### 5. Modal promise never resolves if modal is forcefully removed

**File:** `services/modal-service.js:172,204`

If `#deleteModal` is called (removing the modal element from the DOM) before `hidden.bs.modal` fires, the promise from the previous `#handleModal` call **hangs forever** (unresolved promise).

### 6. Modal `setTimeout` for focus is never cleaned up

**File:** `services/modal-service.js:193-195`

```js
setTimeout(() => input.focus(), 500)
```

If the modal is dismissed before 500ms, the timeout still fires and focuses a removed element. The reference should be stored and cleared on dismiss.

### 7. `FileService.writeFileSync` is actually async

**File:** `services/file-service.js:54`

The `"Sync"` suffix strongly implies a synchronous operation, but it returns a `Promise<boolean>`. Should be named `writeFile`.

### 8. ToastService crashes entire app if Notyf fails to load

**File:** `services/toast-service.js:9-32`

The static block creates `new Notyf(...)` at module evaluation time. If the vendored Notyf library fails to load, this throws `ReferenceError` and prevents the entire app from loading.

### 9. `simpl-todo` — `renderItems()` mutates reactive model during template rendering

**File:** `components/simpl-todo.js:169-174`

Sets `item.id` on each item and reassigns `this.model[type]` during rendering. This triggers the Proxy `set` trap and schedules reactive notifications during the render cycle, risking re-render loops.

### 10. `simpl-todo` — `drag()` uses `event.target` instead of `event.currentTarget`

**File:** `components/simpl-todo.js:114-116`

```js
drag(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}
```

`event.target` is the deepest element clicked (e.g., a nested `<span>`), not the element with the listener. The `id` on that inner element may differ from the intended draggable element. Should use `event.currentTarget.id`.

### 11. `simpl-todo` — multiple null reference crashes when `closest()` returns null

**Files:** `components/simpl-todo.js:87,124,284`

`event.target.closest('.col')` and `event.target.closest('.card')` can return `null` if the target has no matching ancestor. Accessing `.id`, `.getAttribute()`, etc. on `null` throws `TypeError`.

### 12. `simpl-table` — header names used as HTML IDs without sanitization

**File:** `components/simpl-table.js:180`

```js
`<th id="${TextService.htmlEscape(header)}" ...>`
```

`TextService.htmlEscape` only escapes `& < > " '`. It does not produce valid HTML IDs. A header like `"First Name"` produces `id="First Name"` (space is invalid in HTML `id`).

### 13. `simpl-todo` — `resetModel()` is dead code

**File:** `components/simpl-todo.js:195-201`

```js
resetModel(model = this.model) {
    model = { ToDo: [], Doing: [], Done: [] };
}
```

Reassigns the local parameter `model` but never assigns back to `this.model` or returns the new value. The method has zero effect.

### 14. `simpl-input` — only reacts to model changes when disabled

**File:** `components/simpl-input.js:8`

```js
this.reactive = this.disabled;
```

When the input is **enabled** (`disabled` is `false`), `reactive` is `false`, meaning model changes do not re-render. When **disabled**, it does re-render. This seems backwards — likely a workaround to avoid cursor-jump on re-render during typing, but it breaks reactivity for enabled inputs.

### 15. `simpl-switch` — double-toggle bug

**File:** `components/simpl-switch.js:9-22`

Both a `(change)` handler on the checkbox and a `(click)` handler on the label fire for a single label click, causing two model writes and an unnecessary `refresh()`.

### 16. `simpl-combobox` — accessing private field on un-upgraded element throws

**File:** `components/simpl-combobox.js:58-60`

```js
list.subscribe(...)
```

`subscribe` accesses the private field `#subscribers`. If `<simpl-combobox-list>` hasn't been upgraded yet, this throws `TypeError`.

### 17. `StorageAdapter.clear()` does not clear system storage

**File:** `adapters/storage-adapter.js:107-110`

`clear()` only clears `localStorage` and `sessionStorage`. It does not clear the Electron tier (`window.api.*`).

### 18. `.editorconfig` — missing `root = true`

**File:** `.editorconfig:1`

Without it, EditorConfig walks up the directory tree looking for parent `.editorconfig` files, which can cause unexpected inheritance from parent directories.

---

## 🟢 Low (30+ issues)

### Cross-cutting

| Issue | Files |
|-------|-------|
| No `attributeChangedCallback` / `observedAttributes` anywhere — dynamic attribute changes silently ignored | All components |
| All components operate in light DOM (no Shadow DOM) — no style encapsulation | All components |
| `innerHTML` / `insertAdjacentHTML` rendering destroys user-added event listeners on every refresh | All components |
| No `.catch()` on any promise chain across all services | All services |
| Static blocks assume browser globals (window, document, bootstrap) — crash under Node/SSR | `language-service`, `theme-service`, `router-service`, `toast-service`, `modal-service` |
| Mutable static state makes testing hard — no service exposes `reset()` or `dispose()` | All services |

### Naming typos

| File | Line | Issue |
|------|------|-------|
| `components/simpl-progress.js` | 4 | Class name `SimpleProgress` (missing `l`), tag is `simpl-progress` |
| `components/simpl-switch.js` | 4 | Class name `SimplSwitsh` (missing `c`), tag is `simpl-switch` |
| `components/simpl-navbar.js` | 130 | Method name `emmit` instead of `emit` |

### HTML/attribute issues

| File | Line | Issue |
|------|------|-------|
| `components/simpl-color.js` | 12 | `</input>` — void element with closing tag; invalid HTML |
| `components/simpl-input.js` | 12 | `autofocus="true"` — boolean attribute used with non-standard value |
| `components/simpl-textarea.js` | 13 | `type="text"` on `<textarea>` — ignored by browser |
| `components/simpl-date.js` | 9 | Missing `class="mb-3"` — inconsistent spacing vs other components |
| `components/simpl-select.js` | 13-18 | Default-selection runs before async `loadViewState()` — brief flicker |
| `components/simpl-file.js` | 13 | `value` attribute on `<input type="file">` — ignored by browsers (dead code) |
| `components/simpl-file.js` | 19 | Stores browser's fake path `C:\fakepath\...` instead of `File` object |

### Code smells

| File | Line | Issue |
|------|------|-------|
| `core/element.js` | 5 | Class name `Element` shadows native `window.Element` |
| `core/element.js` | 68 | Unnecessary `\|\| []` after `.filter()` (always returns array) |
| `core/element.js` | 145 | `this.tagName` returns uppercase (e.g., `SIMPL-INPUT`) — unconventional CSS |
| `core/element.js` | 72 | Incomplete prototype-pollution guard — only blocks `__proto__`, `constructor`, `prototype` |
| `core/form-element.js` | 4-6 | `required`/`hidden`/`disabled` shadow identical parent fields (wasted slots) |
| `models/simpl-model.js` | 84-88 | Falsy/empty-string context bypasses init, causes runtime errors |
| `services/language-service.js` | 22-26 | `load()` fires-and-forgets `StorageService.loadApp()` with no `.catch()` |
| `services/theme-service.js` | 29-33 | Same as above — `loadApp` with no `.catch()` |
| `services/modal-service.js` | 137 | `body.includes(' required ')` — fragile string-matching on raw HTML |
| `services/storage-service.js` | 52-57 | `setInterval` + `clearInterval` antipattern (should be `setTimeout`) |
| `services/storage-service.js` | 12-16 | Race-condition workaround with 100ms init delay — fragile |
| `services/storage-service.js` | 11 | Default key `'simpl4u'` duplicated in both `StorageService` and `StorageAdapter` |
| `components/simpl-checkboxes.js` | 33-36 | Hardcoded `this.model.lang` couples component to business domain |
| `components/simpl-crud.js` | 122-131 | Recursive retry loop in `doCreate` — stack growth with repeated invalid submissions |
| `components/simpl-crud.js` | 142-160 | `setTimeout` with zero delay in `doEdit` — timing-dependent hack |
| `components/simpl-table.js` | 164-170 | `getHeaders()` infers columns from first item — items with different keys lose columns |
| `components/simpl-todo.js` | 203-208 | `addPanel()` uses user input (`name`) as model key without sanitization |
| `components/simpl-todo.js` | 8 | No null guard on `this.form` — renders `<null>` if attribute missing |
| `components/simpl-navbar.js` | 89-105 | Copy-pasted JSDoc references "table" events instead of "navbar" |
| `components/simpl-combobox-list.js` | 48 | Uses legacy `srcElement` instead of standard `target` |
| `components/simpl-combobox-list.js` | 19,30-31 | Inconsistent case-folding methods (`toLowerCase` vs `toLocaleLowerCase`) |
| `components/simpl-todo.js` | 284-291 | `forEach` with async callback (fire-and-forget) — multiple modals could open |

### Config/metadata

| File | Issue |
|------|-------|
| `package.json` | Empty `"description": ""` |
| `package.json` | License says `ISC` but `LICENSE` file says MIT |
| `package.json` | Test script is stub — `"test": "echo ... && exit 1"` |
| `.gitignore` | `mongo_data/` — no MongoDB config exists in the project (leftover) |
| `assets/i18n/es.js` | Trailing blank line after `};` — whitespace inconsistency vs other locales |

---

## Architectural Observations

1. **Light DOM + innerHTML rendering** — All components render via `innerHTML` with no Shadow DOM. No style encapsulation. The `prependTagNameToCSS()` mitigation is fragile and breaks at-rules.

2. **No `attributeChangedCallback` / `observedAttributes` anywhere** — Dynamic attribute changes (e.g., changing `context`, `disabled`, `required`) after creation are silently ignored. The component must be destroyed and recreated to pick up new attribute values.

3. **Attribute timing** — Multiple components read `getAttribute()` in class field initializers (constructor), before the HTML parser guarantees attributes are set. This is unreliable for programmatic element creation.

4. **Event binding system** — The `(click)="method"` system in `element.js` has fundamental issues with bound-function identity, making cleanup impossible and causing listener leaks.

5. **Promise hygiene** — Nearly every service and async method has unhandled promise rejections or fire-and-forget calls. No error propagation to the user.

6. **Singleton static state** — All services and the model are static-only classes with no `reset()` or `dispose()`. This makes unit testing impossible without manually manipulating private fields.

7. **No Shadow DOM, no `adoptedStyleSheets`, no CSS scoping** — Styles leak in and out. Component isolation relies entirely on naming conventions.
