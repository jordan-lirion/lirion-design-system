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
└── screens/                ← application screens
    ├── auth.css            ← shared overrides for auth screens
    ├── login.html
    ├── firstLogin.html
    ├── password.html
    ├── forgotPassword.html
    ├── dashboard.html
    ├── patient.html        ← patient detail view (Kanban + session grid)
    └── template.html
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

### 2.6 Chart colors

`--chart-1` (blue-500) · `--chart-2` (blue-300) · `--chart-3` (blue-700) · `--chart-4` (blue-200) · `--chart-5` (blue-900)

### 2.7 Training colors

Each training type has a dedicated color token used by training tags, icons, and session bars:

`--training-phonemix-200` · `--training-fusSeg-200` · `--training-memoson-200` · `--training-ran-200` · `--training-loh-200` · `--training-maeva-200` · `--training-switchipido-200` · `--training-elor-200` · `--training-rechVisuelle-200` · `--training-larma-200` · `--training-graphogame-200`

---

## 3 · Layout Utilities (`theme.css`)

These classes are global and reusable across all screens.

### Centered pages (auth, onboarding)

```html
<body class="bg-muted">
  <main class="page-centered">
    <a href="..." class="btn btn--ghost btn--sm page-back">← Back</a>
    <!-- vertically centered content -->
  </main>
</body>
```

| Class | Description |
|-------|-------------|
| `.bg-muted` | `background-color: var(--muted)` on `<body>` |
| `.page-centered` | Flex column, vertically centered, `min-height: 100vh` |
| `.page-back` | Back button absolutely positioned top-left |

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
| `btn--ghost` | Transparent, no border |
| `btn--link` | Underlined text link |
| `btn--sm` | Small size |
| `btn--md` | Medium size (default) |
| `btn--lg` | Large size |
| `btn--icon` | Square icon button (`aria-label` required) |
| `btn--full` | `width: 100%` |

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

<!-- Input with trailing button -->
<div class="input-group input-group--icon-end">
  <input class="input" type="password" />
  <button class="input-group__icon input-group__icon--end input-group__icon--btn">
    <svg .../>
  </button>
</div>

<!-- Select -->
<select class="select">
  <option>Option</option>
</select>

<!-- Textarea -->
<textarea class="textarea"></textarea>
```

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

### Slider — `.slider`

```html
<input type="range" class="slider" min="0" max="100" value="50" />
```

### Progress — `.progress`

```html
<div class="progress" role="progressbar" aria-valuenow="60">
  <div class="progress__bar" style="width: 60%"></div>
</div>
```

### Tabs (pill) — `.tabs__list` / `.tabs__trigger`

Segmented pill style — tabs inside a muted container.

```html
<div role="tablist" class="tabs__list">
  <button role="tab" class="tabs__trigger" aria-selected="true" data-panel="panel-a">Tab 1</button>
  <button role="tab" class="tabs__trigger" aria-selected="false" data-panel="panel-b">Tab 2</button>
</div>
<div id="panel-a" class="tab-panel">Content A</div>
<div id="panel-b" class="tab-panel" hidden>Content B</div>
```

### Tabs (underline) — `.tabs-line` / `.tabs-line__trigger`

Minimal underline style — active tab bold with a 2px bottom bar. Preferred for application-level navigation.

```html
<div role="tablist" class="tabs-line">
  <button role="tab" class="tabs-line__trigger" aria-selected="true" data-panel="panel-a">Tab 1</button>
  <button role="tab" class="tabs-line__trigger" aria-selected="false" data-panel="panel-b">Tab 2</button>
</div>
```

**Required JavaScript** (shared between both tab variants — adjust selector as needed):
```js
document.querySelectorAll('.tabs-line__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    document.querySelectorAll('.tabs-line__trigger').forEach(t => t.setAttribute('aria-selected', 'false'));
    trigger.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    document.getElementById(trigger.dataset.panel).hidden = false;
  });
});
```

### Alert — `.alert`

```html
<div class="alert" role="alert">
  <p class="alert__title">Title</p>
  <p class="alert__description">Message</p>
</div>
<div class="alert alert--destructive" role="alert">...</div>
```

### Avatar — `.avatar`

```html
<span class="avatar">JD</span>
<span class="avatar avatar--sm">JD</span>
<div class="avatar-group">
  <span class="avatar avatar--sm">A</span>
  <span class="avatar avatar--sm">B</span>
</div>
```

### Skeleton — `.skeleton`

```html
<div class="skeleton" style="height: 1rem; width: 12rem;"></div>
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
    <thead><tr><th>Column</th></tr></thead>
    <tbody>
      <tr data-href="page.html"><td>...</td></tr>
    </tbody>
  </table>
</div>
```

**Making rows clickable** (add to `<script>`):
```js
document.querySelectorAll('tbody tr[data-href]').forEach(tr => {
  tr.addEventListener('click', e => {
    if (!e.target.closest('button, a')) location.href = tr.dataset.href;
  });
});
```

### Accordion — `.accordion`

```html
<div class="accordion">
  <details class="accordion__item">
    <summary class="accordion__trigger">Question</summary>
    <div class="accordion__content">Answer</div>
  </details>
</div>
```

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
<div class="dropdown" data-dropdown="">
  <button class="btn btn--outline" data-dropdown-trigger="" aria-haspopup="menu" aria-expanded="false">
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

**Required JavaScript**:
```js
function initDropdowns(root) {
  root.querySelectorAll('[data-dropdown]').forEach(dd => {
    const trigger = dd.querySelector('[data-dropdown-trigger]');
    if (!trigger) return;
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = dd.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
    });
  });
}
initDropdowns(document);
document.addEventListener('click', () => {
  document.querySelectorAll('[data-dropdown].is-open').forEach(dd => {
    dd.classList.remove('is-open');
    const t = dd.querySelector('[data-dropdown-trigger]');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
});
```

> Call `initDropdowns(newElement)` on any dynamically injected HTML that contains dropdowns.

### Dialog — `.dialog`

```html
<dialog class="dialog" id="my-dialog">
  <div class="dialog__header">
    <h2 class="dialog__title">Title</h2>
    <p class="dialog__description">Description</p>
  </div>
  <div><!-- content --></div>
  <div class="dialog__footer">
    <button class="btn btn--outline" onclick="document.getElementById('my-dialog').close()">Annuler</button>
    <button class="btn btn--default">Confirmer</button>
  </div>
</dialog>
<button onclick="document.getElementById('my-dialog').showModal()">Open</button>
```

Use `dialog--lg` for a wider dialog.

### Breadcrumb — `.breadcrumb`

```html
<ol class="breadcrumb">
  <li><a href="dashboard.html">Dashboard</a></li>
  <li class="breadcrumb__sep" aria-hidden="true">/</li>
  <li aria-current="page">Patient</li>
</ol>
```

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
```

Variants: `toast--default` · `toast--success` · `toast--warning` · `toast--error` · `toast--info`

Call via JS (see `components/toast/toast.html` for the full `showToast()` script).

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

### App Bar — `.page-app__bar`

Sub-header bar placed directly below `.header`, inside `.page-app`. Used for back navigation and contextual actions.

```html
<div class="page-app__bar">
  <div class="page-app__bar-start">
    <button class="btn btn--ghost">← Retour</button>
  </div>
  <div class="page-app__bar-end">
    <button class="btn btn--default btn--sm">Action</button>
  </div>
</div>
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

Full-width contextual strip, typically sticky below the header.

```html
<div class="banner banner--success" style="position:sticky; top:var(--header); z-index:90;">
  Patient Actif • Prochain paiement le 06/08/26
</div>
```

| Modifier | Colors |
|----------|--------|
| `banner--success` | `--success` / `--success-foreground` |
| `banner--warning` | `--warning` / `--warning-foreground` |
| `banner--info` | `--muted` / `--muted-foreground` |

### Training Tag — `.training-tag`

Colored pill label identifying a training type.

```html
<span class="training-tag training-tag--phonemix">Phonemix - Identification</span>
<span class="training-tag training-tag--fusSeg">Fusion</span>
```

Available modifiers: `training-tag--phonemix` · `training-tag--fusSeg` · `training-tag--memoson` · `training-tag--ran` · `training-tag--loh` · `training-tag--maeva` · `training-tag--switchipido` · `training-tag--elor` · `training-tag--rechVisuelle` · `training-tag--larma` · `training-tag--graphogame`

### Training Icon — `.training-icon`

Circular avatar for training items in lists and modals. Same color modifiers as training-tag.

```html
<span class="training-icon training-icon--phonemix">P</span>
```

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

Used in `screens/patient.html` for the therapeutic project view.

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
          <!-- dropdown with data-action="edit-module" | "complete-module" | "delete-module" -->
        </div>
        <hr class="separator">
        <p class="module__meta">10 séances</p>
        <div class="module__dots">
          <span class="session-dot session-dot--success">01/03</span>
          <span class="session-dot session-dot--pending"></span>
        </div>
      </div>

    </div>
    <div class="board__footer">
      <button class="btn btn--outline btn--full" data-action="add-module">
        + Nouveau
      </button>
    </div>
  </div>

</div>
```

| Class | Description |
|-------|-------------|
| `.boards` | Horizontal scroll container for boards |
| `.board` | Kanban column (`width: 20rem`, card styling) |
| `.board--disabled` | Faded, non-interactive board |
| `.board__header` | Title + options dropdown |
| `.board__content` | Flex column of module cards |
| `.board__footer` | "Nouveau" action button area |
| `.module` | Individual module card |
| `.module--disabled` | Faded module |
| `.module__header` | Training tags + options dropdown |
| `.module__tags` | Flex wrap of `.training-tag` elements |
| `.module__meta` | Session count label |
| `.module__dots` | 5-column grid of session dots |
| `.session-dot` | Single session indicator cell |
| `.session-dot--success` | Green — completed |
| `.session-dot--partial` | Amber — partially done |
| `.session-dot--pending` | Grey — not started |
| `.session-dot--test` | Yellow — level test |

**Board drag & drop**: modules support drag-and-drop reordering within and across boards via the HTML5 Drag-and-Drop API. See `screens/patient.html` for the full JS implementation.

**Board actions** (`data-action` on buttons):
- `add-module` — opens the add/edit module dialog
- `edit-module` — reopens the dialog pre-populated for editing
- `complete-module` — toggles `module--disabled`
- `delete-module` — opens the delete confirmation dialog
- `complete-board` — toggles `board--disabled`
- `delete-board` — opens the delete confirmation dialog
- `add-module` on board footer — opens add-module dialog for that board

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
  <main class="page-centered">
    <div class="auth-brand">
      <img src="../components/_assets/logo.svg" alt="Lirion" />
    </div>
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
| JS state | `.is-state` | `.is-active`, `.is-open` |
| Utility | `.name-action` | `.flex-center`, `.text-muted`, `.bg-muted` |
| Data hooks | `data-attribute` | `data-href`, `data-dropdown`, `data-tooltip` |

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

---

## 9 · Quick Reference — Most Used Classes

```
Buttons      : btn btn--default | btn--secondary | btn--outline | btn--ghost | btn--sm | btn--icon | btn--full
Badges       : badge badge--success | badge--warning | badge--destructive | badge--default | badge--secondary
Forms        : field > label + input/select/textarea + hint
               input-group input-group--icon-start | --icon-end
Cards        : card > card__header > card__title + card__description
App layout   : page-app > page-app__content > page-app__section--muted | --bg
Auth layout  : page-centered + auth-brand + auth-card
Helpers      : section-row | filter-row | flex-center | text-muted | bg-muted | row | stack
Tabs         : tabs-line + tabs-line__trigger (underline)
               tabs__list + tabs__trigger (pill)
Kanban       : boards > board > board__content > module > module__dots > session-dot
Calendar     : session-grid > session-grid__row > session-cell > session-module-bar
Training     : training-tag--{type} | training-icon--{type}
JS states    : is-active (tabs, nav) | is-open (dropdown) | is-dragging | is-over
```

---

*Last updated: June 2026 — 32 components, 7 screens*
