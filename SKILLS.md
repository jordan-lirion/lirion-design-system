# Lirion — AI Development Guide

> **Read this document in full before touching any file.**
> It defines absolute rules, the project architecture, all available components,
> and the process to follow for any new development.

---

## 0 · Absolute Rules

1. **Never write a hardcoded color value.** All colors go through CSS custom properties (`var(--...)`). Variables are defined in `Design System/theme.css`.
2. **Never create a new component without first verifying it doesn't already exist** in the existing library (see §4).
3. **Never duplicate CSS.** If a class is reusable, it belongs in `theme.css`. Per-screen CSS files (`Screens/auth.css`, etc.) only contain overrides specific to that screen.
4. **Never invent a class name.** Naming follows the BEM-shadcn convention (see §6).
5. **Ask for functional requirements before any development.** If the request is vague or incomplete, ask the questions listed in §7 before writing a single line of code.

---

## 1 · Project Architecture

```
/
├── Design System/          ← component library
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
    ├── password.html
    ├── forgotPassword.html
    └── dashboard.html
```

### Import rules

| File | Imports |
|------|---------|
| Application screen | `../Design System/main.css` |
| Auth screen | `../Design System/main.css` + `auth.css` |
| Component preview page | `../main.css` |
| index.html (docs SPA) | `main.css` + `docs.css` |

**Never import `theme.css` directly** in an HTML file — always go through `main.css`.

---

## 2 · Design Tokens (CSS Variables)

All tokens live in `Design System/theme.css`, available in light mode (`:root`) and dark mode (`.dark`).

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
    <div class="page-app__bar">            <!-- optional sub-header -->
      <div class="page-app__bar-start">...</div>
      <div class="page-app__bar-end">...</div>
    </div>
    <div class="page-app__content">
      <div class="page-app__section--muted">  <!-- section without background -->
        ...
      </div>
      <div class="page-app__section--bg">     <!-- section with white card background -->
        ...
      </div>
    </div>
  </div>
</body>
```

| Class | Description |
|-------|-------------|
| `.page-app` | Main wrapper below the fixed header |
| `.page-app__bar` | Sub-header with breadcrumb/actions (height `3.5rem`) |
| `.page-app__bar-start` | Left slot of the sub-header |
| `.page-app__bar-end` | Right slot of the sub-header |
| `.page-app__content` | Content area, flex column, padding `2.5rem 1rem` |
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

> **For each component**, an interactive preview page is available at `Design System/{component}/{component}.html`.
> Open these pages (via a local server) to see all states before using a component.

### Button — `.btn`

```html
<button class="btn btn--default">Label</button>
<button class="btn btn--default btn--sm">Small</button>
<button class="btn btn--outline btn--icon" aria-label="...">
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
  <input class="input" type="search" placeholder="Search..." />
  <span class="input-group__icon"><svg .../></span>
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

### Tabs — `.tabs__list` / `.tabs__trigger` / `.tabs__panel`

```html
<div role="tablist" class="tabs__list">
  <button role="tab" class="tabs__trigger is-active" aria-selected="true">Tab 1</button>
  <button role="tab" class="tabs__trigger">Tab 2</button>
</div>
<div role="tabpanel" class="tabs__panel">Active content</div>
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
<span class="avatar">JD</span>           <!-- initials -->
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
      <!-- Clickable row: add data-href="..." and the navigation JS snippet -->
      <tr data-href="page.html"><td>...</td></tr>
    </tbody>
  </table>
</div>
```

**Making rows clickable** (add to `<script>`):
```js
document.querySelectorAll("tbody tr[data-href]").forEach((tr) => {
  tr.addEventListener("click", (e) => {
    if (!e.target.closest("button, a")) location.href = tr.dataset.href;
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

### Dropdown — `.dropdown`

```html
<div class="dropdown" data-dropdown>
  <button class="btn btn--outline" data-dropdown-trigger aria-haspopup="menu" aria-expanded="false">
    Filter <svg .../>
  </button>
  <div class="dropdown__menu" role="menu">
    <p class="dropdown__label">Group title</p>
    <button class="dropdown__item" role="menuitem">Option 1</button>
    <hr class="dropdown__separator" />
    <button class="dropdown__item dropdown__item--destructive" role="menuitem">Delete</button>
  </div>
</div>
```

**Required JavaScript** for open/close:
```js
document.querySelectorAll("[data-dropdown]").forEach((dd) => {
  const trigger = dd.querySelector("[data-dropdown-trigger]");
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = dd.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(open));
  });
});
document.addEventListener("click", () => {
  document.querySelectorAll("[data-dropdown].is-open").forEach((dd) => {
    dd.classList.remove("is-open");
    dd.querySelector("[data-dropdown-trigger]").setAttribute("aria-expanded", "false");
  });
});
```

### Dialog — `.dialog`

```html
<dialog class="dialog" id="my-dialog">
  <div class="dialog__header">
    <h2 class="dialog__title">Title</h2>
    <p class="dialog__description">Description</p>
  </div>
  <div><!-- content --></div>
  <div class="dialog__footer">
    <button class="btn btn--secondary" onclick="document.getElementById('my-dialog').close()">Cancel</button>
    <button class="btn btn--default">Confirm</button>
  </div>
</dialog>
<button onclick="document.getElementById('my-dialog').showModal()">Open</button>
```

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
<!-- Single container, place before </body> -->
<div class="toaster" id="toaster" aria-live="polite" aria-atomic="false"></div>
```

Variants: `toast--default` · `toast--success` · `toast--warning` · `toast--error` · `toast--info`

Call via JS (see `Design System/toast/toast.html` for the full `showToast()` script).

### Header — `.header`

```html
<header class="header">
  <div class="header__start">
    <img src="../Design System/_assets/logo.svg" alt="Lirion" class="header__logo" />
    <nav class="header__nav">
      <a href="..." class="header__nav-link is-active">Patients</a>
      <a href="..." class="header__nav-link">Sessions</a>
    </nav>
  </div>
  <div class="header__end">
    <button class="btn btn--outline btn--sm">My account</button>
  </div>
</header>
```

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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Title</title>
  <link rel="stylesheet" href="../Design System/main.css" />
  <link rel="stylesheet" href="auth.css" />
</head>
<body class="bg-muted">
  <main class="page-centered">
    <div class="auth-brand">
      <img src="../Design System/_assets/logo.svg" alt="Lirion" />
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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Title</title>
  <link rel="stylesheet" href="../Design System/main.css" />
</head>
<body>
  <header class="header">
    <div class="header__start">
      <img src="../Design System/_assets/logo.svg" alt="Lirion" class="header__logo" />
    </div>
    <div class="header__end">
      <button class="btn btn--outline btn--sm">My account</button>
    </div>
  </header>

  <div class="page-app">
    <div class="page-app__content">

      <div class="page-app__section--muted">
        <div class="section-row">
          <h1>Page title</h1>
          <button class="btn btn--default">Primary action</button>
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

Before developing any new component, collect:

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
1. Create  Design System/{component}/{component}.css
2. Create  Design System/{component}/{component}.html   (preview page)
3. Add     @import './{component}/{component}.css';     to main.css
4. Add a link in Design System/index.html              (SPA navigation)
5. Add a   [data-page="{component}"]  section          in index.html
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

#### Template — `{component}.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Component — Design System</title>
  <link rel="stylesheet" href="../main.css" />
</head>
<body>
  <header class="preview-header">
    <div class="preview-header__title">Design System <span>/ Component</span></div>
    <a href="../index.html" style="font-size:0.875rem;color:var(--muted-foreground);text-decoration:none;">← Back</a>
  </header>
  <main class="preview-main">
    <section class="preview-section">
      <h2 class="preview-section__title">Variants</h2>
      <div class="row">
        <!-- examples -->
      </div>
    </section>
  </main>
  <script>
    /* dark mode toggle for testing */
    const t = document.createElement("button");
    t.className = "btn btn--outline btn--sm";
    t.style.cssText = "position:fixed;bottom:1.5rem;right:1.5rem;";
    t.textContent = "Dark mode";
    t.addEventListener("click", () => {
      const d = document.documentElement.classList.toggle("dark");
      t.textContent = d ? "Light mode" : "Dark mode";
    });
    document.body.appendChild(t);
  </script>
</body>
</html>
```

---

## 8 · Anti-patterns — What to Never Do

```css
/* ❌ Hardcoded color */
color: #333333;
background-color: rgb(245, 245, 245);
background-color: oklch(0.145 0 0);     /* even in oklch */

/* ✅ CSS variable */
color: var(--foreground);
background-color: var(--muted);
```

```html
<!-- ❌ Inline style for colors -->
<p style="color: #888;">Text</p>

<!-- ✅ Utility class -->
<p class="text-muted">Text</p>
```

```html
<!-- ❌ Importing theme.css directly in a screen -->
<link rel="stylesheet" href="../Design System/theme.css" />
<link rel="stylesheet" href="../Design System/button/button.css" />

<!-- ✅ Single import -->
<link rel="stylesheet" href="../Design System/main.css" />
```

```css
/* ❌ Generic layout CSS in a screen file */
/* Screens/dashboard.css */
.content-row { display: flex; justify-content: space-between; }

/* ✅ Belongs in theme.css (already available: .section-row) */
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
                      card__content
                      card__footer
App layout   : page-app > page-app__content > page-app__section--muted | --bg
Auth layout  : page-centered + auth-brand + auth-card
Helpers      : section-row | filter-row | flex-center | text-muted | bg-muted | row | stack
JS states    : is-active (tabs, nav, pagination) | is-open (dropdown)
```

---

*Last updated: June 2026 — 24 components, 5 screens*
