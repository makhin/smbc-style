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

## Updating the theme

The standalone source project is [`../devextreme-theme`](../devextreme-theme/README.md).
Edit tokens, metadata, CSS or assets there, then run:

```bash
cd ../devextreme-theme
npm ci
npm run check
npm pack
cd ../smbc-style
npm install ../devextreme-theme/smbc-devextreme-theme-0.1.0.tgz
npm run build
```

`npm pack` builds the theme automatically. For a new release, increment its
version and use the resulting versioned archive filename in the install command.
Commit the updated application manifest and lockfile together. If rebuilding the
same version locally, explicitly reinstall the archive as shown above; editing
package source files alone does not update the installed copy. Share the matching
archive with anyone installing this checkout; a registry is not required.

Never manually edit generated `dx.smbc.css` or files under `node_modules`.

## Routes

- `/` — redirects to the design-system reference
- `/design-system` — component and token reference

All routes render inside `RootLayout`, which provides the shared EMEA-style
header. Navigation, layouts, page styles and `.app-*` patterns belong to this
application.

## Style order

`src/main.tsx` uses this CSS order:

```ts
import '@smbc/ui/styles.css';
import './styles/index.css';
import '@smbc/devextreme-theme/styles.css';
import './styles/smbc-shell.css';
import './index.css';
```

The theme loads fonts, tokens, generated vendor CSS and shared overrides.
Do not load a stock DevExtreme theme as well. Favicon initialization uses the
package asset URL; the application does not register a visualization palette.

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
- Capitolium 2 is reserved for `app-display-title` and `app-display-heading`.
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

Reusable card, field, badge, filter, toolbar, callout, KPI, empty-state and table
shell CSS now belongs to the UI package. Application components.css retains
native reference-table scrolling, page loading/error layout and divider rules.

The three projects have separate responsibilities: `devextreme-theme` owns the
visual theme and assets; `smbc-ui` owns reusable React components; `smbc-style`
consumes both and demonstrates integration. They do not require a shared npm
workspace. Install and test their built packages rather than source aliases.
