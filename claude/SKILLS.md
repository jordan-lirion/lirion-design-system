# Lirion — AI Development Guide

> **Read this document in full before touching any file.**
> It defines absolute rules, the project architecture, all available components,
> and the process to follow for any new development.

---

## 0 · Absolute Rules

1. **Never write a hardcoded color value.** All colors go through CSS custom properties (`var(--...)`). Variables are defined in `components/theme.css`.
2. **Never create a new component without first verifying it doesn't already exist** in the existing library (see §4).
3. **Never duplicate CSS.** If a class is reusable, it belongs in `theme.css`. Never add `style="..."` attributes to HTML — every override must become a named CSS class.
4. **Never invent a class name.** Naming follows the BEM-shadcn convention (see §6).
5. **Never write hand-crafted `<svg>` icons in HTML or JS.** All UI icons use Lucide via CDN (see §4 Icons). The only exceptions are `assets/logo.svg` and `assets/trainings/*.svg` which are `<img>`-based.
6. **Ask for functional requirements before any development.** If the request is vague or incomplete, ask the questions listed in §7 before writing a single line of code.

---

## 1 · Project Architecture

```
/
├── index.html              ← login / point d'entrée
├── firstLogin.html
├── password.html
├── forgotPassword.html
├── dashboard.html
├── patient.html            ← patient detail view (Kanban + session grid)
├── patientNew.html         ← new patient creation flow
├── session.html            ← session detail view (training stats + detail dialogs)
├── test.html               ← niveau test session detail view
├── account.html            ← user account page
├── assets/
│   ├── logo.svg
│   └── trainings/          ← SVG icons per training type (11 files)
├── claude/                 ← AI guide
│   └── SKILLS.md
└── components/             ← component library
    ├── main.css            ← single entry point (imports everything)
    ├── theme.css           ← CSS variables + base styles + layout utilities
    ├── docs.css            ← SPA documentation shell (index.html only)
    ├── index.html          ← interactive SPA documentation
    └── {component}/
        ├── {component}.css ← component styles
        └── {component}.html← standalone preview page
```

### Import rules

| File | Imports |
|------|---------|
| Application screen | `components/main.css` |
| Auth screen | `components/main.css` |
| Component preview page | `../main.css` |
| index.html (docs SPA) | `main.css` + `docs.css` |

**Never import `theme.css` directly** in an HTML file — always go through `main.css`.

---

## 2 · Design Tokens (CSS Variables)

All tokens live in `components/theme.css`, available in light mode (`:root`) and dark mode (`.dark`).

### 2.1 Base palette

| Variable | Usage |
|----------|-------|
| `--background` | Page background, card / popover / menu surfaces |
| `--foreground` | Primary text |
| `--muted` | Quiet surface — page bg, hover states, secondary button |
| `--muted-foreground` | Supporting text / placeholder |
| `--primary` | Lirion yellow/gold |
| `--primary-foreground` | Text on `--primary` background |
| `--border` | Border color (also used for input field borders) |
| `--ring` | Focus ring color |

### 2.2 Semantic surfaces

All semantic colors follow the same **4-variable pattern**: solid pair (for buttons) + muted pair (for surface chips: badges, banners, dots). This makes the system fully consistent across brand, success, warning, and destructive.

| Variable | Value | Usage |
|----------|-------|-------|
| `--brand` | amber-500 | Solid button background |
| `--brand-foreground` | dark | Text on solid brand button |
| `--brand-muted` | amber-100 | Surface chip background (badge--default, banner--brand, chip-checkbox, session-dot--test) |
| `--brand-muted-foreground` | amber-700 | Text / icon on brand surface |
| `--success` | green-600 | Solid button background |
| `--success-foreground` | white | Text on solid success button |
| `--success-muted` | green-100 | Surface chip background (badge, banner, session dot) |
| `--success-muted-foreground` | green-700 | Text / icon on success surface |
| `--warning` | orange-600 | Solid button background |
| `--warning-foreground` | white | Text on solid warning button |
| `--warning-muted` | orange-100 | Surface chip background (badge--warning, toast icon) |
| `--warning-muted-foreground` | orange-700 | Text / icon on warning surface |
| `--destructive` | red-600 | Solid button background |
| `--destructive-foreground` | white | Text on solid destructive button |
| `--destructive-muted` | red-100 | Surface chip background (badge--destructive, session dot--partial) |
| `--destructive-muted-foreground` | red-700 | Text / icon on destructive surface |

### 2.3 States

| Variable | Usage |
|----------|-------|
| `--disabled-bg` | Background of disabled elements |
| `--disabled-fg` | Text / border of disabled elements |
| `--overlay` | Dialog backdrop (black 50%) |

### 2.4 Typography, radii, shadows

| Variable | Value / Usage |
|----------|---------------|
| `--font-sans` | Lexend (primary typeface) |
| `--font-mono` | System monospace |
| `--radius-sm` | Small radius (`radius - 4px`) |
| `--radius-md` | Medium radius (`radius - 2px`) |
| `--radius-lg` | Standard radius |
| `--radius-xl` | Large radius (`radius + 4px`) |
| `--shadow-sm` | Light shadow |
| `--shadow-md` | Medium shadow |
| `--shadow-lg` | Strong shadow |

### 2.5 Application layout

| Variable | Value / Usage |
|----------|---------------|
| `--header` | `3.375rem` — fixed header height |

### 2.6 Data visualization colors

`--chart-1` (blue-500) · `--chart-2` (blue-300) · `--chart-3` (blue-700) · `--chart-4` (blue-200) · `--chart-5` (blue-900). Used by toasts and avatar previews.

### 2.7 Training colors

Each training type has a dedicated color token used by training tags, icons, and session bars:

`--training-phonemix-200` · `--training-fus-seg-200` · `--training-memoson-200` · `--training-ran-200` · `--training-loh-200` · `--training-maeva-200` · `--training-switchipido-200` · `--training-elor-200` · `--training-rech-visuelle-200` · `--training-larma-200` · `--training-graphogame-200`

---

## 3 · Layout Utilities (`theme.css`)

These classes are global and reusable across all screens.

### Centered pages (auth, onboarding)

Auth pages use the standard app header (no "Mon compte" button) combined with `.page-centered`. The `padding-top: calc(var(--header) + 1.5rem)` is baked directly into `.page-centered` in `theme.css` — no extra CSS file needed.

```html
<body class="bg-muted">
  <header class="header">
    <div class="header__start">
      <img src="assets/logo.svg" alt="Lirion" class="header__logo" />
    </div>
  </header>

  <main class="page-centered">
    <div class="card auth-card">...</div>
  </main>
</body>
```

For pages with a back button (e.g. `password.html`, `forgotPassword.html`), wrap the button and card together in `.auth-stack`:

```html
<main class="page-centered">
  <div class="auth-stack">
    <a href="index.html" class="btn btn--secondary btn--sm">← Retour</a>
    <div class="card auth-card">...</div>
  </div>
</main>
```

| Class | Description |
|-------|-------------|
| `.bg-muted` | `background-color: var(--muted)` on `<body>` |
| `.page-centered` | Flex column, vertically centered, `min-height: 100vh`, `padding-top: calc(var(--header) + 1.5rem)` |
| `.auth-stack` | Flex column `max-width: 28rem`, `align-items: flex-start` — stacks back button above card |
| `.auth-card` | `width: 100%`, `max-width: 28rem`, `padding: 3rem` |

### Application pages (with header)

```html
<body>
  <header class="header">...</header>
  <div class="page-app">
    <div class="page-app__content">
      <div class="page-app__section--muted">  <!-- transparent background -->
        ...
      </div>
      <div class="page-app__section--bg">     <!-- white card background -->
        ...
      </div>
    </div>
  </div>
</body>
```

| Class | Description |
|-------|-------------|
| `.page-app` | Main wrapper below the fixed header |
| `.page-app__content` | Content area, flex column |
| `.page-app__section--muted` | Section `max-width: 64rem`, transparent background |
| `.page-app__section--bg` | Section `max-width: 64rem`, white background, `border-radius-xl` |
| `.page-app__section--sm` | Fixed height `6rem` |
| `.page-app__section--fill` | Fills remaining vertical space |
| `.page-app__section--pt-sm` | Adds `padding-top: 0.5rem` — combine with `--muted` or `--bg` |
| `.page-app__section--pt-md` | Adds `padding-top: 1.5rem` |
| `.page-app__section--pt-xl` | Adds `padding-top: 5rem` |

### Composition helpers

| Class | Description |
|-------|-------------|
| `.section-row` | Flex, `space-between`, gap `1rem` — section title + action button |
| `.filter-row` | Flex, gap `0.75rem` — filter toolbar (input + selects) |
| `.row` | Flex wrap, centered, gap `0.75rem` |
| `.row--sm` | Flex, gap `0.5rem` (compact row) |
| `.stack` | Flex column, gap `0.75rem` |
| `.stack--sm` | Flex column, gap `0.5rem` (compact stack) |
| `.value-row` | `display: inline-flex; align-items: center; gap: 0.375rem` — number + icon pairs |
| `.flex-center` | `display:flex; justify-content:center` |
| `.text-muted` | Supporting text (muted color, `0.8125rem`) |
| `.text-success` | `color: var(--success)` — green text / icon color |
| `.text-destructive` | `color: var(--destructive)` — red text / icon color |
| `.field-row` | Flex `space-between` for label + link (e.g. "Forgot password") |
| `.link` | Underlined text link |
| `.link--sm` | Small size variant |
| `.flex-fill` | `flex: 1; min-width: 0` — fills available space, safe with overflow |
| `.mb-sm` | `margin-bottom: 0.5rem` |
| `.mb-md` | `margin-bottom: 1.25rem` |
| `.relative` | `position: relative` — wrapper for absolutely-positioned children |
| `.is-hidden` | `display: none` — use `classList.toggle('is-hidden', bool)` from JS instead of `style.display` |

---

## 4 · Available Components

> **For each component**, an interactive preview page is available at `components/{component}/{component}.html`.
> Open these pages (via a local server) to see all states before using a component.

### Icons — Lucide

All UI icons use the [Lucide](https://lucide.dev/icons/) library via CDN. Replace every `<svg>` icon with `<i data-lucide="name">`.

**Setup — every HTML file that displays icons:**

```html
<!-- In <head> -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

<!-- Before </body> -->
<script>lucide.createIcons();</script>
```

**Usage in HTML:**

```html
<i data-lucide="x"></i>
<i data-lucide="plus" class="some-css-class"></i>
```

Lucide replaces `<i data-lucide="name">` with the generated `<svg>`. CSS classes on the `<i>` are transferred to the `<svg>`. Size is controlled by CSS — Lucide's default `width/height="24"` presentation attributes are overridden by any class rule.

**Usage in JS (dynamic DOM)** — call `lucide.createIcons()` *after* appending to the DOM:

```js
container.appendChild(el);
if (typeof lucide !== 'undefined') lucide.createIcons();
```

**Icon names used in this project:**

`x` · `plus` · `search` · `user` · `chevron-down` · `chevron-right` · `chevron-left` · `arrow-left` · `ellipsis-vertical` · `lock` · `eye` · `eye-off` · `calendar` · `list-filter` · `arrow-up-down` · `send` · `euro` · `triangle-alert` · `bell` · `circle-check` · `circle-x` · `check` · `trash-2` · `download` · `settings` · `mail` · `graduation-cap` · `house-heart` · `pencil` · `grip-vertical` · `info`

> **Exceptions — do NOT replace with Lucide:** `assets/logo.svg` (used via `<img src="assets/logo.svg">`) and `assets/trainings/*.svg` (training icons, also `<img>`-based).

---

### Button — `.btn`

```html
<button class="btn btn--default">Label</button>
<button class="btn btn--outline btn--sm">Small</button>
<button class="btn btn--ghost btn--icon" aria-label="...">
  <i data-lucide="settings"></i>
</button>
```

| Modifier | Description |
|----------|-------------|
| `btn--default` | Primary background (yellow), dark text |
| `btn--secondary` | Light grey background (`--muted`) |
| `btn--success` | Solid green (`--success`), white text — same style as `btn--destructive` |
| `btn--destructive` | Solid red (`--destructive`), white text |
| `btn--outline` | Border, transparent background |
| `btn--dash` | Dashed border, transparent background (same hover as `btn--outline`) |
| `btn--ghost` | Transparent, no border |
| `btn--link` | Underlined text link |
| `btn--sm` | Small size |
| `btn--lg` | Large size |
| `btn--icon` | Square icon button (`aria-label` required) |
| `btn--full` | `width: 100%` |
| `btn--start` | `justify-content: flex-start` — left-aligns content inside a full-width button |

> **`<a>` as button:** `.btn` includes `text-decoration: none`, so `<a class="btn btn--outline ...">` renders identically to `<button>`. Use `<a>` when the action is navigation, `<button>` otherwise.

### Badge — `.badge`

```html
<span class="badge badge--success">Active</span>
```

| Modifier | Usage |
|----------|-------|
| `badge--default` | Amber brand surface (`--brand`) |
| `badge--secondary` | Neutral grey (`--muted`) |
| `badge--outline` | Border only |
| `badge--success` | Light green surface (`--success-muted`) |
| `badge--warning` | Orange surface (`--warning`) |
| `badge--destructive` | Light red surface (`--destructive-muted`) |

### Card — `.card`

```html
<div class="card">
  <div class="card__header">
    <h2 class="card__title">Title</h2>
    <p class="card__description">Description</p>
  </div>
  <div class="card__content">...</div>
  <div class="card__footer">...</div>
</div>
```

### Form — inputs, labels, fields

```html
<!-- Simple field -->
<div class="field">
  <label class="label" for="id">Label</label>
  <input class="input" type="text" id="id" placeholder="..." />
  <span class="hint">Help text</span>
</div>

<!-- Input with leading icon -->
<div class="input-group input-group--icon-start">
  <span class="input-group__icon"><svg .../></span>
  <input class="input" type="search" placeholder="Search..." />
</div>

<!-- Input with trailing toggle (password) -->
<div class="input-group input-group--icon-end">
  <input class="input" type="password" id="pwd" />
  <button class="input-group__icon input-group__icon--end input-group__icon--btn" data-password-toggle>
    <svg .../>  <!-- eye-off, visible by default -->
    <svg class="is-hidden" .../>  <!-- eye, shown when password is visible -->
  </button>
</div>

<!-- Select -->
<select class="select">
  <option>Option</option>
</select>

<!-- Textarea -->
<textarea class="textarea"></textarea>
```

Password toggle — add `data-password-toggle` to the button. `form.js` handles it via event delegation: walks up to `.input-group`, queries the `input` and both `svg` children, toggles `type` and `is-hidden` class via `classList.toggle`.

**Required JS:** `<script src="components/form/form.js" defer></script>`

| Class | Description |
|-------|-------------|
| `.field` | Field wrapper (stacks label + input + hint) |
| `.label` | Styled `<label>` |
| `.input` | Text, email, password, search input |
| `.input--error` | Red border — invalid field |
| `.input--success` | Green border — valid field |
| `.textarea` | Multi-line text area |
| `.textarea--error` / `.textarea--success` | Same border states as `.input` |
| `.select` | Styled native select |
| `.select--error` / `.select--success` | Same border states as `.input` |
| `.hint` | Helper text below the field |
| `.hint--error` | Red hint text (`var(--destructive)`) |
| `.hint--success` | Green hint text (`var(--success-muted-foreground)`) |
| `.input-group` | Wrapper for input **or select** with icon/button |
| `.input-group--error` | Red border on the group wrapper |
| `.input-group--success` | Green border on the group wrapper |
| `.input-group--icon-start` | Leading icon — works with `.input` and `.select` |
| `.input-group--icon-end` | Trailing icon/button — works with `.input` and `.select` |
| `.input-group__icon` | Decorative icon |
| `.input-group__icon--end` | Positioned on the right |
| `.input-group__icon--btn` | Clickable icon (`<button>`) |

### Checkbox & Radio — `.checkbox` / `.radio`

```html
<label class="choice">
  <input type="checkbox" class="checkbox" />
  Label
</label>
<label class="choice">
  <input type="radio" class="radio" name="group" />
  Label
</label>
```

### Switch — `.switch`

```html
<label>
  <input type="checkbox" class="switch" role="switch" />
</label>
```

### Tabs (pill) — `.tabs__list` / `.tabs__trigger`

Segmented pill style — tabs inside a muted container.

```html
<div data-tabs>
  <div role="tablist" class="tabs__list">
    <button role="tab" class="tabs__trigger" aria-selected="true" data-value="a">Tab 1</button>
    <button role="tab" class="tabs__trigger" aria-selected="false" data-value="b">Tab 2</button>
  </div>
  <div data-value="a">Content A</div>
  <div data-value="b" hidden>Content B</div>
</div>
```

**Required JS:** `<script src="components/tabs/tabs.js" defer></script>`

> Use `data-value` on triggers and panels (not `data-panel` / `id`). Wrap in `[data-tabs]` to scope multiple instances on the same page. Use `display: contents` on `[data-tabs]` if it must be transparent to flex/grid layout.

### Avatar — `.avatar`

```html
<span class="avatar">JD</span>
<span class="avatar avatar--sm">JD</span>
<div class="avatar-group">
  <span class="avatar avatar--sm">A</span>
  <span class="avatar avatar--sm">B</span>
</div>
```

### Separator — `.separator`

```html
<hr class="separator" />
<span class="separator separator--vertical" role="separator"></span>
```

### Table — `.table`

```html
<div class="table-wrapper">
  <table class="table">
    <thead>
      <tr>
        <th>
          <button class="table__sort-btn" data-sort="none">
            Column
            <span class="table__sort-icon"><svg ...arrow-up-down.../></span>
          </button>
        </th>
        <th class="num">Actions</th>  <!-- non-sortable -->
      </tr>
    </thead>
    <tbody>
      <tr data-href="page.html"><td>...</td></tr>
    </tbody>
  </table>
</div>
```

**Required JS:** `<script src="components/table/table.js" defer></script>`

`table.js` handles two behaviors:
1. **Clickable rows** — `data-href` on `<tr>` navigates to the URL unless a `<button>` or `<a>` was clicked
2. **Sortable columns** — `.table__sort-btn` with `data-sort` cycles `none → asc → desc → none`; sorts numerically or alphabetically (French locale); restores original order on reset

| Class | Description |
|-------|-------------|
| `.table__sort-btn` | Sortable header button (inherits `th` styles) |
| `.table__sort-icon` | Icon wrapper inside the sort button |
| `data-sort="none\|asc\|desc"` | Current sort state; controls icon opacity and `th` color |

### Tooltip — `data-tooltip`

```html
<button class="btn btn--outline btn--icon" data-tooltip="Settings" aria-label="Settings">
  <svg .../>
</button>
```

CSS tooltip via the `data-tooltip` attribute — `::after` pseudo-element, no JS required.

> **Overflow clipping:** If the element with `data-tooltip` is inside a container with `overflow: auto/hidden` (e.g. `.table-wrapper`), the CSS `::after` tooltip will be clipped. Load `tooltip.js` to activate a `position:fixed` JS tooltip instead. When `tooltip.js` is present it adds `js-tooltips` to `<html>`, which disables the CSS pseudo-element via `:not(.js-tooltips) [data-tooltip]::after`.

**Optional JS (for overflow containers):** `<script src="components/tooltip/tooltip.js" defer></script>`

#### Tooltip icon — `.tooltip-icon`

```html
<span class="tooltip-icon" data-tooltip="Information">
  <svg .../>
</span>
<span class="tooltip-icon tooltip-icon--destructive" data-tooltip="Irreversible">
  <svg .../>
</span>
```

| Modifier | Color |
|----------|-------|
| _(none)_ | `--muted-foreground` |
| `tooltip-icon--destructive` | `--destructive` |
| `tooltip-icon--success` | `--success-foreground` |
| `tooltip-icon--warning` | `--warning-foreground` |

### Dropdown — `.dropdown`

```html
<div class="dropdown" data-dropdown>
  <button class="btn btn--outline" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false">
    Options <svg .../>
  </button>
  <div class="dropdown__menu" role="menu">
    <p class="dropdown__label">Group</p>
    <button class="dropdown__item" role="menuitem">Action</button>
    <hr class="dropdown__separator" />
    <button class="dropdown__item dropdown__item--destructive" role="menuitem">Delete</button>
  </div>
</div>
```

Use `dropdown__menu--end` to right-align the menu. Use `dropdown__menu--fixed` for a menu that must escape `overflow` clipping — it sets `position: fixed; z-index: 200` and must be positioned via `getBoundingClientRect()` in JS.

**Required JS:** `<script src="components/dropdown/dropdown.js" defer></script>`

`dropdown.js` uses **event delegation** — works for both static and dynamically injected dropdowns. No `initDropdowns()` call needed.

> **Overflow clipping warning:** If the dropdown is inside a container with `overflow: auto/hidden` (e.g. `.boards`), the menu will be clipped. In that case, use `dropdown__menu--fixed` on a menu appended to `<body>` and positioned via `getBoundingClientRect()`. See `program.js` (`_todoMenu`) for the pattern.

### Dialog — `.dialog`

```html
<dialog class="dialog" id="my-dialog">
  <div class="dialog__header">
    <h2 class="dialog__title">Title</h2>
    <p class="dialog__description">Description</p>
  </div>
  <div class="dialog__fields"><!-- stacked fields --></div>
  <div class="dialog__footer">
    <button class="btn btn--secondary" data-dialog-close>Annuler</button>
    <button class="btn btn--default" id="btn-confirm">Confirmer</button>
  </div>
</dialog>

<button data-dialog-open="my-dialog">Open</button>
```

Use `dialog--lg` for a wider dialog. Use `dialog__header--row` on the header when the title and a close/action button sit side by side:

```html
<div class="dialog__header dialog__header--row">
  <h2 class="dialog__title">Title</h2>
  <button class="btn btn--ghost btn--icon btn--sm" data-dialog-close aria-label="Fermer">...</button>
</div>
```

Use `dialog__separator` for a visual divider between sections:

```html
<hr class="dialog__separator" />
```

| Extra class | Description |
|-------------|-------------|
| `.dialog__header--row` | Header as a flex row (`space-between`) — title + button on the same line |
| `.dialog__fields` | `display: flex; flex-direction: column; gap: 1rem` — stacks form fields |
| `.dialog__separator` | Borderless `<hr>` with a top border, no margin on sides |

**Required JS:** `<script src="components/dialog/dialog.js" defer></script>`

`dialog.js` wires `[data-dialog-open="id"]` → `showModal()` and `[data-dialog-close]` → `close()` at page load.

> **Top-layer stacking:** Native `<dialog>` in modal mode occupies the browser top layer. Any `position:fixed` element appended to `<body>` will render **below** the dialog regardless of z-index. To display floating elements (dropdowns, datepickers) above a modal dialog, they must be appended **inside** the `<dialog>` element. See Datepicker for the automatic detection pattern.

### Datepicker — `[data-datepicker]`

Button trigger + floating calendar popup. Singleton popup (one open at a time). Automatically moves inside a `<dialog>` if the trigger lives within one (top-layer fix).

```html
<div class="field">
  <label class="label">Date</label>
  <div data-datepicker>
    <button class="btn btn--outline btn--full datepicker__trigger" type="button" data-datepicker-trigger>
      <i data-lucide="calendar"></i>
      <span class="datepicker__value">Sélectionner une date</span>
    </button>
  </div>
</div>
```

**Required JS:** `<script src="components/datepicker/datepicker.js" defer></script>`

| Class / Attribute | Description |
|-------------------|-------------|
| `[data-datepicker]` | Instance root — scopes one picker |
| `[data-datepicker-trigger]` | Clickable trigger button |
| `.datepicker__trigger` | Modifier for `btn--outline btn--full` with left-aligned content |
| `.datepicker__value` | Span showing the selected date (muted until set, then `is-set`) |
| `.datepicker__popup` | Floating calendar container (managed by JS) |
| `.datepicker__nav` | Month navigation row |
| `.datepicker__month-label` | Current month/year label |
| `.datepicker__weekdays` | Day-name header row (Lu Ma Me Je Ve Sa Di) |
| `.datepicker__grid` | 7-column day button grid |

**Behavior:**
- Click trigger → popup opens below via `getBoundingClientRect()`
- Prev/next arrows navigate months
- Click a day → updates `.datepicker__value`, closes popup
- Click outside → closes popup
- Inside a `<dialog>` → popup is moved into the dialog DOM so it renders in the top layer

### Pagination — `.pagination`

```html
<nav aria-label="Pagination" class="flex-center">
  <ul class="pagination">
    <li><button class="btn btn--secondary btn--icon">1</button></li>
    <li><button class="btn btn--secondary btn--icon is-active" aria-current="page">2</button></li>
    <li><button class="btn btn--secondary btn--icon">3</button></li>
  </ul>
</nav>
```

### Toast — `.toast` / `.toaster`

Structure: **icon + single text + close button**.

```html
<!-- Container (empty — toasts are injected by JS) -->
<div class="toaster" id="toaster" aria-live="polite" aria-atomic="false"></div>
<script src="components/toast/toast.js" defer></script>
```

```js
// API: showToast(variant, text)
showToast('success', 'Modifications enregistrées avec succès.');
showToast('error',   'Échec de l\'envoi. Veuillez réessayer.');
showToast('warning', 'Espace de stockage presque plein (90% utilisé).');
showToast('default', 'Événement créé le mardi 14 janvier à 9h00.');
```

Variants: `toast--default` · `toast--success` · `toast--warning` · `toast--error`

| Class | Description |
|-------|-------------|
| `.toaster` | Fixed container, bottom-right, `column-reverse` flex — newest toast on top |
| `.toast` | Notification card: flex row, `align-items: center` |
| `.toast__icon` | Lucide icon, 1.125rem, colored by variant |
| `.toast__text` | Single-line message, `flex: 1`, 0.875rem, `var(--foreground)` |
| `.toast__close` | Flex X button, 1.5rem, right-aligned |
| `.is-dismissing` | Triggers exit animation — element removed on `animationend` |

**Requires Lucide CDN** — `lucide.createIcons()` is called inside `toast.js` after each toast is appended. Auto-dismisses after 4 s.

### Header — `.header`

**Application pages** (`dashboard.html`, `patient.html`, `account.html`) — logo links to dashboard, "Mon compte" links to account:

```html
<header class="header">
  <div class="header__start">
    <a href="dashboard.html">
      <img src="assets/logo.svg" alt="Lirion" class="header__logo" />
    </a>
  </div>
  <div class="header__end">
    <a href="account.html" class="btn btn--outline btn--sm">
      <i data-lucide="user"></i>
      Mon compte
    </a>
  </div>
</header>
```

**Auth pages** (`index.html`, `forgotPassword.html`, etc.) — logo only, no link, no "Mon compte" button:

```html
<header class="header">
  <div class="header__start">
    <img src="assets/logo.svg" alt="Lirion" class="header__logo" />
  </div>
</header>
```

### Stat — `.stat`

Key metric display with a large value and a supporting label.

```html
<div class="stat">
  <div class="stat__top">
    <span class="stat__value">128</span>
  </div>
  <span class="stat__label">Patients actifs</span>
</div>
```

Group multiple stats in a horizontal row with separators:

```html
<div class="stat-group card">
  <div class="stat">
    <span class="stat__value">42</span>
    <span class="stat__label">Sessions ce mois</span>
  </div>
  <div class="stat">
    <span class="stat__value">96%</span>
    <span class="stat__label">Taux de complétion</span>
  </div>
</div>
```

### Sortable — `.sortable`

Drag-and-drop reorderable list. Items with `draggable="true"` can be reordered; items without are static rows.

```html
<ul class="sortable">
  <li class="sortable__item" draggable="true">
    <button class="sortable__handle" type="button" aria-label="Réordonner">
      <svg .../>
    </button>
    <div class="sortable__body">
      <span class="sortable__title">Item title</span>
      <span class="sortable__sub">Subtitle</span>
    </div>
    <span class="sortable__meta">Meta info</span>
    <div class="sortable__actions">
      <button class="btn btn--outline btn--sm">Modifier</button>
    </div>
  </li>
</ul>
```

Use `sortable__item--sm` for compact items (e.g. inside a modal). Use `sortable--modal` when the list is inside a dialog (removes top margin and collapses min-height). Add `sortable__item--expandable` for items that toggle between a collapsed row and an inline edit form when clicked.

| Class | Description |
|-------|-------------|
| `.sortable` | List container (`flex-column`, `gap: 0.5rem`) |
| `.sortable--modal` | Variant for use inside a dialog (`margin: 0.75rem 0`, `min-height: 0`) |
| `.sortable__item` | Row with card styling |
| `.sortable__item--sm` | Compact padding variant |
| `.sortable__item--expandable` | Clickable item that can expand to show an inline form (`flex-wrap`, `cursor: pointer`) |
| `.sortable__item--expandable.is-expanded` | Expanded state: `cursor: default`, `background: var(--secondary)` |
| `.sortable__row` | Flex row inside an expanded item (handle + icon + title + action) |
| `.sortable__fields` | 2-column grid inside an expanded item for form fields |
| `.sortable__field--full` | `grid-column: 1 / -1` — spans both columns of `.sortable__fields` |
| `.sortable__handle` | Grip icon button (sets `cursor: grab`) |
| `.sortable__body` | Flex column: title + subtitle |
| `.sortable__title` | Primary text |
| `.sortable__sub` | Secondary muted text |
| `.sortable__meta` | Right-aligned muted metadata |
| `.sortable__actions` | Flex row of action buttons |
| `.is-dragging` | Applied during drag (`opacity: 0.35`) |
| `.is-over` | Drop target highlight (`ring` outline) |

### Banner — `.banner`

Full-width contextual strip. Add `banner--sticky` to pin it below the fixed header.

```html
<div class="banner banner--success banner--sticky">
  Patient Actif • Prochain paiement le 06/08/26
</div>
```

| Modifier | Description |
|----------|-------------|
| `banner--success` | Light green surface (`--success-muted` / `--success-muted-foreground`) |
| `banner--brand` | Amber brand surface (`--brand` / `--brand-foreground`), bouton `btn--default` |
| `banner--info` | Muted grey surface (`--muted` / `--muted-foreground`), bouton `btn--outline` |
| `banner--destructive` | Red surface (`--destructive-muted` / `--destructive-muted-foreground`) |
| `banner--sticky` | `position: sticky; top: var(--header); z-index: 90` |

> SVG icons inside `.banner` are automatically capped at `1rem × 1rem` by the component CSS — no need for size classes or inline styles.

Pour une banner avec un bouton d'action, ajouter un `<button class="btn btn--{variant} btn--sm">` directement dans le texte — le gap est géré par le composant. **Les boutons dans une banner doivent toujours avoir `btn--sm`.**

```html
<div class="banner banner--success">
  Programme enregistré.
  <button class="btn btn--success btn--sm">Voir</button>
</div>
<div class="banner banner--brand">
  Nouveautés disponibles.
  <button class="btn btn--default btn--sm">Découvrir</button>
</div>
```

### Training Tag — `.training-tag`

Colored pill label identifying a training type.

```html
<span class="training-tag training-tag--phonemix">Phonemix - Identification</span>
<span class="training-tag training-tag--fus-seg">Fusion</span>
```

Available modifiers: `training-tag--phonemix` · `training-tag--fus-seg` · `training-tag--memoson` · `training-tag--ran` · `training-tag--loh` · `training-tag--maeva` · `training-tag--switchipido` · `training-tag--elor` · `training-tag--rech-visuelle` · `training-tag--larma` · `training-tag--graphogame`

### Training Icon — `.training-icon`

Circular icon for training items in lists and modals. Each icon is an `<img>` pointing to the corresponding SVG in `assets/trainings/`. The SVGs are self-contained (they include their own colored circular background).

```html
<!-- Static HTML (application screens at root) -->
<img class="training-icon" src="assets/trainings/phonemix.svg" alt="Phonemix">
<img class="training-icon training-icon--sm" src="assets/trainings/fus-seg.svg" alt="FusSeg">

<!-- Static HTML (component preview pages in components/) -->
<img class="training-icon" src="../assets/trainings/phonemix.svg" alt="Phonemix">
```

Available SVG filenames: `phonemix` · `fus-seg` · `memoson` · `ran` · `loh` · `maeva` · `switchipido` · `elor` · `rech-visuelle` · `larma` · `graphogame`

| Modifier | Description |
|----------|-------------|
| `training-icon--sm` | Compact size (`1.5rem × 1.5rem`) |

> The `training-icon--{name}` color modifiers still exist in CSS as a graceful fallback (shown if the image fails to load) but are no longer needed in markup — the SVG provides its own background.

### Chip Checkbox — `.chip-checkbox`

Toggle chip with a visual checkbox indicator. Used for multi-select UIs. Toggle `aria-pressed` via JS.

```html
<button class="chip-checkbox" aria-pressed="false" type="button">
  <span class="chip-checkbox__box">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  </span>
  <span>Phonémix - Identification</span>
</button>
```

```js
chip.addEventListener('click', () =>
  chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')
);
```

### Program — Kanban boards with modules

Used in `Screens/patient.html` for the therapeutic project view.

```html
<div class="boards">           <!-- horizontal scroll container -->

  <div class="board">
    <div class="board__header">
      <span class="board__title">Audio-phonologique</span>
      <!-- dropdown ... -->
    </div>
    <div class="board__content">

      <div class="module">
        <div class="module__header">
          <div class="module__info">
            <p class="module__meta" data-module-label>Module 1</p>
            <div class="module__tags">
              <span class="training-tag training-tag--phonemix">Phonemix</span>
            </div>
          </div>
          <!-- dropdown -->
        </div>
        <hr class="separator">
        <p class="module__meta">10 séances</p>
        <div class="module__dots">
          <a href="session.html" class="session-dot session-dot--success">01/03</a>
          <span class="session-dot session-dot--pending"><i data-lucide="x"></i></span>
          <div data-todo-wrapper>
            <button class="session-dot session-dot--todo" type="button"></button>
          </div>
        </div>
        <!-- "+ Ajouter une séance" added by program.js -->
      </div>

      <!-- Completed module — dropdown replaced by check icon, add-session btn hidden -->
      <div class="module module--completed">
        <div class="module__header">
          <div class="module__info">
            <p class="module__meta" data-module-label>Module 1</p>
            <div class="module__tags">...</div>
          </div>
          <button class="btn btn--ghost btn--icon btn--sm" aria-label="Complété">
            <i data-lucide="check"></i>
          </button>
        </div>
        <hr class="separator">
        <p class="module__meta">15 séances</p>
        <div class="module__dots">...</div>
      </div>

    </div>
    <div class="board__footer">
      <button class="btn btn--dash btn--full">+ Nouveau module</button>
    </div>
  </div>

</div>
```

**Required JS:** `<script src="components/program/program.js" defer></script>`

`program.js` handles:
- Board collapse/expand (`.board__toggle`)
- Appending `btn--dash btn--full btn--sm` "+ Ajouter une séance" button to every `.module` (skipped on `.module--completed`)
- `session-dot--todo` click → fixed-position dropdown with two items: "Convertir en test de niveau" (replaces dot with `session-dot--test`) and a `dropdown__item--destructive` "Supprimer" (removes the dot and its `[data-todo-wrapper]`)
- `[data-action="add-session"]` click → appends a new `--todo` dot inside `[data-todo-wrapper]`
- `[data-action="complete-board"]` → **irreversible**: adds `board--completed`, replaces the `<div class="dropdown">` in the board header with a plain `<button>` displaying `<i data-lucide="check">`. No undo.
- `[data-action="complete-module"]` → same pattern: adds `module--completed`, swaps dropdown for check button.
- New module dialog: the sortable list (`#modal-sortable`) sits **above** the "Nouvel entrainement" button so newly added trainings stack above it. The button (`btn--outline btn--full btn--start mb-sm`, `id="btn-add-training"`) opens a `position:fixed` training dropdown filtered to the current board's program type (read from `.board__title`). Selecting an item prepends it to the sortable list; clicking outside the button/dropdown closes it. `mb-sm` on the button provides spacing before the `dialog__separator` below it.
- New modules are created with `session-dot--todo` dots (not `--pending`).
- Module numbering: at page load, `_renumberModules` runs on every `.board` — it creates a `.module__info` wrapper around `.module__tags` (if absent), injects a `<p class="module__meta" data-module-label>` as the first child, and sets the text to `Module 1`, `Module 2`… in DOM order. The label is also updated after any drag-and-drop reorder and after a module is deleted.

> **Overflow fix:** `.boards` uses `overflow-x: auto` which implicitly clips `overflow-y`. The `--todo` dropdown uses a single `position:fixed` menu (`_todoMenu`) appended to `<body>` and positioned via `getBoundingClientRect()` to escape clipping.

| Class | Description |
|-------|-------------|
| `.boards` | Horizontal scroll container for boards |
| `.board` | Kanban column (`width: 20rem`, card styling) |
| `.board--disabled` | Faded, non-interactive board (legacy) |
| `.board--completed` | Dims `board__header` (opacity 0.45, no pointer-events), hides `board__footer`; modules inside stay fully interactive |
| `.board__header` | Title + options dropdown |
| `.board__content` | Flex column of module cards |
| `.board__footer` | "Nouveau module" action button area |
| `.module` | Individual module card |
| `.module--disabled` | Faded module (legacy) |
| `.module--completed` | Dims `module__header`, `.separator`, `.module__meta` (opacity 0.45, no pointer-events); hides `[data-action="add-session"]`; session-dots stay fully visible and interactive |
| `.module__header` | Flex row: `.module__info` on the left + dropdown (or check button) on the right |
| `.module__info` | Flex column wrapper (`gap: 0.375rem`, `flex: 1`) — stacks `[data-module-label]` above `.module__tags` |
| `[data-module-label]` | `<p class="module__meta">` injected/updated by `_renumberModules`; identifies the module number label |
| `.module__tags` | Flex wrap of `.training-tag` elements |
| `.module__meta` | Session count label (also reused by `[data-module-label]`) |
| `.module__dots` | 5-column grid of session dots |
| `.session-dot` | Single session indicator cell |
| `.session-dot--success` | Green — completed (tooltip: "Complété") — use `<a href="session.html">` to make it navigable |
| `.session-dot--partial` | Amber — abandoned (tooltip: "Abandon") |
| `.session-dot--pending` | Grey — not started (tooltip: "Non commencé") — always contains `<i data-lucide="x"></i>` (svg sized to 0.875rem, muted color) |
| `.session-dot--test` | Yellow — level test (tooltip: "Test de niveau") — use `<a href="test.html">` to make it navigable |
| `.session-dot--todo` | Dashed grey — placeholder; click opens dropdown to convert to `--test` |
| `[data-todo-wrapper]` | Grid cell wrapper for `--todo` dots (sets `min-width:0; width:100%`) |
| `.training-dropdown` | `position:fixed` floating list used by the add-training button — appended to `<body>`, positioned via `getBoundingClientRect()`; filtered by current board's program type |

**CSS-only tooltips** on `--success`, `--partial`, `--pending`, `--test` use `::after` pseudo-elements with `content: "..."`. No `data-tooltip` attribute needed on session dots.

**Board drag & drop**: modules support drag-and-drop reordering within and across boards via the HTML5 Drag-and-Drop API. See `components/program/program.js` for the full implementation.

**Page-level data injection**: `program.js` reads `window._PROGRAM_CATALOG` (an array of training entry objects) to populate the add-module dialog. Inject it from the host page in a plain (non-deferred) inline `<script>` **before** the deferred `program.js` tag:

```html
<script>
  window._PROGRAM_CATALOG = [
    { id: 'phonemix-id',   name: 'Phonemix - Identification', cls: 'training-icon--phonemix',      tagCls: 'training-tag--phonemix',      programs: ['Audio-phonologique'] },
    { id: 'fusion',        name: 'Fusion',                    cls: 'training-icon--fus-seg',       tagCls: 'training-tag--fus-seg',       programs: ['Audio-phonologique'] },
    { id: 'loh',           name: 'LOH',                       cls: 'training-icon--loh',           tagCls: 'training-tag--loh',           programs: ['Visuo-attentionnel'] },
    { id: 'rech-visuelle', name: 'Rech. Visuelle',            cls: 'training-icon--rech-visuelle', tagCls: 'training-tag--rech-visuelle', programs: ['Audio-visuel'] },
    /* ... */
  ];
</script>
<script src="components/program/program.js" defer></script>
```

Fields: `id` (unique string), `name` (display label), `cls` (training-icon modifier — used to derive the SVG filename: `cls.replace('training-icon--', '')`), `tagCls` (training-tag modifier), `programs` (array of program names — the training is only shown in the dropdown when the current board's `.board__title` text matches one of these values).

The training dropdown renders a `.training-dropdown__empty` paragraph when no trainings are available (all already selected, or none match the board type).

**Full catalog** (14 trainings across 3 programs):

| Program | id | name | icon / tag suffix |
|---------|----|------|-------------------|
| Audio-phonologique | `phonemix-id` | Phonemix - Identification | `phonemix` |
| Audio-phonologique | `phonemix-disc` | Phonemix - Discrimination | `phonemix` |
| Audio-phonologique | `memoson-diff` | Memoson - Différences | `memoson` |
| Audio-phonologique | `memoson-cache` | Memoson - Cache Cache | `memoson` |
| Audio-phonologique | `fusion` | Fusion | `fus-seg` |
| Audio-phonologique | `segmentation` | Segmentation | `fus-seg` |
| Audio-phonologique | `ran` | RAN | `ran` |
| Visuo-attentionnel | `loh` | LOH | `loh` |
| Visuo-attentionnel | `elor` | ELOR | `elor` |
| Visuo-attentionnel | `switchpido` | Switchpido | `switchipido` |
| Visuo-attentionnel | `maeva` | Maeva | `maeva` |
| Audio-visuel | `rech-visuelle` | Rech. Visuelle | `rech-visuelle` |
| Audio-visuel | `larma` | Larma | `larma` |
| Audio-visuel | `graphogame` | Graphogame | `graphogame` |

### Item — `.item`

Action row component — navigable list item with optional icon, a title, an optional description, and a right-pointing arrow. Same border/color/font as `btn--outline`. Use `<a>` for navigation, `<button>` for in-page actions.

```html
<!-- Title only -->
<a href="#" class="item">
  <div class="item__content">
    <div class="item__title">Mon profil</div>
  </div>
  <div class="item__actions">
    <i data-lucide="chevron-right"></i>
  </div>
</a>

<!-- With icon + description -->
<a href="#" class="item">
  <div class="item__media">
    <i data-lucide="user"></i>
  </div>
  <div class="item__content">
    <div class="item__title">Mon profil</div>
    <div class="item__description">Nom, prénom, email et photo</div>
  </div>
  <div class="item__actions">
    <i data-lucide="chevron-right"></i>
  </div>
</a>

<!-- Non-clickable (informational only) — use <div>, omit item__actions -->
<div class="item item--static">
  <div class="item__media"><i data-lucide="lock"></i></div>
  <div class="item__content">
    <div class="item__title">Version</div>
    <div class="item__description">1.0.0</div>
  </div>
</div>
```

| Slot | Required | Description |
|------|----------|-------------|
| `.item__media` | No | Left icon (`1.125rem` SVG) — auto-aligns to top when description is present |
| `.item__content` | Yes | Flex column wrapping title + description |
| `.item__title` | Yes | Primary label |
| `.item__description` | No | Supporting muted text (`0.8125rem`) |
| `.item__actions` | No | Right side — chevron-right icon; omit for static items |

| Modifier | Description |
|----------|-------------|
| `.item--static` | Non-clickable variant — `cursor: default`, no hover background |

> Stack multiple `.item` elements in a `.stack` (gap `0.75rem`) or a `flex-direction:column` container.

### Session Grid — `.session-grid`

Weekly session calendar for the "Calendrier des séances" tab.

```html
<div class="session-grid">
  <div class="session-grid__head">
    <div class="session-grid__col-title">Séance 1</div>
    <!-- × 5 -->
  </div>
  <div class="session-grid__body">
    <div class="session-grid__row">
      <div class="session-cell">
        <span class="session-cell__day">Lun 01</span>
        <span class="badge badge--success">Complété</span>
        <span class="session-cell__duration">15min</span>
        <div class="session-cell__modules">
          <span class="session-module-bar" style="background-color:var(--training-phonemix-200)"></span>
        </div>
      </div>
      <!-- × 5 cells per row -->
    </div>
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.session-grid` | Outer container with border and radius |
| `.session-grid__head` | 5-column header row |
| `.session-grid__col-title` | Column header label |
| `.session-grid__body` | Flex column of rows |
| `.session-grid__row` | 5-column grid row |
| `.session-cell` | Individual day cell (aspect-ratio 1:1) |
| `.session-cell--empty` | Empty cell with muted background |
| `.session-cell__day` | Day label |
| `.session-cell__status` | Status text for non-completed cells |
| `.session-cell__duration` | Duration display |
| `.session-cell__modules` | Row of colored module bars |
| `.session-module-bar` | Thin colored pill per module (`height: 0.5rem`, `width: 1.5rem`) |

---

## 5 · Creating a Screen from Scratch

### 5.1 Checklist before writing HTML

- [ ] Identify the page type: **centered** (auth) or **application** (with header)?
- [ ] List required components — do all of them exist in the library?
- [ ] Check whether a new component is needed → follow §7 before continuing
- [ ] All screens import only `main.css` — no per-screen CSS files

### 5.2 Minimal structure — centered page (auth)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Title</title>
  <link rel="stylesheet" href="components/main.css" />
</head>
<body class="bg-muted">

  <header class="header">
    <div class="header__start">
      <img src="assets/logo.svg" alt="Lirion" class="header__logo" />
    </div>
  </header>

  <main class="page-centered">
    <div class="card auth-card">
      <div class="card__header">
        <h1 class="card__title">Title</h1>
        <p class="card__description">Description</p>
      </div>
      <div class="card__content">
        <!-- fields, buttons -->
      </div>
    </div>
  </main>

</body>
</html>
```

For pages with a back button, replace `<div class="card auth-card">` with:

```html
<div class="auth-stack">
  <a href="previous.html" class="btn btn--secondary btn--sm">
    <i data-lucide="arrow-left"></i> Retour
  </a>
  <div class="card auth-card">...</div>
</div>
```

### 5.3 Minimal structure — application page

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Title</title>
  <link rel="stylesheet" href="components/main.css" />
</head>
<body>
  <header class="header">
    <div class="header__start">
      <a href="dashboard.html">
        <img src="assets/logo.svg" alt="Lirion" class="header__logo" />
      </a>
    </div>
    <div class="header__end">
      <a href="account.html" class="btn btn--outline btn--sm">
        <i data-lucide="user"></i>
        Mon compte
      </a>
    </div>
  </header>

  <div class="page-app">
    <div class="page-app__content">

      <div class="page-app__section--muted">
        <div class="section-row">
          <h1>Page title</h1>
          <button class="btn btn--default">Action</button>
        </div>
      </div>

      <div class="page-app__section--bg">
        <!-- main content -->
      </div>

    </div>
  </div>
</body>
</html>
```

---

## 6 · Naming Conventions

The system follows a **lightweight BEM** convention, inspired by shadcn/ui.

| Level | Convention | Example |
|-------|-----------|---------|
| Component | `.component` | `.btn`, `.card`, `.badge` |
| Element | `.component__element` | `.card__header`, `.header__nav` |
| Modifier | `.component--modifier` | `.btn--default`, `.badge--success` |
| JS state | `.is-state` | `.is-active`, `.is-open`, `.is-set` |
| Utility | `.name-action` | `.flex-center`, `.text-muted`, `.bg-muted` |
| Data hooks | `data-attribute` | `data-href`, `data-dropdown`, `data-datepicker` |

**Naming rules:**
- All lowercase, hyphens as separators
- No camelCase, no underscores
- BEM modifiers use double-hyphen `--` only
- Never use inline styles for colors — always `var(--...)`

---

## 7 · Process for a New Component

> **Do not write any code before answering all of these questions.**

### 7.1 Functional questions to ask first

1. **Name and role**: What is the component called? What problem does it solve?
2. **Variants**: What visual variants exist? (sizes, states, colors)
3. **Interactive states**: Hover, focus, disabled, loading, error, checked, selected?
4. **JS behavior**: Is it pure CSS or does it require JavaScript?
5. **Accessibility**: What ARIA role? What keyboard navigation is expected?
6. **Usage context**: In which screens will it be used? Any layout constraints?
7. **Existing components**: Can the same result be achieved by composing existing elements?

### 7.2 Creation process

Once all information has been gathered:

```
1. Create  components/{component}/{component}.css
2. Create  components/{component}/{component}.html   (preview page)
3. Add     @import './{component}/{component}.css';  to components/main.css
4. Add a link in components/index.html               (SPA navigation)
5. Add a   [data-page="{component}"]  section        in index.html
6. Document the component in SKILLS.md               (§4)
```

#### Template — `{component}.css`

```css
/* ==========================================================================
   COMPONENT NAME
   ========================================================================== */

.component {
  /* base styles using var(--...) only */
}

.component--variant { }
.component__element  { }
```

---

## 8 · Anti-patterns — What to Never Do

```css
/* ❌ Hardcoded color */
color: #333333;
background-color: rgb(245, 245, 245);

/* ✅ CSS variable */
color: var(--foreground);
background-color: var(--muted);
```

```html
<!-- ❌ Old path -->
<link rel="stylesheet" href="../design-system/main.css" />
<img src="../design-system/_assets/logo.svg" />

<!-- ✅ Correct path -->
<link rel="stylesheet" href="components/main.css" />
<img src="assets/logo.svg" />
```

```css
/* ❌ Magic value without a variable */
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);

/* ✅ Design token */
border-radius: var(--radius-md);
box-shadow: var(--shadow-sm);
```

```js
/* ❌ Inline style for visibility — bypasses the CSS system, leaves style attributes in the DOM */
eyeOff.style.display = 'none';
eyeOn.style.display = '';

/* ✅ Use the .is-hidden utility class — clean DOM, CSS-controlled */
eyeOff.classList.toggle('is-hidden', true);
eyeOn.classList.toggle('is-hidden', false);
// or the concise form:
eyeOff.classList.toggle('is-hidden', isVisible);
eyeOn.classList.toggle('is-hidden', !isVisible);
```

```js
/* ❌ position:fixed popup appended to <body> inside a modal dialog — renders below top layer */
document.body.appendChild(popup);

/* ✅ Detect dialog context and move popup inside it */
const dlg = trigger.closest('dialog');
(dlg ?? document.body).appendChild(popup);
```

---

## 9 · Quick Reference — Most Used Classes

```
Buttons      : btn btn--default | btn--secondary | btn--success | btn--destructive | btn--outline | btn--dash | btn--ghost | btn--sm | btn--icon | btn--full | btn--start
               <a class="btn ..."> works natively (text-decoration:none in base)
Badges       : badge badge--default(amber) | badge--success(green) | badge--warning(orange) | badge--destructive(red) | badge--secondary(grey) | badge--outline
Forms        : field > label + input/select/textarea + hint | hint--error | hint--success
               input--error | input--success | textarea--error/success | select--error/success
               input-group input-group--icon-start | --icon-end | --error | --success
               [data-password-toggle] on toggle button → handled by form.js (uses classList.toggle('is-hidden'))
Cards        : card > card__header > card__title + card__description
Item         : item > item__media? + item__content > item__title + item__description? + item__actions?
               item--static for non-clickable display rows (no chevron, no hover)
Banners      : banner--success | --brand | --info | --destructive | --sticky
               SVGs auto-sized to 1rem by component CSS
App layout   : page-app > page-app__content > page-app__section--muted | --bg
               add --pt-sm | --pt-md | --pt-xl for padding-top overrides
Auth layout  : page-centered + header (logo only, no link) + auth-card | auth-stack
               padding-top baked into .page-centered — no extra CSS file needed
Helpers      : section-row | filter-row | flex-center | flex-fill | text-muted | text-success | text-destructive | bg-muted
               row | row--sm | stack | stack--sm | value-row | mb-sm | mb-md | relative | is-hidden
Icons        : <i data-lucide="name" class="..."> → lucide.createIcons() on load + after dynamic DOM inserts
               Exception: logo + training icons use <img src="assets/...svg">
Toast        : showToast(variant, text) — variants: default | success | warning | error
               toaster container + toast.js + Lucide CDN required
Tabs         : tabs__list + tabs__trigger (pill)  [data-tabs] [data-value]
Table        : table > thead > th > table__sort-btn[data-sort] + table__sort-icon
Datepicker   : [data-datepicker] > [data-datepicker-trigger] + .datepicker__value
Dialog       : dialog__header | dialog__header--row | dialog__title | dialog__fields | dialog__separator | dialog__footer
Kanban       : boards > board > board__content > module > module__dots > session-dot--{state}
Calendar     : session-grid > session-grid__row > session-cell > session-module-bar
Training     : training-tag--{type} | training-icon (img-based, src="assets/trainings/{name}.svg") | training-icon--sm
JS states    : is-active (tabs, nav) | is-open (dropdown) | is-dragging | is-over | is-set (datepicker) | is-hidden (JS toggle)
```

---

### patient.html / patientNew.html — toolbar layout

These pages no longer use tabs. The toolbar is a simple `.section-row` with an `<h3>Projet thérapeutique</h3>` on the left and the "Nouveau programme" dropdown on the right. The "Calendrier des séances" tab and its panel have been removed.

---

*Last updated: June 2026 — 27 components, 10 screens (index, firstLogin, password, forgotPassword, dashboard, patient, patientNew, session, test, account)*
