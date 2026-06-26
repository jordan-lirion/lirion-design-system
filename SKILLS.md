# Lirion — AI Development Guide

> **Read this document in full before touching any file.**
> It defines absolute rules, the project architecture, all available components,
> and the process to follow for any new development.

---

## 0 · Absolute Rules

1. **Never write a hardcoded color value.** All colors go through CSS custom properties (`var(--...)`). Variables are defined in `components/theme.css`.
2. **Never create a new component without first verifying it doesn't already exist** in the existing library (see §4).
3. **Never duplicate CSS.** If a class is reusable, it belongs in `theme.css`. Per-screen CSS files (`screens/auth.css`) only contain overrides specific to that screen.
4. **Never invent a class name.** Naming follows the BEM-shadcn convention (see §6).
5. **Ask for functional requirements before any development.** If the request is vague or incomplete, ask the questions listed in §7 before writing a single line of code.

---

## 1 · Project Architecture

```
/
├── components/             ← component library
│   ├── main.css            ← single entry point (imports everything)
│   ├── theme.css           ← CSS variables + base styles + layout utilities
│   ├── docs.css            ← SPA documentation shell (index.html only)
│   ├── index.html          ← interactive SPA documentation
│   ├── _assets/            ← logo, static icons
│   └── {component}/
│       ├── {component}.css ← component styles
│       └── {component}.html← standalone preview page
│
└── Screens/                ← application screens
    ├── auth.css            ← shared overrides for auth screens
    ├── login.html
    ├── firstLogin.html
    ├── password.html
    ├── forgotPassword.html
    ├── dashboard.html
    └── patient.html        ← patient detail view (Kanban + session grid)
```

### Import rules

| File | Imports |
|------|---------|
| Application screen | `../components/main.css` |
| Auth screen | `../components/main.css` + `auth.css` |
| Component preview page | `../main.css` |
| index.html (docs SPA) | `main.css` + `docs.css` |

**Never import `theme.css` directly** in an HTML file — always go through `main.css`.

---

## 2 · Design Tokens (CSS Variables)

All tokens live in `components/theme.css`, available in light mode (`:root`) and dark mode (`.dark`).

### 2.1 Base palette

| Variable | Usage |
|----------|-------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--card` | Card / surface background |
| `--card-foreground` | Text on card |
| `--popover` | Popover / menu background |
| `--popover-foreground` | Text on popover |
| `--primary` | Main accent color (yellow/gold) |
| `--primary-foreground` | Text on `--primary` background |
| `--secondary` | Secondary surface (light grey) |
| `--secondary-foreground` | Text on secondary background |
| `--muted` | Muted surface (same value as secondary) |
| `--muted-foreground` | Supporting text / placeholder |
| `--accent` | Light accent surface (hover, active states) |
| `--accent-foreground` | Text on accent background |
| `--destructive` | Error / delete red |
| `--destructive-foreground` | Text on destructive background |
| `--border` | Border color |
| `--input` | Input field border color |
| `--ring` | Focus ring color |

### 2.2 Semantic colors (tinted surfaces)

| Variable | Usage |
|----------|-------|
| `--success` | Light green background (success) |
| `--success-foreground` | Text on success background |
| `--warning` | Light amber background (warning) |
| `--warning-foreground` | Text on warning background |
| `--destructive-surface` | Light red background (surface error) |
| `--destructive-surface-foreground` | Text on destructive-surface |
| `--badge-default` | "New" badge background (light amber) |
| `--badge-default-foreground` | Default badge text |

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

### 2.6 Data/accent colors

`--chart-1` (blue-500) · `--chart-2` (blue-300) · `--chart-3` (blue-700) · `--chart-4` (blue-200) · `--chart-5` (blue-900). The chart component is removed; these tokens remain and are used by toasts and avatar previews.

### 2.7 Training colors

Each training type has a dedicated color token used by training tags, icons, and session bars:

`--training-phonemix-200` · `--training-fus-seg-200` · `--training-memoson-200` · `--training-ran-200` · `--training-loh-200` · `--training-maeva-200` · `--training-switchipido-200` · `--training-elor-200` · `--training-rech-visuelle-200` · `--training-larma-200` · `--training-graphogame-200`

---

## 3 · Layout Utilities (`theme.css`)

These classes are global and reusable across all screens.

### Centered pages (auth, onboarding)

Auth pages now use the standard app header (no "Mon compte" button) combined with `.page-centered`. The `auth.css` file overrides `padding-top` to account for the fixed header.

```html
<body class="bg-muted">
  <header class="header">
    <div class="header__start">
      <img src="../components/_assets/logo.svg" alt="Lirion" class="header__logo" />
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
    <a href="login.html" class="btn btn--ghost btn--sm">← Retour</a>
    <div class="card auth-card">...</div>
  </div>
</main>
```

| Class | Description |
|-------|-------------|
| `.bg-muted` | `background-color: var(--muted)` on `<body>` |
| `.page-centered` | Flex column, vertically centered, `min-height: 100vh` |
| `.auth-stack` | Flex column `max-width: 28rem`, `align-items: flex-start` — stacks back button above card |
| `.auth-card` | `width: 100%`, `max-width: 28rem`, `padding: 3rem` |

> **Note:** `auth.css` overrides `.page-centered { padding-top: calc(var(--header) + 1.5rem) }` to push content below the fixed header. It also hides the native browser password reveal button via `input[type="password"]::-ms-reveal`.

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

### Composition helpers

| Class | Description |
|-------|-------------|
| `.section-row` | Flex, `space-between`, gap `1rem` — section title + action button |
| `.filter-row` | Flex, gap `0.75rem` — filter toolbar (input + selects) |
| `.row` | Flex wrap, centered, gap `0.75rem` |
| `.stack` | Flex column, gap `0.75rem` |
| `.flex-center` | `display:flex; justify-content:center` |
| `.text-muted` | Supporting text (muted color, `0.8125rem`) |
| `.field-row` | Flex `space-between` for label + link (e.g. "Forgot password") |
| `.link` | Underlined text link |
| `.link--sm` | Small size variant |
| `.flex-fill` | `flex: 1; min-width: 0` — fills available space, safe with overflow |

---

## 4 · Available Components

> **For each component**, an interactive preview page is available at `components/{component}/{component}.html`.
> Open these pages (via a local server) to see all states before using a component.

### Button — `.btn`

```html
<button class="btn btn--default">Label</button>
<button class="btn btn--outline btn--sm">Small</button>
<button class="btn btn--ghost btn--icon" aria-label="...">
  <svg .../>
</button>
```

| Modifier | Description |
|----------|-------------|
| `btn--default` | Primary background (yellow), dark text |
| `btn--secondary` | Light grey background |
| `btn--destructive` | Red |
| `btn--outline` | Border, transparent background |
| `btn--dash` | Dashed border, transparent background (same hover as `btn--outline`) |
| `btn--ghost` | Transparent, no border |
| `btn--link` | Underlined text link |
| `btn--sm` | Small size |
| `btn--lg` | Large size |
| `btn--icon` | Square icon button (`aria-label` required) |
| `btn--full` | `width: 100%` |
| `btn--start` | `justify-content: flex-start` — left-aligns content inside a full-width button |

### Badge — `.badge`

```html
<span class="badge badge--success">Active</span>
```

| Modifier | Usage |
|----------|-------|
| `badge--default` | Amber (new, highlight) |
| `badge--secondary` | Neutral grey |
| `badge--outline` | Border only |
| `badge--success` | Green |
| `badge--warning` | Dark amber |
| `badge--destructive` | Red |

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
    <svg ... style="display:none" />  <!-- eye, shown when password is visible -->
  </button>
</div>

<!-- Select -->
<select class="select">
  <option>Option</option>
</select>

<!-- Textarea -->
<textarea class="textarea"></textarea>
```

Password toggle — add `data-password-toggle` to the button. `form.js` handles it via event delegation: walks up to `.input-group`, queries the `input` and both `svg` children, toggles `type` and `style.display`.

**Required JS:** `<script src="../components/form/form.js" defer></script>`

| Class | Description |
|-------|-------------|
| `.field` | Field wrapper (stacks label + input + hint) |
| `.label` | Styled `<label>` |
| `.input` | Text, email, password, search input |
| `.textarea` | Multi-line text area |
| `.select` | Styled native select |
| `.hint` | Helper text below the field |
| `.input-group` | Wrapper for input with icon/button |
| `.input-group--icon-start` | Leading icon |
| `.input-group--icon-end` | Trailing icon/button |
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

**Required JS:** `<script src="../components/tabs/tabs.js" defer></script>`

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

**Required JS:** `<script src="../components/table/table.js" defer></script>`

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

Pure CSS tooltip via the `data-tooltip` attribute. No JavaScript required.

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

Use `dropdown__menu--end` to right-align the menu.

**Required JS:** `<script src="../components/dropdown/dropdown.js" defer></script>`

`dropdown.js` uses **event delegation** — works for both static and dynamically injected dropdowns. No `initDropdowns()` call needed.

> **Overflow clipping warning:** If the dropdown is inside a container with `overflow: auto/hidden` (e.g. `.boards`), the menu will be clipped. In that case, use a shared `position:fixed` menu appended to `<body>` and positioned via `getBoundingClientRect()`. See `program.js` (`_todoMenu`) for the pattern.

### Dialog — `.dialog`

```html
<dialog class="dialog" id="my-dialog">
  <div class="dialog__header">
    <h2 class="dialog__title">Title</h2>
    <p class="dialog__description">Description</p>
  </div>
  <div><!-- content --></div>
  <div class="dialog__footer">
    <button class="btn btn--secondary" data-dialog-close>Annuler</button>
    <button class="btn btn--default" id="btn-confirm">Confirmer</button>
  </div>
</dialog>

<button data-dialog-open="my-dialog">Open</button>
```

Use `dialog--lg` for a wider dialog.

**Required JS:** `<script src="../components/dialog/dialog.js" defer></script>`

`dialog.js` wires `[data-dialog-open="id"]` → `showModal()` and `[data-dialog-close]` → `close()` at page load.

> **Top-layer stacking:** Native `<dialog>` in modal mode occupies the browser top layer. Any `position:fixed` element appended to `<body>` will render **below** the dialog regardless of z-index. To display floating elements (dropdowns, datepickers) above a modal dialog, they must be appended **inside** the `<dialog>` element. See Datepicker for the automatic detection pattern.

### Datepicker — `[data-datepicker]`

Button trigger + floating calendar popup. Singleton popup (one open at a time). Automatically moves inside a `<dialog>` if the trigger lives within one (top-layer fix).

```html
<div class="field">
  <label class="label">Date</label>
  <div data-datepicker>
    <button class="btn btn--outline btn--full datepicker__trigger" type="button" data-datepicker-trigger>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
      </svg>
      <span class="datepicker__value">Sélectionner une date</span>
    </button>
  </div>
</div>
```

**Required JS:** `<script src="../components/datepicker/datepicker.js" defer></script>`

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

```html
<div class="toaster" id="toaster" aria-live="polite" aria-atomic="false"></div>
<script src="../components/toast/toast.js" defer></script>
```

```js
showToast('success', 'Patient ajouté');
showToast('error', 'Erreur', 'Description optionnelle');
```

Variants: `toast--default` · `toast--success` · `toast--warning` · `toast--error` · `toast--info`

### Header — `.header`

```html
<header class="header">
  <div class="header__start">
    <img src="../components/_assets/logo.svg" alt="Lirion" class="header__logo" />
    <nav class="header__nav">
      <a href="..." class="header__nav-link is-active">Patients</a>
    </nav>
  </div>
  <div class="header__end">
    <button class="btn btn--outline btn--sm">Mon Compte</button>
  </div>
</header>
```

> Auth pages use the header **without** the "Mon Compte" button (only `header__start` with the logo).

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

Use `sortable__item--sm` for compact items (e.g. inside a modal).

| Class | Description |
|-------|-------------|
| `.sortable` | List container (`flex-column`, `gap: 0.5rem`) |
| `.sortable__item` | Row with card styling |
| `.sortable__item--sm` | Compact padding variant |
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
| `banner--success` | `--success` / `--success-foreground` |
| `banner--warning` | `--warning` / `--warning-foreground` |
| `banner--info` | `--muted` / `--muted-foreground` |
| `banner--sticky` | `position: sticky; top: var(--header); z-index: 90` |

### Training Tag — `.training-tag`

Colored pill label identifying a training type.

```html
<span class="training-tag training-tag--phonemix">Phonemix - Identification</span>
<span class="training-tag training-tag--fus-seg">Fusion</span>
```

Available modifiers: `training-tag--phonemix` · `training-tag--fus-seg` · `training-tag--memoson` · `training-tag--ran` · `training-tag--loh` · `training-tag--maeva` · `training-tag--switchipido` · `training-tag--elor` · `training-tag--rech-visuelle` · `training-tag--larma` · `training-tag--graphogame`

### Training Icon — `.training-icon`

Circular avatar for training items in lists and modals. Same color modifiers as training-tag.

```html
<span class="training-icon training-icon--phonemix">P</span>
<span class="training-icon training-icon--sm training-icon--fus-seg">F</span>
```

| Modifier | Description |
|----------|-------------|
| `training-icon--sm` | Compact size (`1.5rem`, `0.6875rem` font) |

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
          <div class="module__tags">
            <span class="training-tag training-tag--phonemix">Phonemix</span>
          </div>
          <!-- dropdown -->
        </div>
        <hr class="separator">
        <p class="module__meta">10 séances</p>
        <div class="module__dots">
          <span class="session-dot session-dot--success">01/03</span>
          <span class="session-dot session-dot--pending"></span>
          <div data-todo-wrapper>
            <button class="session-dot session-dot--todo" type="button"></button>
          </div>
        </div>
        <!-- "+ Ajouter une séance" added by program.js -->
      </div>

    </div>
    <div class="board__footer">
      <button class="btn btn--dash btn--full">+ Nouveau module</button>
    </div>
  </div>

</div>
```

**Required JS:** `<script src="../components/program/program.js" defer></script>`

`program.js` handles:
- Board collapse/expand (`.board__toggle`)
- Appending `btn--dash btn--full btn--sm` "+ Ajouter une séance" button to every `.module`
- `session-dot--todo` click → fixed-position dropdown → "Convertir en test de niveau" → replaces dot with `session-dot--test`
- `[data-action="add-session"]` click → appends a new `--todo` dot inside `[data-todo-wrapper]`

> **Overflow fix:** `.boards` uses `overflow-x: auto` which implicitly clips `overflow-y`. The `--todo` dropdown uses a single `position:fixed` menu (`_todoMenu`) appended to `<body>` and positioned via `getBoundingClientRect()` to escape clipping.

| Class | Description |
|-------|-------------|
| `.boards` | Horizontal scroll container for boards |
| `.board` | Kanban column (`width: 20rem`, card styling) |
| `.board--disabled` | Faded, non-interactive board |
| `.board__header` | Title + options dropdown |
| `.board__content` | Flex column of module cards |
| `.board__footer` | "Nouveau module" action button area |
| `.module` | Individual module card |
| `.module--disabled` | Faded module |
| `.module__header` | Training tags + options dropdown |
| `.module__tags` | Flex wrap of `.training-tag` elements |
| `.module__meta` | Session count label |
| `.module__dots` | 5-column grid of session dots |
| `.session-dot` | Single session indicator cell |
| `.session-dot--success` | Green — completed (tooltip: "Complété") |
| `.session-dot--partial` | Amber — abandoned (tooltip: "Abandon") |
| `.session-dot--pending` | Grey — not started (tooltip: "Non commencé") |
| `.session-dot--test` | Yellow — level test (tooltip: "Test de niveau") |
| `.session-dot--todo` | Dashed grey — placeholder; click opens dropdown to convert to `--test` |
| `[data-todo-wrapper]` | Grid cell wrapper for `--todo` dots (sets `min-width:0; width:100%`) |

**CSS-only tooltips** on `--success`, `--partial`, `--pending`, `--test` use `::after` pseudo-elements with `content: "..."`. No `data-tooltip` attribute needed on session dots.

**Board drag & drop**: modules support drag-and-drop reordering within and across boards via the HTML5 Drag-and-Drop API. See `components/program/program.js` for the full implementation.

**Page-level data injection**: `program.js` reads `window._PROGRAM_CATALOG` (an array of training entry objects) to populate the add-module dialog. Inject it from the host page in a plain (non-deferred) inline `<script>` **before** the deferred `program.js` tag:

```html
<script>
  window._PROGRAM_CATALOG = [
    { id: 'phonemix', label: 'Phonemix - Identification', type: 'phonemix' },
    /* ... */
  ];
</script>
<script src="../components/program/program.js" defer></script>
```

If `window._PROGRAM_CATALOG` is not set, `program.js` falls back to an empty array.

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
- [ ] Decide which CSS to import: `main.css` alone, or `main.css` + `auth.css`?

### 5.2 Minimal structure — centered page (auth)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Title</title>
  <link rel="stylesheet" href="../components/main.css" />
  <link rel="stylesheet" href="auth.css" />
</head>
<body class="bg-muted">

  <header class="header">
    <div class="header__start">
      <img src="../components/_assets/logo.svg" alt="Lirion" class="header__logo" />
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
  <a href="previous.html" class="btn btn--ghost btn--sm">
    <svg ...arrow-left.../> Retour
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
  <link rel="stylesheet" href="../components/main.css" />
</head>
<body>
  <header class="header">
    <div class="header__start">
      <img src="../components/_assets/logo.svg" alt="Lirion" class="header__logo" />
    </div>
    <div class="header__end">
      <button class="btn btn--outline btn--sm">Mon Compte</button>
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
<link rel="stylesheet" href="../components/main.css" />
<img src="../components/_assets/logo.svg" />
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
/* ❌ Using HTML `hidden` attribute to toggle visibility — can be overridden by CSS display rules */
eyeOff.hidden = true;

/* ✅ Use style.display which cannot be overridden */
eyeOff.style.display = 'none';
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
Buttons      : btn btn--default | btn--secondary | btn--outline | btn--dash | btn--ghost | btn--sm | btn--icon | btn--full | btn--start
Badges       : badge badge--success | badge--warning | badge--destructive | badge--default | badge--secondary
Forms        : field > label + input/select/textarea + hint
               input-group input-group--icon-start | --icon-end
               [data-password-toggle] on toggle button → handled by form.js
Cards        : card > card__header > card__title + card__description
App layout   : page-app > page-app__content > page-app__section--muted | --bg
Auth layout  : page-centered + header (logo only) + auth-card | auth-stack
Helpers      : section-row | filter-row | flex-center | flex-fill | text-muted | bg-muted | row | stack
Tabs         : tabs__list + tabs__trigger (pill)  [data-tabs] [data-value]
Table        : table > thead > th > table__sort-btn[data-sort] + table__sort-icon
Datepicker   : [data-datepicker] > [data-datepicker-trigger] + .datepicker__value
Kanban       : boards > board > board__content > module > module__dots > session-dot--{state}
Calendar     : session-grid > session-grid__row > session-cell > session-module-bar
Training     : training-tag--{type} | training-icon--{type} | training-icon--sm
JS states    : is-active (tabs, nav) | is-open (dropdown) | is-dragging | is-over | is-set (datepicker)
```

---

*Last updated: June 2026 — 25 components, 6 screens*
