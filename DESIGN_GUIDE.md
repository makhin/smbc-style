# SMBC Application UI Guide

**Version:** 0.4 (24 September 2026)
**Scope:** the React + TypeScript reference application and applications adopting the shared packages
**UI foundation:** DevExtreme 26.1.4, Fluent Blue Light Compact
**Visual reference:** SMBC EMEA

## 1. Purpose

This project consumes `@smbc/devextreme-theme` and `@smbc/ui` and provides
the application shell and development reference page. The reusable theme and
components are maintained in separate sibling projects. The reference translates
the restrained SMBC EMEA visual language into a compact, accessible interface
for operational applications.

The public EMEA site is a visual reference, not a component specification.
Approved internal SMBC standards take precedence over this guide.

The intended result is a coherent SMBC application in which DevExtreme is the
widget implementation behind the shared `@smbc/ui` API.

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
../smbc-ui/          # separate React component library
  src/components/
  src/data-grid/
  src/validation/
  src/styles/
  scripts/
  tests/
  dist/             # generated runtime package
```

### Directory responsibilities

| Path | Owns | Must not own |
|---|---|---|
| `../devextreme-theme/` | Brand and semantic tokens, ThemeBuilder input/output, global DevExtreme corrections, and the chart palette bridge | Application shell layout, page composition, reference-page demos, or one-off component dimensions |
| `../smbc-ui/` | Reusable React controls, component composition, accessibility wiring, component CSS and explicit vendor configuration exports | Brand tokens, fonts, routing, business workflows or application navigation |
| `src/styles/` | Application-level layout and reusable `.app-*` patterns | Brand palette definitions, generated vendor CSS, or styles used only by `/design-system` |
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

Component-specific integration rules, such as removing a grid border inside
`TableShell`, belong to `@smbc/ui`. A correction to DevExtreme shared across
applications belongs in the theme `overrides.css`. Application CSS may scope
layout adjustments to its own containers; it must not duplicate either layer.

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
in `@smbc/ui` when it is a reusable component, or under `src/styles` when it
is application layout, then make the reference page consume that implementation.

### Placement decision

When adding a style, use this order:

1. Use an existing `@smbc/ui` component, semantic token or application layout.
2. Put reusable visual values in `../devextreme-theme/src/tokens.css`.
3. Put reusable component behaviour and styles in `../smbc-ui/src`.
4. Put shared application layout under `src/styles/`.
5. Put global vendor corrections in `../devextreme-theme/src/overrides.css`
   only when component configuration or ThemeBuilder cannot express them.
6. Keep local page layout with its owner and reference-only presentation under
   `src/design-system/`.

Selector prefixes communicate the same ownership boundary:

- `--color-*`, `--space-*`, and similar semantic custom properties are theme
  tokens;
- `.smbc-ui-*` is private to the component library; consume its public props;
- `.app-*` is a reusable application layout contract;
- `.ds-*` is private to the design-system reference;
- component-specific selectors such as `.global-header*` stay with their React
  component;
- `.dx-*` integration selectors belong to the theme or UI component that owns
  the correction; scoped application selectors are only for local layout.

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

`src/main.tsx` uses the following CSS import order:

```ts
import '@smbc/ui/styles.css';
import './styles/index.css';
import '@smbc/devextreme-theme/styles.css';
import './styles/smbc-shell.css';
import './index.css';
```

The application-style manifest loads typography, layout, component-level
application helpers and page patterns in that order. The theme entry loads
fonts, tokens, generated DevExtreme CSS and shared overrides. Component and
reference-page styles also load through their owning modules.

Keep this tested cascade when adopting the reference. Do not additionally load
stock DevExtreme themes or copied theme CSS. `@smbc/ui/styles.css` does not import
the theme; both package entries are required. Logo and favicon URLs come from
`@smbc/devextreme-theme/assets`. Favicon initialization is browser code, not a
CSS loading stage. This application has no charts or palette registration.

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

1. Public `@smbc/ui` props and component composition.
2. Typed `devExtremeProps` for options the wrapper does not own.
3. Extend `@smbc/ui` when a reusable capability is missing.
4. ThemeBuilder metadata for shared vendor appearance.
5. Shared theme overrides for corrections that configuration cannot express.

Application source must not import `devextreme` or `devextreme-react`, including
subpaths and vendor-only types. Keep vendor imports inside the shared packages.
The application still installs both runtimes to satisfy peer dependencies.
ESLint restricts static imports without exceptions; review dynamic imports,
`require()` and string-based widget creation separately. Do not bypass the rule
with `widget="dxButton"` or an equivalent `items` configuration.

There is no Chart wrapper or chart section in the current reference. A new
chart requirement needs an explicit shared API before application integration.
The theme package still owns its optional visualization API; that does not
create a direct-import exception in this application.

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

Use `@smbc/ui` for cards, toolbars, filters, fields, badges, callouts, KPI
blocks, empty states and table shells. Use `.app-*` for shell layout, page
headers, grids, rows, stacks, detail lists, native table scrolling, page
loading/error layouts, sticky action bars and typography. The global header
and navigation remain application-owned semantic HTML.

Use `@smbc/ui` Button, editors, DataGrid, Tabs, Dialog, Toast and
LoadingIndicator. Advanced grid and validation configuration use explicit UI
subpaths. Direct `devextreme-react` and `devextreme` imports are prohibited,
including subpaths; there are no chart exceptions.

Forms:

- place labels above controls;
- wrap one editor in `Field` to supply label, help and error associations;
- use `Field id` for a stable identifier; the wrapper wires the native input or
  composite root, including RadioGroup;
- outside Field, use `ariaLabel`, or Checkbox `label`, for an accessible name;
- expose required and invalid state programmatically;
- keep validation beside the affected control;
- do not use a toast for field validation.

Buttons:

- one dominant primary action per action group where practical;
- outlined or text styling for secondary actions;
- danger styling for destructive actions;
- icon-only `Button` requires `ariaLabel`; its `onClick()` callback takes no
  vendor event;
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

## 11. Accessibility baseline

Target WCAG 2.2 AA.

- Every interactive element must be keyboard-operable.
- Every control must have a programmatic accessible name.
- Icon-only `Button` uses `ariaLabel`; a tooltip alone is not an accessible name.
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
- public UI props and typed vendor extensions were preferred over internal CSS;
- no direct vendor imports or string-created vendor widgets were introduced;
- Toolbar actions use our Button in both regular and overflow templates;
- default, hover, focus, active, invalid, disabled, and read-only states work;
- form labels and icon-only actions have accessible names;
- text, boundaries, and focus indicators have sufficient contrast;
- colour is not the only state cue;
- loading, empty, no-results, validation, and error states are appropriate;
- keyboard, zoom, narrow layouts, sticky content, and reduced motion were tested;
- `/design-system` still represents the shared implementation;
- local logo, favicon, and fonts generate no external runtime requests.

Run the project checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## 14. Theme package ownership

The canonical theme source is the standalone `../devextreme-theme` project. Its runtime
exports and internal-registry instructions are documented in
[`../devextreme-theme/README.md`](../devextreme-theme/README.md).
The demo installs `@smbc/devextreme-theme` from a local versioned `.tgz` archive
and consumes its exports, including logo and favicon; there are
no duplicate application-owned brand files. Package JS imports are side-effect
free. This application does not render charts or register a chart palette.

Global typography helpers, shell layouts, pages, navigation and reference demos
remain application responsibilities. Reusable components live in `../smbc-ui`. The theme package includes no React code.
In `../devextreme-theme`, `npm run pack:check` verifies the runtime tarball
contract and `npm test` verifies an installed tarball with Node and Vite.
Run `npm pack` there and reinstall the generated archive in this application
after changing the theme. See the application README for the update workflow.
Application `dev`, `typecheck` and `build` use the installed archive; they do not
compile the theme or depend on a source workspace.

## 15. Component library ownership

`../smbc-ui` is the separate `@smbc/ui@0.1.0` source project. The application
installs its packed archive rather than using source aliases. Use its semantic
props, React callbacks and compositional primitives. Do not recreate their
private `smbc-ui-*` classes in the application. Reference-only layout classes
may be passed via className. `Field` supplies label/help/error relationships;
advanced DevExtreme rules remain available under `@smbc/ui/validation`.

New reusable components belong in that package and must be exercised here in
the same release cycle. Shell, routing and business workflows remain outside it.
See [the package README](../smbc-ui/README.md) for API details. The
current code and contracts below take precedence over historical examples.

### Public API boundaries

The wrappers expose selected semantic props at the top level. Additional vendor
options go through typed `devExtremeProps`; this is not a one-to-one copy of all
DevExtreme props. Wrapper-owned options are excluded from that object, and some
behaviours are deliberately fixed. Do not cast to `any` to override them.

`@smbc/ui/data-grid` exposes six configuration aliases: `DataGridColumn`,
`DataGridFilterRow`, `DataGridHeaderFilter`, `DataGridPager`, `DataGridPaging`,
and `DataGridSelection`. `@smbc/ui/validation` exposes `Validator`,
`RequiredRule`, `EmailRule`, `RangeRule`, `ValidationGroup` and
`ValidationSummary`. These are explicit vendor configuration exports, not a
vendor-independent abstraction or the complete DevExtreme configuration API.

`Card`, `FilterPanel`, `TableShell`, `StatusBadge`, `Callout`, `KpiCard` and
`EmptyState` are HTML-based library components. `Toolbar` wraps DxToolbar and
uses its layout and theme. Do not replace it with application flex styles.

### Toolbar composition

Use `Toolbar.Item` to place content. `Toolbar.Group` is an HTML flex container
inside an item template; it is no longer a direct child of Toolbar. Give each
action its own item when it should move independently into the overflow menu.
Use our `Button` in both templates, without `widget="dxButton"` or vendor
button `options` objects:

```tsx
import { Button, Toolbar } from '@smbc/ui';

function PaymentToolbar({ refresh }: { refresh: () => void }) {
  const renderRefresh = () => (
    <Button icon="refresh" onClick={refresh}>Refresh payments</Button>
  );

  return (
    <Toolbar>
      <Toolbar.Item
        location="before"
        render={() => <Toolbar.Group>Payments</Toolbar.Group>}
      />
      <Toolbar.Item
        location="after"
        locateInMenu="auto"
        render={renderRefresh}
        menuItemRender={renderRefresh}
      />
    </Toolbar>
  );
}
```

`locateInMenu="auto"` moves an item when space runs out; `"always"` keeps it in
the menu. For disabled actions, set both the item and Button to `disabled`.
The current custom Button templates leave the menu open after an action;
clicking outside dismisses it. If a workflow requires automatic dismissal,
implement and verify that behaviour through a shared public API rather than
querying private `.dx-*` DOM or calling undocumented instance methods.

The wrapper also accepts `items`, `width`, `disabled` and `devExtremeProps`.
Prefer item templates for React actions. API availability does not authorize
applications to construct vendor widgets through string names.


## 16. Migrating applications to the theme and UI packages

Migrate in reviewable stages, keeping business behaviour stable. Installing the
theme changes the appearance of existing DevExtreme controls; installing the UI
package does not automatically replace those controls. An application using a
different UI library needs an explicit component migration as well.

### 16.1 Inventory and compatibility

Before changing imports, record:

- React, React DOM and DevExtreme versions, bundler and rendering model;
- stock themes, copied generated CSS, font services, brand assets and resets;
- direct vendor controls, nested configuration components, instance calls,
  `widget` strings and CSS selectors coupled to vendor markup;
- value types, event timing, validation ownership, date serialization and
  selection behaviour for critical forms and grids;
- representative screens and states for visual and interaction comparison.

The current package contract is React/React DOM `^19.2.8`,
DevExtreme/DevExtreme React `~26.1.4`, and theme `^0.1.0`. This reference pins
both DevExtreme runtimes to `26.1.4`. UI v0.1 targets browser React with an ESM
bundler; Node SSR is not a supported target. An older React application or a
server-rendered application needs a separate compatibility plan. Do not bypass
peer conflicts with `--force` or `--legacy-peer-deps`.

Map unsupported controls before converting screens. Add reusable capabilities
to `@smbc/ui` and exercise them in this reference. Do not silently remove
features, copy library source into the application, or add new direct-import
exceptions to fill an API gap. Existing charts need their own migration
assessment; removing the reference chart is not a recommendation to delete
business charts from another application.

### 16.2 Install reproducible package versions

If the approved releases are available in your internal registry, configure the
`@smbc` scope there and install the compatible set:

```bash
npm install @smbc/devextreme-theme@0.1.0 @smbc/ui@0.1.0 devextreme@26.1.4 devextreme-react@26.1.4 react@19.2.8 react-dom@19.2.8
```

For sibling-project development, build the theme archive first, then the UI
archive, and explicitly install both in the consumer:

```bash
# From smbc-style; theme dependencies must already be installed.
cd ../devextreme-theme
npm run check
npm pack
cd ../smbc-ui
npm ci --include=dev
# First browser setup only:
npx playwright install chromium
npm run check
npm pack
cd ../smbc-style
npm install ../devextreme-theme/smbc-devextreme-theme-0.1.0.tgz ../smbc-ui/smbc-ui-0.1.0.tgz
```

For another application, substitute its directory and archive paths. Use
installed packages, not aliases into sibling `src` or `dist`. Repack and reinstall
when source changes, even if local archive filenames still contain `0.1.0`.
Commit manifest and lockfile updates as applicable and make matching archives
available wherever CI resolves `file:` dependencies. Do not overwrite an
already published release with different contents; publish a new version.

Install development dependencies at the npm workspace root when the consumer
belongs to a workspace. The UI build supports dependencies hoisted to an
ancestor `node_modules`. Do not rely on a globally installed TypeScript.

### 16.3 Replace the theme layer once

Use the CSS imports from section 4 and retain `dx-viewport` on the body or
intended themed container. Remove the old stock DevExtreme theme import and
copied theme/font definitions when enabling the package. Loading two complete
themes on the same surface produces conflicting styles.

Move colours, spacing, typography, borders and focus styling to semantic token
references. Remove application overrides already provided by the shared theme;
keep application layout, routing, navigation and workflow CSS with the app.
Use package logo/favicon URLs instead of copied brand files or remote assets.
Do not edit generated CSS in `node_modules` or redefine package tokens merely
to reproduce a legacy screen.

Pilot on a representative form and grid. Theme CSS is global: a route-level
pilot does not isolate other routes from its effects. During gradual migration,
keep legacy UI styles scoped where possible and check adjacent screens for
cascade collisions. Do not copy the reference header, navigation or `.ds-*`
styles unless the application actually needs that composition.

### 16.4 Convert components and adapt their contracts

Replace one coherent screen or workflow at a time. Use this mapping as a
starting point; verify exact props against the installed UI types:

| Existing usage | Shared API / required adaptation |
|---|---|
| DevExtreme Button | `Button`; `text` becomes string children, `onClick()` has no vendor event, `useSubmitBehavior` becomes `submit`, use `variant` for styling |
| TextBox / TextArea | `TextInput` / `TextArea`; `onValueChanged(event)` becomes `onChange(value)` |
| NumberBox | `NumberInput`; cleared value is `null`, not always a number |
| SelectBox / TagBox | `Select` / `MultiSelect`; `items` → `options`, `displayExpr` → `optionLabel`, `valueExpr` → `optionValue`, search/clear flags → `searchable` / `clearable` |
| TagBox apply options | `applyMode="instant"` or `"buttons"`; `selectionControls` controls selection checkboxes |
| DateBox | `DatePicker` supports date mode; date/time modes need an explicit API decision |
| CheckBox / RadioGroup | `Checkbox` / `RadioGroup`; `label` for checkbox text, `options` and `orientation` for radio groups |
| Popup | `Dialog`; `visible` → `open`, `onHiding` → `onClose`, `hideOnOutsideClick` → `closeOnOutsideClick` |
| Confirmation / Toast | `ConfirmDialog` / `Toast`; the application owns open state and completion behaviour |
| DataGrid | `DataGrid` and `@smbc/ui/data-grid`; `onSelectionChange(keys)` replaces event-object handling |
| Toolbar | `Toolbar.Item` templates containing our controls; supply `menuItemRender` for menu actions |
| LoadIndicator | `LoadingIndicator`; `size` replaces width/height; wrap decorative loading in a textual status region |
| Copied card / field / badge CSS | `Card`, `Field`, `StatusBadge`, `Callout`, `FilterPanel`, `TableShell`, `KpiCard`, `EmptyState` as appropriate |

For example, convert an event-based text editor handler to a value callback:

```tsx
import { Field, TextInput } from '@smbc/ui';

function ReferenceField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field id="payment-reference" label="Reference" help="External payment reference">
      <TextInput value={value} onChange={onChange} />
    </Field>
  );
}
```

Do not retain `event.value` access inside the new callback. Use either controlled
`value` plus `onChange`, or uncontrolled `defaultValue`, without switching modes
during a mount. Preserve `null` semantics for NumberInput and Select. DatePicker
does not parse or convert values; timezone and API serialization stay app-owned.
The wrappers preserve vendor commit timing, normally change/blur. Set
`devExtremeProps={{ valueChangeEvent: 'input' }}` only when live updates are an
intentional requirement.

Keep common props such as `disabled`, `readOnly`, `placeholder`, numeric bounds
and formatting on the wrapper API. `devExtremeProps` is for supported extensions,
not for duplicating wrapper-owned props or injecting vendor components.

### 16.5 Migrate validation and composition

Use `Field` around one editor. It creates label/help/error associations; an
explicit `id` gives integrations a stable control identifier. `required` adds
accessible metadata and a marker but does not itself create a validation rule.

Choose one validation owner per control:

- External validation passes `error` to Field or the control. Passing the prop,
  even as `undefined` or an empty string, selects external ownership. Update it
  as server or form state changes.
- Vendor validation omits external `error` and imports rules and validators
  through `@smbc/ui/validation`. Keep validation summaries and submit behaviour
  consistent with the original workflow.

Use explicit grid configuration exports and stable row keys. Check selection,
filtering, paging, custom cells and server-data behaviour after conversion;
the wrapper does not implement the application's data-access policy. Retain
loading, empty, no-results and error states. Replace direct Toolbar.Group
children with item templates as shown in section 15.

### 16.6 Enforce the boundary and verify each stage

Once a migrated area uses the packages, restrict its direct imports of
`devextreme`, `devextreme/*`, `devextreme-react` and `devextreme-react/*` using the
rule in this project's `eslint.config.js`. Apply the rule to all application
source when migration is complete. Also review `widget`/`options` objects,
dynamic imports and private CSS access; passing lint alone does not prove that
all controls use the shared API.

Run the consumer's lint, type checks and production build. For shared-package
changes, run that package's `npm run check`, repack and test the installed
archive in the consumer. In the browser, verify:

- critical form submissions, value clearing, validation and unchanged payloads;
- grid selection, filters, paging and row actions;
- dialogs, focus return, keyboard navigation and accessible names;
- Toolbar buttons, disabled actions, overflow and menu dismissal;
- desktop and narrow layouts, including 320px, zoom and reduced motion;
- local fonts/icons/assets, supported deployment base paths and absence of
  duplicate theme loading.

The migration is complete when intended screens use the shared component API,
legacy duplicate styles/assets are removed, package versions are reproducible,
and business and accessibility checks pass. Keep each stage in a reviewable
commit so its code, package versions and lockfile can be rolled back together.
