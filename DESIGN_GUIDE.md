# SMBC Application UI Guide

**Version:** 0.3
**Scope:** this React + TypeScript repository  
**UI foundation:** DevExtreme 26.1.4, Fluent Blue Light Compact
**Visual reference:** SMBC EMEA

## 1. Purpose

This repository defines a reusable SMBC application theme and a development
reference page. It translates the restrained SMBC EMEA visual language into a
compact, accessible interface for operational applications.

The public EMEA site is a visual reference, not a component specification.
Approved internal SMBC standards take precedence over this guide.

The intended result is a coherent SMBC application in which DevExtreme is the
widget layer—not a default DevExtreme application recoloured green.

## 2. Sources of truth

Use this order when implementation details conflict:

1. Approved internal SMBC standards.
2. `../devextreme-theme/src/tokens.css` for reusable visual values.
3. Reusable components in `../smbc-ui`, application layouts in `src/styles`, and DevExtreme overrides in
   `../devextreme-theme/src/overrides.css`.
4. `/design-system` for rendered states and regression review.
5. Page-specific styles only for local layout constraints.

Rules:

- Components consume semantic tokens, not palette primitives.
- Do not introduce a colour, spacing value, radius, shadow, or font size when a
  suitable token already exists.
- Keep responsive breakpoints and truly one-off dimensions local to the owning
  component.
- Do not duplicate shared theme corrections in reference-page CSS.

## 3. Current application structure

```text
src/
  main.tsx
  index.css
  app/
    App.tsx
    router.tsx
    RootLayout.tsx
    GlobalHeader.tsx
    global-header.css
  design-system/
    DesignSystemPage.tsx
    components/
      Section.tsx
      section.css
    data/
    sections/
    design-system.css
  styles/
    smbc-shell.css
    typography.css
    layout.css
    components.css
    pages.css
    index.css
../devextreme-theme/  # separate sibling project, not application source
  src/
    tokens.css
    fonts.css
    styles.css
    dx.smbc.css
    overrides.css
    viz.ts
    assets.ts
    index.ts
  assets/
    fonts/
    smbc-logo.svg
    favicon.ico
  theme/smbc-theme.metadata.json
  scripts/
  dist/  # generated runtime package
```

### Directory responsibilities

| Path | Owns | Must not own |
|---|---|---|
| `../devextreme-theme/` | Brand and semantic tokens, ThemeBuilder input/output, global DevExtreme corrections, and the chart palette bridge | Application shell layout, page composition, reference-page demos, or one-off component dimensions |
| `src/styles/` | Application-level primitives and reusable `.app-*` patterns | Brand palette definitions, generated vendor CSS, or styles used only by `/design-system` |
| `src/app/` | Routing, the root shell, global navigation, and application-specific React components | Theme generation or reference-page examples |
| `src/design-system/` | The development reference page, demonstrations, regression surface, and demo fixtures | Production business components or the canonical implementation of a shared style |
| `../devextreme-theme/assets/` | Locally bundled fonts and other static brand assets | Remote asset references or component styles |

### Theme ownership

`../devextreme-theme/src/tokens.css` contains reusable visual decisions: palette primitives,
semantic colours, type scale, spacing, shape, borders, shadows, motion, and
focus roles. Components consume semantic tokens whenever one exists. A value
belongs here only when changing it should consistently affect multiple
components or application surfaces.

Layout dimensions owned by one component remain with that component. For
example, global-header dimensions live in `app/global-header.css`, application
shell dimensions live in `styles/layout.css`, and reference-page dimensions
live in `design-system/design-system.css`.

The remaining theme files have narrow responsibilities:

- `smbc-theme.metadata.json` is ThemeBuilder configuration updated by the theme
  synchronisation script;
- `dx.smbc.css` is generated vendor CSS and must never be edited manually;
- `overrides.css` contains shared corrections that cannot be
  expressed through the public DevExtreme API or ThemeBuilder metadata;
- `viz.ts` exposes semantic CSS colours to DevExtreme charts.

### Shared application-style ownership

`src/styles/index.css` is an import manifest only. It defines application-pattern
loading order and should not contain selectors. Fonts come from the package;
optional shell helpers load separately from `src/main.tsx`. Application files
are divided by purpose:

- `smbc-shell.css` owns optional SMBC sidebar/card helpers;
- `typography.css` owns the document baseline and reusable text helpers;
- `layout.css` owns reusable shell, page-header, grid, row, and stack patterns;
- `components.css` owns native reference-table scrolling, page feedback layouts
  and divider rules; reusable cards, fields, badges, filters, callouts, KPI
  blocks, empty states and table shells belong to `@smbc/ui`;
- `pages.css` owns compositions shared by a class of pages, such as review/detail
  splits and sticky workflow action bars.

Use `.app-*` for shared application patterns. A page-specific arrangement stays
co-located with its page until it has a stable meaning and at least one other
real consumer. File size alone is not a reason to promote local CSS into this
directory.

Small DevExtreme integration rules are allowed here when they apply only inside
an `.app-*` pattern, for example removing a nested grid border inside a table
shell. A correction to DevExtreme itself belongs in
`overrides.css`.

### Application ownership

`src/app` owns runtime composition. `App.tsx` installs the router,
`router.tsx` defines routes, and `RootLayout.tsx` provides cross-route structure.
React components in this directory may have co-located CSS when the rules belong
only to that component. `global-header.css`, for example, owns header structure,
responsive behaviour, and its private dimensions; it still consumes colours,
spacing, motion, and focus tokens from the theme.

### Design-system reference ownership

`src/design-system` documents and exercises the implementation; it does not
replace it. Its parts are divided as follows:

- `DesignSystemPage.tsx` composes navigation, page chrome, and section
  components;
- `components/Section.tsx` and its co-located `section.css` provide
  reference-page-only section framing;
- `sections/` contains one independently maintainable rendered example per
  topic, with interactive state kept in the section that owns it; a section may
  import co-located CSS for a rule private to that example;
- `data/*.json` contains serialisable demo fixtures and option lists only;
- `design-system.css` owns `.ds-*` page chrome, demo layouts, visual samples,
  responsive behaviour, and scoped adjustments needed to present examples.

Do not import `design-system/data` or `.ds-*` classes into production
application code. Keep mappings, event handlers, component configuration, and
TypeScript types in `.ts`/`.tsx`; use JSON only for static data that contains no
behaviour. If a useful pattern first appears in the reference page, implement it
under `src/styles` or as a production component, then make the reference page
consume that shared implementation.

### Placement decision

When adding a style, use this order:

1. Use an existing semantic token or shared `.app-*` pattern.
2. If it is a reusable visual value, add it to `theme/tokens.css`.
3. If it is a reusable application structure, add it to the appropriate file
   under `styles/`.
4. If it corrects DevExtreme globally and cannot be configured through its API
   or ThemeBuilder, add the smallest possible rule to
   `overrides.css`.
5. Otherwise keep it with the owning application component or page.
6. Keep reference-only presentation under `design-system/` even when that file
   is relatively large.

Selector prefixes communicate the same ownership boundary:

- `--color-*`, `--space-*`, and similar semantic custom properties are theme
  tokens;
- `.app-*` is a reusable application contract;
- `.ds-*` is private to the design-system reference;
- component-specific selectors such as `.global-header*` stay with their React
  component;
- `.dx-*` selectors outside a scoped `.app-*` or `.ds-*` container belong only
  in the shared DevExtreme override layer.

Routes:

- `/` redirects to `/design-system`.
- `/design-system` renders the component and token reference.

All routes render inside `RootLayout`, which provides the skip link and global
header. `index.html` must retain:

```html
<body class="dx-viewport">
  <div id="root"></div>
</body>
```

## 4. Style loading and generation

`src/main.tsx` loads styles in this order:

1. `@smbc/ui/styles.css`, then application styles, preserving the original position before vendor CSS.
2. `@smbc/devextreme-theme/styles.css`: fonts, tokens, generated DevExtreme theme,
   then shared overrides.
3. Application-owned optional SMBC shell helpers.
4. Explicit `registerSmbcVizPalette()` and package favicon initialization.
5. Minimal application-root CSS.

`dx.smbc.css` is generated and must not be edited manually. ThemeBuilder
metadata and the generated theme remain under source control.

When a mapped token or ThemeBuilder setting changes, run:

```bash
npm --prefix ../devextreme-theme run theme:build
```

This synchronises metadata from `../devextreme-theme/src/tokens.css` before regenerating the
theme. The `devextreme` and `devextreme-themebuilder` versions must remain
compatible. Regeneration updates package source only: run `npm pack` in that
project and reinstall its archive here to update the reference application.

## 5. Typography and local assets

All brand assets load locally; production must not request Typekit or the SMBC
website.

- Myriad Pro is the default family for application text, navigation, controls,
  grids, and operational headings.
- Local Myriad Pro files provide weights 300, 400, and 700.
- Capitolium 2 Bold is reserved for `.app-display-title` and
  `.app-display-heading`; this is the approved application display exception,
  not a general-purpose second UI family.
- Arial and Georgia remain fallbacks only.
- Import `smbcLogoUrl` and `smbcFaviconUrl` from
  `@smbc/devextreme-theme/assets`; do not redraw or remotely embed them.
- Align body text left and use sentence case for headings and labels. Do not
  force uppercase navigation labels or eyebrow text.
- Trajan is not an application font and is reserved for the company name or
  logo in source-controlled brand artwork.

Current type scale:

| Role | Token | Size |
|---|---|---:|
| Caption | `--font-size-xs` | 12px |
| Label/dense UI | `--font-size-sm` | 13px |
| Standard UI | `--font-size-md` | 14px |
| Panel heading | `--font-size-lg` | 16px |
| Section heading | `--font-size-xl` | 20px |
| Page title | `--font-size-2xl` | 24px |
| Display title | `--font-size-3xl` | 30px |

Use sentence case, short labels, and explicit action verbs such as “Approve
payment” or “Clear filters”.

Application copy uses lining proportional figures by default. Data tables use
lining tabular figures so numeric columns retain stable digit widths.

## 6. Colour contract

Palette primitives live at the top of `tokens.css`. Components use semantic
roles such as the following:

| Role | Current value | Use |
|---|---:|---|
| `--color-page-background` | `#F6F8F6` | Application canvas |
| `--color-surface-default` | `#FFFFFF` | Cards, editors, overlays |
| `--color-surface-alternate` | `#FBFCFB` | Alternate grid rows |
| `--color-text-primary` | `#1F2522` | Primary content |
| `--color-text-secondary` | `#68716C` | Supporting content |
| `--color-border-default` | `#D8DDD9` | Decorative separators |
| `--color-border-control` | `#7F8C85` | Interactive boundaries |
| `--color-action-primary` | `#004831` | Primary actions and links |
| `--color-header-background` | `#004831` | Global header |
| `--color-action-accent` | `#C4D600` | Fresh Green accent |

The theme also exposes the documented Traditional Green tint scale and the nine
approved supplementary colours as palette primitives. They are reference
values, not permission to decorate application surfaces indiscriminately.

The supplied brand photograph lists Fresh Green as `#C4D700`; the application
retains its existing `#C4D600` value until the original digital brand source is
available for confirmation. Do not alter the checked-in logo to reconcile this
photographic discrepancy.

Feedback roles remain semantic; approved corporate colours are used where their
meaning and contrast fit the state:

| State | Token | Value |
|---|---|---:|
| Success | `--color-feedback-success` | `#007A52` |
| Warning | `--color-feedback-warning` | `#A95A00` |
| Error | `--color-feedback-danger` | `#C3272B` (Pure Crimson) |
| Information | `--color-feedback-info` | `#317589` (Chigusa) |

Fresh Green is an accent, not a default button background or universal success
colour. Use dark text—not white—when Fresh Green is a large filled surface.
Business state must always include text or another non-colour cue.

## 7. Spacing, shape, and motion

Use the shared 4px-based spacing scale with a 2px half-step:

```text
2, 4, 8, 12, 16, 20, 24, 32, 40, 48px
```

Defaults:

- label to control: 4px;
- related controls: 8–12px;
- card padding and card gaps: 16px;
- section spacing: 24–32px;
- desktop gutters: 24–32px;
- narrow gutters: 12–16px.

Controls use a 3px radius, cards and dialogs 6px, and large containers at most
8px. Prefer borders to shadows; reserve stronger elevation for overlays.

Motion tokens are 120ms for small interactions and 180ms for structural
transitions. Every animation must respect `prefers-reduced-motion`.

## 8. Shell and navigation

The global EMEA-style header is semantic React/HTML, not a DevExtreme Toolbar.
Use DevExtreme for application widgets, not for structural branding.

Current header behaviour:

- local SMBC logo aligned near the left edge;
- sticky at the top of the viewport;
- hides after scrolling down beyond its height;
- returns on upward scroll, keyboard focus, or near the top of the page;
- remains visible while the mobile menu is open;
- collapses to a menu below 760px;
- disables transitions for reduced-motion users.

The header publishes `--sticky-header-offset` on `#main-content`. Sticky page
elements consume that custom property instead of coupling header CSS to a page
class. The document uses `scroll-padding-top` for the header offset when navigating to
hash targets. Do not add the same offset as `scroll-margin-top` on targets;
the two offsets accumulate.

A dark sidebar is an optional operational pattern, not a corporate requirement.
Use it only when the information architecture needs persistent module
navigation.

## 9. DevExtreme integration

Prefer, in order:

1. DevExtreme component API.
2. ThemeBuilder metadata.
3. Shared application pattern.
4. `overrides.css`.
5. Page-specific override as a last resort.

Shared overrides currently integrate typography, editors, buttons, selection
controls, DataGrid/TreeList, pager, tabs, lists, overlays, calendar and progress.
Optional dark sidebar helpers remain in application `smbc-shell.css`.

Important editor rules:

- outlined editors use `--color-border-control` at rest;
- hover uses Trad Green;
- focus is one continuous inset 2px outline, not stacked borders;
- the Fluent outlined-editor `::before` accent is disabled;
- invalid focused editors use the danger colour;
- read-only and disabled states remain distinct.

Do not colour `.dx-loadindicator-segment`: DevExtreme builds its spinner from
transformed segments, and a background override produces a rotating square.

After any DevExtreme upgrade, regenerate the theme and review every section of
`/design-system`.

## 10. Application patterns

Use the shared `.app-*` patterns before creating new local equivalents:

- layout: shell, sidebar, top bar, content, page header, grids, rows, stacks;
- content: cards, toolbars, filters, details, KPI blocks, tables;
- state: badges, callouts, loading, empty states, action bars;
- typography: labels, captions, muted text, display headings.

Use `@smbc/ui` Button, editors, DataGrid, Tabs, Dialog, Toast and
LoadingIndicator. Advanced grid and validation configuration use explicit UI
subpaths. ChartsSection is the sole approved direct DevExtreme React import.

Forms:

- place labels above controls;
- connect native editor inputs with `htmlFor` and `inputAttr.id`;
- use `aria-labelledby` for composite widgets such as RadioGroup;
- expose required and invalid state programmatically;
- keep validation beside the affected control;
- do not use a toast for field validation.

Buttons:

- one dominant primary action per action group where practical;
- outlined or text styling for secondary actions;
- danger styling for destructive actions;
- icon-only buttons require an accessible name;
- dark-surface hover/focus/active states must retain readable inverse text.

Data grids:

- use the compact theme; never scale with `zoom` or `transform`;
- use semantic surface tokens for headers, alternate rows, hover, and selection;
- make horizontal rules more prominent than vertical rules and avoid a heavy
  box around every cell;
- use the 70% Traditional Green tint for the emphasized header rule while
  keeping header and row fills light enough for interactive states;
- use lining tabular figures in grid cells and proportional figures in body
  copy;
- right-align numeric values and format dates/currencies consistently;
- expose only frequent row actions and move the rest into an overflow menu;
- distinguish loading, empty data, and no filter results.

Feedback:

- inline messages belong to a field or section;
- banners communicate important page-level information;
- toasts confirm completed, non-critical operations;
- keep existing data visible during background refresh when unambiguous;
- empty states explain the situation and offer a relevant next action.

Charts read their palette from CSS semantic tokens through
`viz.ts`. Use feedback colours when values carry semantic meaning,
and do not rely on colour alone to distinguish data.

## 11. Accessibility baseline

Target WCAG 2.2 AA.

- Every interactive element must be keyboard-operable.
- Every control must have a programmatic accessible name.
- Icon-only controls need `aria-label`/`elementAttr` in addition to a tooltip.
- Normal text targets 4.5:1 contrast; large text and essential control boundaries
  target 3:1.
- Meaning is never communicated by colour alone.
- Controls should normally provide at least a 32×32px target; never fall below
  the applicable WCAG 24×24px requirement without a valid exception.
- Support 200% text enlargement and reflow at a 320 CSS-pixel viewport.
- Keep complex-table horizontal scrolling inside the table container.
- Sticky content must not obscure keyboard focus.
- Respect reduced-motion preferences.

Focus colours are contextual and opaque:

```css
/* Light surface */
--focus-ring-color: var(--focus-ring-color-on-light); /* Trad Green */

/* Dark surface */
--focus-ring-color: var(--focus-ring-color-on-dark);  /* Fresh Green */
```

Native links/buttons and shared DevExtreme controls consume
`--focus-ring-color`. Dark containers override only that semantic context
variable. Focus demonstrations must not rely on page-specific rules that hide a
defect in the shared theme.

## 12. Responsive baseline

Shared application styles currently use 1100px, 980px, and 760px breakpoints
according to the owning layout. The reference page uses 1200px, 900px, and
620px for its own layout.

At narrow widths:

- grids and forms collapse to fewer columns;
- actions wrap;
- the global navigation becomes a menu;
- side navigation becomes non-sticky and horizontally scrollable;
- DataGrid remains inside its horizontal-scroll container.

Breakpoints are layout tools, not minimum accessibility widths.

## 13. Change checklist

Before considering UI work complete, confirm:

- each new style and demo fixture lives in the layer that owns it;
- semantic tokens are used and no duplicate local theme rule was added;
- DevExtreme APIs were preferred over internal CSS selectors;
- default, hover, focus, active, invalid, disabled, and read-only states work;
- form labels and icon-only actions have accessible names;
- text, boundaries, and focus indicators have sufficient contrast;
- colour is not the only state cue;
- loading, empty, no-results, validation, and error states are appropriate;
- keyboard, zoom, narrow layouts, sticky content, and reduced motion were tested;
- `/design-system` still represents the shared implementation;
- local logo, favicon, and fonts generate no external runtime requests.

Run the repository checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## 14. Fixes backported from SwiftReview (September 2026)

Shared presentation fixes were compared against SwiftReview commit `4899560`.
The relevant source changes are `ea203fe` (sidebar selection), `b123d92`
(table sizing), and `21ef888` (TagBox, native tables, feedback, touch and anchors).

- DevExtreme, its React wrappers and ThemeBuilder use the same pinned version,
  26.1.4. Rebuild the generated theme with `npm --prefix ../devextreme-theme run theme:build`.
- TagBox checkbox dropdowns are capped at 520px and constrained to the viewport.
  Select-all spacing and selected-item colours use shared overrides.
- Sidebar navigation selection styling excludes lists with selection checkboxes.
- Table shells can shrink inside grid/flex layouts; empty DataGrid filler rows
  collapse. Native tables use `.app-table-scroll` inside `.app-table-shell`,
  with a labelled, keyboard-focusable scroll region as shown in the reference.
- `.app-page-loading` and `.app-page-error` provide shared feedback layouts;
  `.app-page--wide` allows full-width application pages.
- Touch interaction, balanced headings and document-level anchor spacing are
  shared. The tap highlight is exposed through `--color-action-tap-highlight`.
- The mobile header uses the smaller logo and compact padding from SwiftReview.

The reference retains its own navigation and scroll-aware header. SwiftReview's
authentication, routing, review-stage colours, message actions and administrative
page layouts belong to the consuming application and are not copied here.

## 15. Theme package ownership

The canonical theme source is the standalone `../devextreme-theme` project. Its runtime
exports and internal-registry instructions are documented in
[`../devextreme-theme/README.md`](../devextreme-theme/README.md).
The demo installs `@smbc/devextreme-theme` from a local versioned `.tgz` archive
and consumes its exports, including logo and favicon; there are
no duplicate application-owned brand files. Package JS imports are side-effect
free. Palette registration happens explicitly after loading the CSS.

Global typography helpers, shell layouts, pages, navigation and reference demos
remain application responsibilities. Reusable components live in `../smbc-ui`. The theme package includes no React code.
In `../devextreme-theme`, `npm run pack:check` verifies the runtime tarball
contract and `npm test` verifies an installed tarball with Node and Vite.
Run `npm pack` there and reinstall the generated archive in this application
after changing the theme. See the application README for the update workflow.
Application `dev`, `typecheck` and `build` use the installed archive; they do not
compile the theme or depend on a source workspace.

## 16. Component library ownership

`../smbc-ui` is the separate `@smbc/ui@0.1.0` source project. The application
installs its packed archive rather than using source aliases. Use its semantic
props, React callbacks and compositional primitives. Do not recreate their
private `smbc-ui-*` classes in the application. Reference-only layout classes
may be passed via className. `Field` supplies label/help/error relationships;
advanced DevExtreme rules remain available under `@smbc/ui/validation`.

New reusable components belong in that package and must be exercised here in
the same release cycle. Shell, routing and business workflows remain outside it.
See [the package README](../smbc-ui/README.md) and
[the migration report](docs/smbc-ui-migration.md). This ownership supersedes
older examples above that suggest promoting reusable component CSS to src/styles.
