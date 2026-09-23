# SMBC Application UI

React application shell and design-system reference built with DevExtreme and
`@smbc/devextreme-theme`. The implementation standard and UI rules live in
[`DESIGN_GUIDE.md`](DESIGN_GUIDE.md).

## Installation and commands

The theme is installed from the local archive
`../devextreme-theme/smbc-devextreme-theme-0.1.0.tgz`, recorded in `package.json`
and `package-lock.json`. Ensure this archive exists next to the application
before installing dependencies. npm extracts it into `node_modules`; there is
no workspace or symlink to the theme's source project.

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
npm run typecheck
npm run pack:check
npm test
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

`src/main.tsx` loads:

1. Shared application patterns, preserving their position before vendor rules.
2. `@smbc/devextreme-theme/styles.css`: fonts, tokens, generated theme, overrides.
3. Application-owned SMBC shell helpers.
4. Explicit `registerSmbcVizPalette()` and package favicon initialization.
5. Minimal application-root CSS.

## Package API

```ts
import '@smbc/devextreme-theme/styles.css';
import { smbcLogoUrl, smbcFaviconUrl } from '@smbc/devextreme-theme/assets';
import { registerSmbcVizPalette } from '@smbc/devextreme-theme/viz';

registerSmbcVizPalette();
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
