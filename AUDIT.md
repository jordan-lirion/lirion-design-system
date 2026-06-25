# AUDIT — Lirion Design System

> Généré le 2026-06-25. Référence : `SKILLS.md` (32 composants, 7 screens).

---

## 1. Résumé exécutif

| Indicateur | Valeur |
|---|---|
| Styles inline (hors var() acceptable) | ~40 occurrences dans template.html + patient.html |
| IDs HTML dupliqués | 4 paires dans firstLogin.html (corrigé) |
| Composants sans `.html` preview | 8 (corrigé) |
| Composants sans `.js` | 32/32 — aucun fichier JS (à créer, voir §5) |
| Tokens HEX dans theme.css | 33 (corrigé → oklch) |
| Tokens manquants en dark mode | 9 (corrigé) |
| Classe `--header` hors theme.css | 1 (corrigé) |
| `.page-back` hors theme.css | 1 (corrigé) |
| Couleurs en dur dans composants CSS | 3 × `#fff` (corrigé → oklch(1 0 0)) |
| Classes CSS inutilisées (orphelines) | 2 (`.page-app__section-start`, `.page-app__section-end`) |
| Incohérences `lang` HTML | 5 screens (corrigé → fr) |
| Doublons de valeur de token | 2 groupes (à valider avant fusion) |
| Classes de structure couplées à un composant | 2 règles dans `.filter-row` |

**Santé globale :** Le socle token/composant est solide. Les principales dettes sont : (a) l'absence totale de fichiers `.js` structurés, (b) les styles inline dans les screens, (c) 8 previews manquantes, (d) les tokens training en HEX. Les corrections sûres ont été appliquées en une passe. Les actions destructives sont listées au §5.

---

## 2. Catégorie 1 — Nommage & conventions

### 2.1 Attribut `lang`

| Fichier | Ligne | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/login.html | 2 | `lang="en"` → application française | Mineure | corrigé → `lang="fr"` |
| screens/firstLogin.html | 2 | `lang="en"` | Mineure | corrigé → `lang="fr"` |
| screens/forgotPassword.html | 2 | `lang="en"` | Mineure | corrigé → `lang="fr"` |
| screens/password.html | 2 | `lang="en"` | Mineure | corrigé → `lang="fr"` |
| screens/dashboard.html | 2 | `lang="en"` | Mineure | corrigé → `lang="fr"` |
| screens/template.html | 2 | `lang="en"` | Mineure | corrigé → `lang="fr"` |

### 2.2 Titre de page erroné

| Fichier | Ligne | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/password.html | 4 | `<title>Password</title>` | Mineure | corrigé → `Mot de passe — Lirion` |
| screens/password.html | 21 | `card__title` = "Entrez votre email" (copié de login) | Majeure | corrigé → "Entrez votre mot de passe" |

### 2.3 IDs HTML dupliqués

| Fichier | Lignes | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/firstLogin.html | 30, 41 | `id="ig-password"` dupliqué (2 champs) | Majeure — JS rompu | corrigé → `ig-password-1` / `ig-password-2` |
| screens/firstLogin.html | 31, 43 | `id="toggle-password"` dupliqué | Majeure — JS rompu | corrigé → `toggle-password-1/2` |
| screens/firstLogin.html | 32, 44 | `id="icon-eye-off"` dupliqué | Majeure | corrigé → `icon-eye-off-1/2` |
| screens/firstLogin.html | 33, 45 | `id="icon-eye"` dupliqué | Majeure | corrigé → `icon-eye-1/2` |

### 2.4 Classe `.num` — statut

`.num` est définie dans `components/table/table.css` (ligne 28) et correctement utilisée dans `dashboard.html` et `index.html`. Pas de problème.

### 2.5 Classe `.tab-panel` non documentée

| Fichier | Ligne | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/patient.html | 113, 538 | `class="tab-panel"` utilisé comme sélecteur JS mais non défini en CSS, différent de `.tabs__panel` de tabs.css | Modérée | proposé — voir §5.4 |

### 2.6 Attribut `data-tab` vs `data-panel` — incohérence entre screens

| Fichier | Ligne | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/template.html | 268–271 | Triggers tabs utilisent `data-tab`, panels utilisent `data-panel` | Modérée | proposé — voir §5.4 |
| screens/patient.html | 74–78 | Triggers tabs utilisent `data-panel` (pointe directement l'id) | Modérée | proposé — voir §5.4 |

> **Décision à prendre** : unifier sur `data-panel` (même attribut sur trigger et panel correspondant à l'id du panel). Voir §5.

### 2.7 Préfixe `ds-` dans index.html

Les classes `ds-header`, `ds-sidebar`, `ds-brand`, `ds-nav-*`, `ds-main`, `ds-block`, `ds-preview`, `ds-props`, etc. sont définies dans `docs.css` et réservées au châssis de la documentation. C'est conforme à la règle « ds- réservé à index.html ». Pas de problème.

---

## 3. Catégorie 2 — Surcharges & styles inline

### 3.1 Styles inline injustifiés dans screens/firstLogin.html

| Fichier | Ligne | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/firstLogin.html (avant) | 29, 41 | `style="width:100%;"` sur `.input-group` — le composant `input-group` est déjà géré par `.field` flex | Mineure | corrigé (supprimé dans réécriture) |
| screens/firstLogin.html (avant) | 33, 45 | `style="display:none"` sur SVG → remplacé par attribut HTML `hidden` | Mineure | corrigé |

### 3.2 Styles inline dans screens/password.html

| Fichier | Ligne | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/password.html | 34 | `style="width:100%;"` sur `.input-group` | Mineure | corrigé (supprimé) |
| screens/password.html | 38 | `style="display:none"` sur SVG | Mineure | corrigé → `hidden` |

### 3.3 Styles inline dans screens/template.html

| Fichier | Ligne | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/template.html | 52 | `style="gap:0.25rem;"` sur `.stack` — `.stack` a déjà `gap:0.75rem`, ici surcharge | Modérée | proposé — créer modificateur `.stack--xs` ou utiliser var |
| screens/template.html | 74 | `style="align-items:stretch;"` sur `.row` | Modérée | proposé — créer `.row--stretch` |
| screens/template.html | 75, 84, 96, 105 | `style="flex:1;"` sur `.card` pour les stat-cards | Modérée | proposé — remplacer par composant `.stat` (voir §3.3a) |
| screens/template.html | 78, 87, 99, 108 | `style="font-size:2rem;"` pour les chiffres KPI | Modérée | proposé — remplacer par `.stat__value` (voir §3.3a) |
| screens/template.html | 93 | `style="margin-top:0.375rem;"` | Mineure | proposé |
| screens/template.html | 140 | `style="flex:1;max-width:24rem;"` sur `.input-group` dans `.filter-row` | Mineure | proposé — géré par `.filter-row .input-group` déjà en theme.css |
| screens/template.html | 184, 259 | `style="font-size:1rem;font-weight:600;"` sur `<h2>` de section | Modérée | proposé — créer `.section-title` utility |
| screens/template.html | 275, 290 | `style="flex:1;"` sur `.stack` | Mineure | proposé |
| screens/template.html | 309 | `style="margin-top:1rem;"` sur `.stack` | Mineure | proposé |
| screens/template.html | 319 | `style="margin-top:1.5rem;display:flex;gap:0.5rem;"` | Modérée | proposé — `.row` + utility class |
| screens/template.html | 376–381 | Skeletons avec hauteur/largeur inline — **cas acceptable** (documenté dans SKILLS.md) | Info | conservé |
| screens/template.html | 391, 401, 413 | `style="gap:0.375rem;"` sur `.stack` | Mineure | proposé |

> **§3.3a — Remplacement des KPI cards par `.stat`** : Les 4 cartes "Total patients / Patients actifs / Séances / Paiements" de template.html réimplèmentent le pattern `stat` avec des styles inline (`font-size:2rem`, `flex:1`). Elles devraient utiliser `.stat-group.card` → `.stat` → `.stat__value` + `.stat__label`. **Action proposée**, voir §5.

### 3.4 Styles inline dans screens/patient.html

| Fichier | Lignes | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/patient.html | 28 | `style="position:sticky; top:var(--header); z-index:90;"` sur `.banner` | Info | **acceptable** — documenté dans SKILLS.md §4 (Banner) comme pattern d'usage |
| screens/patient.html | 35 | `style="padding-top:1.5rem;"` sur `page-app__section--muted` | Mineure | proposé |
| screens/patient.html | 36 | `style="margin-bottom:0.5rem;"` sur `.btn` retour | Mineure | proposé |
| screens/patient.html | 42 | `style="flex:1; min-width:0;"` | Mineure | proposé |
| screens/patient.html | 43, 45 | `style="gap:0.5rem;"` et `flex-wrap:wrap` sur `.stack`/`.row` | Mineure | proposé |
| screens/patient.html | 71 | `style="padding-top:3rem;"` | Mineure | proposé |
| screens/patient.html | 72 | `style="display:flex; justify-content:center; margin-bottom:2rem;"` (wrapper tabs-line) | Modérée | proposé — créer `.flex-center` déjà existant + `margin-bottom` |
| screens/patient.html | 246, 407, 526 | `style="justify-content:flex-start;"` sur `.btn--outline.btn--full` | Mineure | proposé — créer `.btn--start` modificateur |
| screens/patient.html | 558–700+ | `style="background-color:var(--training-X-200)"` sur `.session-module-bar` | Modérée | **acceptable mais améliorable** — utilise var(), voir §5.5 |
| screens/patient.html | 824–930 | Nombreux styles inline dans dialogs (display:flex, gap, position, etc.) | Majeure | proposé — voir §5 |

### 3.5 Commentaire stale dans auth.css

| Fichier | Ligne | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/auth.css | 3 | Référence `design-system/theme.css` (ancien chemin) | Mineure | corrigé → `components/theme.css` |

---

## 4. Catégorie 3 — Screens = assemblage de composants

### 4.1 Mapping composant par screen

| Screen | Composants utilisés | Problème |
|---|---|---|
| login.html | card, form, button | ✓ Correct |
| firstLogin.html | card, form, button, input-group | ✓ Correct (après fix IDs) |
| password.html | card, form, button, input-group | ✓ Correct |
| forgotPassword.html | card, form, button, toast | JS toast inline (voir §5.1) |
| dashboard.html | header, table, badge, avatar, pagination, dropdown | ✓ Correct — pas de `table-wrapper` (recommandé) |
| patient.html | header, banner, card, tabs-line, program, session-grid, dropdown, dialog, sortable, chip-checkbox, training-tag | ✓ Correct mais dialogs avec styles inline |
| template.html | header, app-bar, card, table, form, tabs, accordion, skeleton, avatar, badge, separator, progress, pagination, alert, dialog, toast | Stat cards réimplémentées inline (voir §3.3a) |

### 4.2 Markup recréé à la volée

| Fichier | Description | Sévérité | Action |
|---|---|---|---|
| screens/template.html | Stat KPI cards (`font-size:2rem` inline) réimplémentent `.stat` + `.stat__value` | Modérée | proposé — remplacer par `.stat-group.card` > `.stat` |
| screens/patient.html | Picker de date inline dans dialog (calendrier custom avec styles inline) | Modérée | proposé — extraire en composant `.calendar` ou utiliser le composant existant |
| screens/patient.html | Autocomplete de recherche d'entraînements (div inline, styles inline) | Modérée | proposé — candidat à composant `combobox` |

### 4.3 `table-wrapper` manquant

| Fichier | Ligne | Problème | Sévérité | Action |
|---|---|---|---|---|
| screens/dashboard.html | 62 | `<table class="table">` sans `<div class="table-wrapper">` | Mineure | proposé |

---

## 5. Catégorie 4 — Composants orphelins / non référencés

### 5.1 Composants absents du nav `index.html`

| Composant | Dossier | CSS | HTML preview | `main.css` | `index.html` nav |
|---|---|---|---|---|---|
| Banner | ✓ | ✓ | ✗ (créé) | ✓ | ✗ |
| Calendar | ✓ | ✓ | ✗ (créé) | ✓ | ✗ |
| Program | ✓ | ✓ | ✗ (créé) | ✓ | ✗ |
| Session Grid | ✓ | ✓ | ✗ (créé) | ✓ | ✗ |
| Sortable | ✓ | ✓ | ✗ (créé) | ✓ | ✗ |
| Stat | ✓ | ✓ | ✗ (créé) | ✓ | ✗ |
| Tabs Line | ✓ | ✓ | ✗ (créé) | ✓ | ✗ |
| Training Tag | ✓ | ✓ | ✗ (créé) | ✓ | ✗ |
| Chip Checkbox | ✗ (dans training-tag.css) | piggyback | ✗ (créé dans training-tag.html) | via training-tag | ✗ |

> **Action proposée** : Ajouter une section "Application" dans la nav de `index.html` pour les 8 composants ci-dessus. Et ajouter les sections `[data-page]` correspondantes dans `index.html`.

### 5.2 Classes CSS définies mais jamais utilisées

| Fichier | Classe | Utilisée dans screens ? | Utilisée dans previews ? | Action |
|---|---|---|---|---|
| components/theme.css | `.page-app__section-start` | Non | Non | **à valider avant suppression** |
| components/theme.css | `.page-app__section-end` | Non | Non | **à valider avant suppression** |

### 5.3 Composants dans un seul fichier (multi-component CSS)

| Fichier | Composants | Problème | Action |
|---|---|---|---|
| training-tag/training-tag.css | training-tag + training-icon + chip-checkbox | 3 composants dans 1 fichier | proposé — extraire `chip-checkbox` dans son propre dossier |

---

## 6. Catégorie 5 — JS structuré par composant

**État actuel** : Aucun fichier `.js` n'existe. Tout le JS est en `<script>` inline dans les HTML. Chaque screen réimplémente les mêmes logiques.

### 6.1 Inventaire des duplications JS

| Logique | Présente dans | Lignes dupliquées |
|---|---|---|
| Toggle password visibility | firstLogin.html, password.html | ~8 lignes × 2 |
| Dropdown init + close-on-outside | dashboard.html, patient.html, template.html | ~15 lignes × 3 |
| Tabs pill (`tabs__trigger`) | template.html | ~15 lignes |
| Tabs line (`tabs-line__trigger`) | patient.html | ~10 lignes |
| Table rows clickables | dashboard.html, template.html | ~5 lignes × 2 |
| Toast `showToast()` | forgotPassword.html, template.html | ~40 lignes × 2 |
| Board drag & drop | patient.html | ~80 lignes (unique) |
| Dialog open/close | patient.html, template.html | ~10 lignes × 2 |
| Sortable drag | patient.html | ~60 lignes (unique) |
| Chip-checkbox toggle | patient.html | ~5 lignes |

### 6.2 Plan de structuration JS proposé

| Fichier à créer | Contenu |
|---|---|
| `components/dropdown/dropdown.js` | `initDropdowns(root)` + close-on-outside |
| `components/tabs/tabs.js` | Init tabs pill (data-tab → data-panel) |
| `components/tabs-line/tabs-line.js` | Init tabs-line (data-panel) |
| `components/toast/toast.js` | `showToast(variant, title, description)` |
| `components/form/form.js` | Toggle password visibility (`initPasswordToggle(inputId, …)`) |
| `components/table/table.js` | Clickable rows |
| `components/dialog/dialog.js` | Open/close helpers |
| `components/sortable/sortable.js` | Drag-and-drop sort |
| `components/program/program.js` | Board actions + module drag |
| `components/chip-checkbox/chip-checkbox.js` | Toggle aria-pressed |

> Convention de chargement proposée : `<script src="../{component}/{component}.js" defer></script>` dans chaque preview. Les screens importent les fichiers nécessaires depuis `../components/`. L'auto-init se fait par scan du DOM (`querySelectorAll('[data-dropdown]')`) au chargement.

---

## 7. Catégorie 6 — Architecture & complétude

### 7.1 Trio CSS + HTML + JS par composant

| Composant | CSS | HTML | JS | Statut |
|---|---|---|---|---|
| accordion | ✓ | ✓ | — (CSS `<details>`) | ✓ |
| alert | ✓ | ✓ | — | ✓ |
| app-bar | ✓ | ✓ | — | ✓ |
| avatar | ✓ | ✓ | — | ✓ |
| badge | ✓ | ✓ | — | ✓ |
| banner | ✓ | ✓ créé | — | ✓ |
| breadcrumb | ✓ | ✓ | — | ✓ |
| button | ✓ | ✓ | — | ✓ |
| calendar | ✓ | ✓ créé | — | ✓ |
| card | ✓ | ✓ | — | ✓ |
| chart | ✓ | ✓ | — | ✓ |
| checkbox | ✓ | ✓ | — | ✓ |
| chip-checkbox | piggyback | dans training-tag.html | à créer | ⚠ (voir §5) |
| dialog | ✓ | ✓ | à créer | ⚠ |
| dropdown | ✓ | ✓ | à créer | ⚠ |
| form | ✓ | ✓ | à créer (toggle pwd) | ⚠ |
| header | ✓ | ✓ | — | ✓ |
| pagination | ✓ | ✓ | — | ✓ |
| progress | ✓ | ✓ | — | ✓ |
| program | ✓ | ✓ créé | à créer | ⚠ |
| separator | ✓ | ✓ | — | ✓ |
| session-grid | ✓ | ✓ créé | — | ✓ |
| skeleton | ✓ | ✓ | — | ✓ |
| slider | ✓ | ✓ | — | ✓ |
| sortable | ✓ | ✓ créé | à créer | ⚠ |
| stat | ✓ | ✓ créé | — | ✓ |
| switch | ✓ | ✓ | — | ✓ |
| table | ✓ | ✓ | à créer (rows) | ⚠ |
| tabs | ✓ | ✓ | à créer | ⚠ |
| tabs-line | ✓ | ✓ créé | à créer | ⚠ |
| toast | ✓ | ✓ | à créer | ⚠ |
| tooltip | ✓ | ✓ | — (CSS) | ✓ |
| training-tag | ✓ | ✓ créé | à créer (chip) | ⚠ |

### 7.2 Règles d'import

| Fichier | Import attendu | Import réel | Statut |
|---|---|---|---|
| screens/login.html | main.css + auth.css | ✓ | ✓ |
| screens/firstLogin.html | main.css + auth.css | ✓ | ✓ |
| screens/password.html | main.css + auth.css | ✓ | ✓ |
| screens/forgotPassword.html | main.css + auth.css | ✓ | ✓ |
| screens/dashboard.html | main.css seul | ✓ | ✓ |
| screens/patient.html | main.css seul | ✓ | ✓ |
| screens/template.html | main.css seul | ✓ | ✓ |
| components/index.html | main.css + docs.css | ✓ | ✓ |
| composants previews | ../main.css | ✓ | ✓ |

### 7.3 `main.css` — imports

Tous les imports de `main.css` pointent vers des fichiers existants. Aucun import mort.  
`chip-checkbox` est couvert via `training-tag/training-tag.css` (piggyback).

---

## 8. Catégorie 7 — `theme.css` — Tokens & classes de structure

### 8.1 Tokens — format

| Problème | Nb tokens | Action |
|---|---|---|
| Training colors en HEX (`#FF9A72`…) | 33 tokens | **corrigé** → oklch |
| `--header` défini dans header.css (hors theme.css) | 1 | **corrigé** → déplacé dans theme.css |

### 8.2 Tokens — doublons de valeur

| Token A | Token B | Valeur commune | Décision |
|---|---|---|---|
| `--secondary` | `--muted` | `oklch(0.97 0 0)` | **conserver** — rôles sémantiques différents (`--secondary` pour les surfaces secondaires de UI, `--muted` pour les fonds atténués) |
| `--secondary` | `--accent` | `oklch(0.97 0 0)` | **conserver** — `--accent` est utilisé pour hover/active states |
| `--secondary-foreground` | `--accent-foreground` | `oklch(0.205 0 0)` | **conserver** — même logique |
| `--badge-default` | `--warning` | `oklch(0.962 0.059 95.617)` | **conserver** — `--badge-default` pourrait diverger si la sémantique badge évolue; les valeurs égales sont une coïncidence actuelle |

### 8.3 Tokens — parité dark mode

| Token | `:root` | `.dark` avant | `.dark` après | Action |
|---|---|---|---|---|
| `--success` | ✓ | ✗ | ✓ | **corrigé** |
| `--success-foreground` | ✓ | ✗ | ✓ | **corrigé** |
| `--warning` | ✓ | ✗ | ✓ | **corrigé** |
| `--warning-foreground` | ✓ | ✗ | ✓ | **corrigé** |
| `--destructive-surface` | ✓ | ✗ | ✓ | **corrigé** |
| `--destructive-surface-foreground` | ✓ | ✗ | ✓ | **corrigé** |
| `--badge-default` | ✓ | ✗ | ✓ | **corrigé** |
| `--badge-default-foreground` | ✓ | ✗ | ✓ | **corrigé** |
| `--overlay` | ✓ | ✗ | ✓ | **corrigé** |
| Training colors | ✓ | N/A | N/A | Couleurs de branding fixes — pas de dark variant |

### 8.4 Valeurs en dur dans les CSS de composants

| Fichier | Ligne | Valeur en dur | Remplacement | Action |
|---|---|---|---|---|
| training-tag/training-tag.css | 16, 42 | `color: #fff` | `oklch(1 0 0)` | **corrigé** |
| training-tag/training-tag.css | 110 | `stroke: #fff` | `oklch(1 0 0)` | **corrigé** |
| form/form.css | 53 | `stroke='%23737373'` (SVG data URI du select) | Non remplaçable par var() dans une data URI — valeur figée | **conservé** — limitation technique CSS |

### 8.5 Classes de structure — usage et couplage

| Classe | Définie dans | Utilisée dans | Problème | Action |
|---|---|---|---|---|
| `.page-app__section-start` | theme.css | Nulle part | Orpheline | **à valider avant suppression** |
| `.page-app__section-end` | theme.css | Nulle part | Orpheline | **à valider avant suppression** |
| `.filter-row .input-group` | theme.css | dashboard, template | Couplage layout/composant | proposé — découplement |
| `.filter-row .select` | theme.css | dashboard, template | Couplage layout/composant | proposé — découplement |
| `.page-back` | app-bar.css | forgotPassword, password | Mal placé (pas dans theme.css) | **corrigé** — déplacé dans theme.css |

---

## 9. Catégorie 8 — Composants autonomes

### 9.1 Dépendances au parent

| Composant | Problème | Sévérité | Action |
|---|---|---|---|
| `.app-bar` (page-app__bar) | Pas de position fixed/sticky — dépend d'être enfant de `.page-app` pour le placement visuel | Info | Acceptable — documenté |
| `.banner` dans patient.html | Utilise `position:sticky; top:var(--header)` en style inline | Info | Acceptable — documenté dans SKILLS.md |
| `.module > .separator` | theme.css règle dans program.css couple `.module` à `.separator` | Mineure | Conservé — logique interne du composant |

### 9.2 Sélecteurs globaux (fuites)

| Fichier | Sélecteur | Impact | Action |
|---|---|---|---|
| theme.css | `h1, h2, h3, h4 { … }` | Reset global des titres | Acceptable — base reset intentionnelle |
| theme.css | `a { color: var(--muted-foreground) }` | Affecte tous les liens | Acceptable — base reset intentionnelle |
| theme.css | `button { font-family: inherit }` | Affecte tous les boutons | Acceptable — base reset intentionnelle |
| theme.css | `tbody tr[data-href] { cursor: pointer }` | Couplage layout/attribut | Modérée — proposé : déplacer dans table.css |

### 9.3 Marges externes

Les composants n'imposent pas de `margin` externe. L'espacement est géré par `gap` dans les conteneurs (`.stack`, `.row`, `.board__content`, etc.). Conforme.

---

## 3. Table de renommage

| Ancien | Nouveau | Fichiers impactés | Statut |
|---|---|---|---|
| `--training-larma-100: #FF9A72` | `--training-larma-100: oklch(0.782 0.133 42.140)` | theme.css | corrigé |
| `--training-larma-200: #FF7A45` | `--training-larma-200: oklch(0.727 0.176 41.204)` | theme.css | corrigé |
| `--training-larma-300: #EB703F` | `--training-larma-300: oklch(0.683 0.165 41.206)` | theme.css | corrigé |
| _(idem pour les 30 autres training colors)_ | | theme.css | corrigé |
| `color: #fff` (training-tag, training-icon, chip-checkbox) | `color: oklch(1 0 0)` | training-tag/training-tag.css | corrigé |
| `stroke: #fff` (chip-checkbox checked) | `stroke: oklch(1 0 0)` | training-tag/training-tag.css | corrigé |
| `--header: 3.375rem` dans header.css | déplacé dans theme.css | header.css, theme.css | corrigé |
| `.page-back { … }` dans app-bar.css | déplacé dans theme.css | app-bar.css, theme.css | corrigé |
| `lang="en"` | `lang="fr"` | tous les screens sauf patient.html | corrigé |
| `id="ig-password"` (×2) | `ig-password-1` / `ig-password-2` | firstLogin.html | corrigé |
| `style="display:none"` sur SVG toggle | attribut `hidden` | firstLogin.html, password.html | corrigé |
| `style="width:100%;"` sur `.input-group` | supprimé | firstLogin.html, password.html | corrigé |
| Titre `<title>Password</title>` | `Mot de passe — Lirion` | password.html | corrigé |
| `card__title` "Entrez votre email" (password.html) | "Entrez votre mot de passe" | password.html | corrigé |
| Commentaire `design-system/theme.css` | `components/theme.css` | auth.css | corrigé |

---

## 4. Corrections appliquées

### `components/theme.css`
- `--header: 3.375rem` ajouté sous la section "Application layout"
- 9 tokens dark mode ajoutés dans `.dark` : `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--destructive-surface`, `--destructive-surface-foreground`, `--badge-default`, `--badge-default-foreground`, `--overlay`
- 33 training colors convertis HEX → oklch
- `.page-back` ajouté (déplacé depuis app-bar.css)

### `components/header/header.css`
- Bloc `:root { --header: 3.375rem }` supprimé (token maintenant dans theme.css)

### `components/app-bar/app-bar.css`
- `.page-back` supprimé (déplacé dans theme.css)
- Indentation normalisée (2 espaces → cohérent avec le reste du projet)

### `components/training-tag/training-tag.css`
- `color: #fff` (×2) → `color: oklch(1 0 0)`
- `stroke: #fff` → `stroke: oklch(1 0 0)`

### `screens/auth.css`
- Commentaire `design-system/theme.css` → `components/theme.css`

### `screens/login.html`
- `lang="en"` → `lang="fr"`

### `screens/firstLogin.html`
- `lang="en"` → `lang="fr"`
- Titre → `Première connexion — Lirion`
- Correction des 4 paires d'IDs dupliqués (`ig-password`, `toggle-password`, `icon-eye-off`, `icon-eye`)
- `style="width:100%;"` supprimé sur les 2 input-groups
- `style="display:none"` remplacé par `hidden` sur les 2 SVG eye icons
- JS réécrit avec fonction `initToggle()` réutilisable (2 appels)

### `screens/forgotPassword.html`
- `lang="en"` → `lang="fr"`

### `screens/password.html`
- `lang="en"` → `lang="fr"`
- Titre `Password` → `Mot de passe — Lirion`
- `card__title` "Entrez votre email" → "Entrez votre mot de passe"
- `card__description` corrigée
- `style="width:100%;"` supprimé sur l'input-group
- `style="display:none"` → `hidden`
- JS: `style.display` → `hidden` attribute

### `screens/dashboard.html`
- `lang="en"` → `lang="fr"`

### `screens/template.html`
- `lang="en"` → `lang="fr"`

### Previews HTML créées (8 fichiers)
- `components/banner/banner.html`
- `components/calendar/calendar.html`
- `components/program/program.html`
- `components/session-grid/session-grid.html`
- `components/sortable/sortable.html`
- `components/stat/stat.html`
- `components/tabs-line/tabs-line.html`
- `components/training-tag/training-tag.html`

---

## 5. À valider avant suppression / fusion

### 5.1 Classes orphelines dans theme.css

```css
.page-app__section-start { flex: 1; min-width: 0; }
.page-app__section-end   { flex-shrink: 0; }
```

Ces deux classes ne sont utilisées dans aucun fichier HTML du projet. **Proposition : supprimer.** Confirmer avant action.

### 5.2 Doublons de valeur de token

Les paires `--secondary`/`--muted`/`--accent` (même valeur `oklch(0.97 0 0)`) et `--badge-default`/`--warning` (même valeur `oklch(0.962 0.059 95.617)`) ont des rôles sémantiques différents. **Proposition : conserver** tels quels — une divergence future (nouvelle charte) les différenciera naturellement.

### 5.3 `chip-checkbox` dans training-tag.css

Le composant `chip-checkbox` est défini dans `training-tag/training-tag.css` sans dossier propre. **Proposition : extraire** dans `components/chip-checkbox/chip-checkbox.css` + mettre à jour `main.css` + supprimer de `training-tag.css`. Confirmer avant action.

### 5.4 Unification de l'API tabs

Deux patterns coexistent :
- **patient.html** : `data-panel="panel-id"` sur trigger → `getElementById(trigger.dataset.panel)`
- **template.html** : `data-tab="panel-name"` sur trigger → `[data-panel="panel-name"]` sur le panel

**Proposition** : unifier sur le pattern de patient.html (`data-panel` pointe un `id`). Modifier template.html et le futur `tabs.js`. Confirmer avant action.

### 5.5 `session-module-bar` couleurs dynamiques

Les `.session-module-bar` utilisent `style="background-color:var(--training-X-200)"`. Utiliser `var()` est correct, mais l'inline reste. **Proposition** : introduire un attribut `data-training="phonemix"` + règles CSS `[data-training="phonemix"] { background-color: var(--training-phonemix-200) }` dans `session-grid.css`. Confirmer avant action.

### 5.6 Couplage `.filter-row` / composants

```css
/* theme.css */
.filter-row .input-group { flex: 1; min-width: 0; }
.filter-row .select      { width: auto; flex-shrink: 0; }
```

Ces règles couplent la classe de layout `.filter-row` aux composants `.input-group` et `.select`. **Proposition** : supprimer ces règles et laisser les développeurs gérer via des classes utilitaires ou des attributs `style` locaux dans le contexte du filter-row. Confirmer avant action.

### 5.7 Sélecteur global dans theme.css

`tbody tr[data-href] { cursor: pointer }` est dans theme.css mais relève du composant `table`. **Proposition** : déplacer dans `table/table.css`. Confirmer avant action.

### 5.8 KPI cards template.html → composant `.stat`

Les 4 cartes KPI de template.html (section 2) utilisent inline `font-size:2rem` et `flex:1`. **Proposition** : les remplacer par `.stat-group.card > .stat`. Confirmer avant action.

### 5.9 Navigation `index.html` — 8 composants manquants

Aucune des 8 previews créées n'est encore accessible depuis la navigation de `index.html`. **Proposition** : ajouter une section "Application" dans le nav avec les liens vers les 8 composants et les sections `[data-page]` correspondantes. Confirmer avant action.

---

## 6. Plan de remédiation priorisé

### Priorité 1 — Bloquants (qualité / bugs)
- [x] ~~IDs dupliqués firstLogin.html~~ (corrigé)
- [x] ~~`--header` hors theme.css~~ (corrigé)
- [x] ~~Dark mode tokens manquants~~ (corrigé)
- [x] ~~Training colors HEX~~ (corrigé)

### Priorité 2 — Structurel (JS + previews)
- [x] ~~8 previews HTML manquantes~~ (corrigé)
- [ ] Créer les fichiers `.js` structurés (dropdown, tabs, toast, form, table, sortable, program) — §5 §6.2
- [ ] Charger ces JS dans les previews et les screens au lieu du code inline

### Priorité 3 — Cohérence API
- [ ] Valider et appliquer unification `data-panel` pour les tabs (§5.4)
- [ ] Valider et extraire `chip-checkbox` en dossier propre (§5.3)
- [ ] Ajouter les 8 composants dans la nav de `index.html` (§5.9)
- [ ] Valider suppression de `.page-app__section-start` / `.page-app__section-end` (§5.1)

### Priorité 4 — Polissage
- [ ] Remplacer KPI cards inline par `.stat` dans template.html (§5.8)
- [ ] Réduire les styles inline dans template.html et patient.html (§3.3, §3.4)
- [ ] Introduire `data-training` pour session-module-bar (§5.5)
- [ ] Découpler `.filter-row` de ses composants (§5.6)
- [ ] Déplacer `tbody tr[data-href]` dans table.css (§5.7)
- [ ] Ajouter `table-wrapper` dans dashboard.html (§4.3)
