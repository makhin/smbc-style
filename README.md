# SMBC Application UI

React application shell and design-system reference consuming
`@smbc/devextreme-theme` and `@smbc/ui`. The implementation standard and UI rules live in
[`DESIGN_GUIDE.md`](DESIGN_GUIDE.md).

## Installation and commands

The theme is installed from the local archive
`../devextreme-theme/smbc-devextreme-theme-0.1.0.tgz`, recorded in `package.json`
and `package-lock.json`. Ensure this archive exists next to the application
before installing dependencies. npm extracts it into `node_modules`; there is
no workspace or symlink to the theme's source project.

The UI package is installed from
`../smbc-ui/smbc-ui-0.1.0.tgz`; this sibling archive must also exist for `npm ci`.
Its source and API documentation live in [smbc-ui](../smbc-ui/README.md).

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

Application builds use the installed theme and do not regenerate it.

## Updating local packages

With all three repositories checked out as sibling directories, run:

```sh
npm run refresh:packages
```

The command installs and checks the theme, packs its checked output, reinstalls
that archive in UI, checks and packs UI, and installs both archives here. It then
runs a clean install, lint, typecheck and the production browser suite. Install
Chromium once with `npx playwright install chromium` before the first run.
Failures stop the sequence. Same-version tarball integrity is refreshed in the
consumer lockfiles; review and commit the updated locks with your changes.

This is development orchestration, not a workspace or a package source alias.
Individual repository build/check commands remain available. If a package
version changes, also review its peer dependency compatibility range.

Never manually edit generated `dx.smbc.css` or files under `node_modules`.

## Routes

- `/` — redirects to the design-system reference
- `/design-system` — component and token reference

All routes render inside `RootLayout`, which provides the shared EMEA-style
header. Routing, navigation and application composition belong to this app.

## Tailwind composition and CSS loading

Tailwind **4.3.3** and the official `@tailwindcss/vite` plugin compile local JSX
utilities. There is no Tailwind v3 configuration, CDN, `@apply` layout helper,
or Preflight. `src/main.tsx` imports only:

```ts
import './styles/app.css';
```

This entry loads all CSS with the tested layer order:

```css
@layer theme, base, vendor, components, utilities;
```

- `theme`: Tailwind compiler defaults; the SMBC bridge replaces palette/font/
  type/radius/shadow choices with semantic aliases through `@reference`.
- `base`: existing document baseline (box sizing, margins, native focus).
- `vendor`: theme fonts, canonical tokens, generated DevExtreme and overrides.
  Its compact typography still follows the baseline, preserving the old cascade.
- `components`: compiled `@smbc/ui/styles.css`, header animations and explicit
  reference vendor contexts.
- `utilities`: application layout and local composition in JSX.

Both package styles remain required, loaded inside `app.css` rather than as
additional JS imports. No stock theme is loaded. Only the application `src` tree is scanned (including future page folders). The UI archive supplies its own utilities;
**never add `@source` for `node_modules/@smbc/ui`**. Do not add token values to
the application. The standard Tailwind colour namespace is disabled.

Use `@smbc/ui` for semantic components and Tailwind for flex/grid, spacing,
responsive layout, typography and simple surfaces. Prefer `bg-primary`,
`bg-surface`, `text-fg`, `text-fg-muted` and `border-border` over palette classes.
For example:

```tsx
import { Button, Card, DataGrid } from '@smbc/ui';

export function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-fg">Payments</h1>
          <p className="mt-2 text-fg-muted">Review pending payments.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary">Refresh</Button>
          <Button variant="primary">Create</Button>
        </div>
      </header>
      <Card>
        <Card.Body><DataGrid dataSource={[]} keyExpr="id" /></Card.Body>
      </Card>
    </div>
  );
}
```

Custom CSS is appropriate for the hamburger/underline animations, dynamically
hidden header offsets and deliberate reference-specific vendor states. Simple
flex/grid/gap/padding does not need a named CSS class, `@apply`, or a new generic
layout component. The remaining files are `app.css`, `global-header.css` and
`reference-vendor.css`; obsolete `.app-*` and `.ds-*` layout helpers are gone.

### Responsive decisions

Use standard `sm` 640px, `md` 768px, `lg` 1024px and `xl` 1280px. The old 620/760
thresholds move to `sm`/`md`; the reference sidebar becomes horizontal below
`lg` instead of 900px. Four-column form/swatch and three-column KPI/state grids
wait until `xl` instead of 1100/1200px. These deliberate changes favour readable
content at intermediate widths. The old 980px review helper had no consumer and
was removed. There are no custom width breakpoints.

### Browser validation

```sh
# First browser setup only:
npx playwright install chromium
npm run test:reference
```

This builds and serves the production application, checks responsive reflow,
header navigation/hide/show, tokens and utility compilation, controls,
validation, filters, DataGrid, dialogs, keyboard focus and reduced motion.
Screenshots are written to ignored `artifacts/reference/` for visual review.

## Package API

```ts
import '@smbc/devextreme-theme/styles.css';
import { smbcLogoUrl, smbcFaviconUrl } from '@smbc/devextreme-theme/assets';
```

The package owns the canonical theme, semantic tokens, corporate fonts, logo,
favicon and chart palette API. See its [README](../devextreme-theme/README.md)
for favicon setup, direct asset exports and internal-use licensing.

## Typography and tokens

- Myriad Pro is the default for application text, controls and operational headings.
- Capitolium 2 is reserved for `font-brand` editorial/display headings.
- Fonts, logo and favicon load from bundled assets, without external font services.
- `../devextreme-theme/src/tokens.css` is the canonical source for palette,
  semantic roles, typography, spacing, borders, radii, focus, shadows and motion.
- Components consume semantic roles rather than palette primitives.
- ThemeBuilder metadata and visualization colours derive from the same tokens.

One-off content dimensions and responsive breakpoints remain local to their
components because they are layout constraints, not shared design decisions.

## Updating the component library

```sh
cd ../smbc-ui
npm ci
npm run check
npm pack
cd ../smbc-style
npm install ../smbc-ui/smbc-ui-0.1.0.tgz
npm run lint
npm run typecheck
npm run build
```

Use `@smbc/ui` for ordinary controls and primitives, with explicit `data-grid`
and `validation` subpaths for advanced vendor configuration. Direct
`devextreme-react` and `devextreme` imports, including subpaths, are restricted
by ESLint without exceptions. The reference application has no chart section.
Toolbar uses `Toolbar.Item` templates with our `Button`, including
`menuItemRender`; vendor `widget` strings are not application APIs. ESLint
checks static imports, so review dynamic imports and widget configuration too.

Reusable semantic components belong to the UI package. Application layout,
loading/error arrangement and scrolling are composed with utilities in JSX.

The three projects have separate responsibilities: `devextreme-theme` owns the
visual theme and assets; `smbc-ui` owns reusable React components; `smbc-style`
consumes both and demonstrates integration. They do not require a shared npm
workspace. Install and test their built packages rather than source aliases.

### Layout ownership in shared components

`FilterPanel` supplies the styled surface; put the grid directly on the page:

```tsx
<FilterPanel className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 xl:grid-cols-4">
  <Field label="Reference"><TextInput /></Field>
  <Field label="Notes" className="md:col-span-2"><TextArea /></Field>
</FilterPanel>
```

`Field wide` and `Toolbar.Group` are removed. Use page layout classes for field
spans and ordinary HTML inside `Toolbar.Item` templates. A text-only toolbar
item can simply render a `span`. Card and TableShell remain semantic components.
