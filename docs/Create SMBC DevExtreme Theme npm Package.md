# Task: Extract the existing SMBC DevExtreme theme into a reusable npm package

> Historical implementation brief. This records the original extraction task,
> not the current API or architecture. Use [DESIGN_GUIDE.md](../DESIGN_GUIDE.md),
> [the application README](../README.md), and the two package READMEs for current
> instructions. The theme and UI are now separate projects. Chart was removed
> from the application; direct vendor imports have no exception. Toolbar uses
> Item templates with our Button, including its overflow template. Proposed
> package names, source paths and API sketches below may differ from the code.


Work in the project:

`smbc-style`

The project already contains a working SMBC-styled DevExtreme theme, corporate fonts, logo, favicon, and a design-system/demo application.

Do not redesign the theme or brand assets. Use the existing implementation as the source and extract it into a reusable npm package that can be consumed by multiple frontend applications.

## Goal

Create a reusable internal npm package for the corporate DevExtreme theme and shared corporate visual assets.

The target usage should be approximately:

```ts id="1c4fpd"
import '@company/smbc-devextreme-theme/styles.css';
```

When DevExtreme visualization components are used:

```ts id="fqv08i"
import {
  registerSmbcVizPalette
} from '@company/smbc-devextreme-theme/viz';

registerSmbcVizPalette();
```

Corporate assets should also be consumable from the same package:

```ts id="unxx9h"
import {
  smbcLogoUrl,
  smbcFaviconUrl
} from '@company/smbc-devextreme-theme/assets';
```

The existing design-system application in this project should become a consumer of the package instead of importing theme files and brand assets directly from local source folders.

Do not move application-specific layout, demo components, pages, navigation logic, or business UI into the theme package.

---

# Existing implementation

Inspect the project before making changes.

The important existing theme files are:

```text id="fq99jl"
src/theme/
├── tokens.css
├── smbc-theme.metadata.json
├── dx.smbc.css
├── smbc-devextreme-overrides.css
└── smbc-viz-palette.ts

src/assets/fonts/
├── myriad-pro-light.woff2
├── myriad-pro-regular.woff2
├── myriad-pro-bold.woff2
└── capitolium-2-bold.woff2

src/styles/fonts.css

scripts/
└── sync-devextreme-theme.mjs
```

Existing corporate visual assets:

```text id="qozvz9"
public/
├── smbc-logo.svg
└── favicon.ico
```

Also inspect:

```text id="dnavpy"
README.md
DESIGN_GUIDE.md
package.json
src/main.tsx
src/app/GlobalHeader.tsx
```

Preserve the architectural principles documented in `DESIGN_GUIDE.md`.

In particular:

- `tokens.css` remains the canonical source of reusable visual values;
- components consume semantic tokens rather than raw palette primitives;
- `dx.smbc.css` is generated and must not be manually edited;
- `smbc-devextreme-overrides.css` contains corrections that cannot reasonably be expressed through ThemeBuilder configuration;
- the package must not contain application-specific layouts or page styles;
- corporate assets should have one canonical source rather than being duplicated between applications.

---

# Proposed package

Create:

```text id="6u75zf"
packages/
└── smbc-devextreme-theme/
```

with approximately this structure:

```text id="p4fwsb"
packages/
└── smbc-devextreme-theme/
    ├── src/
    │   ├── tokens.css
    │   ├── fonts.css
    │   ├── dx.smbc.css
    │   ├── overrides.css
    │   ├── styles.css
    │   ├── viz.ts
    │   ├── assets.ts
    │   └── index.ts
    │
    ├── assets/
    │   ├── smbc-logo.svg
    │   ├── favicon.ico
    │   └── fonts/
    │       ├── myriad-pro-light.woff2
    │       ├── myriad-pro-regular.woff2
    │       ├── myriad-pro-bold.woff2
    │       └── capitolium-2-bold.woff2
    │
    ├── theme/
    │   └── smbc-theme.metadata.json
    │
    ├── scripts/
    │   └── sync-devextreme-theme.mjs
    │
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

Adjust the exact structure where technically useful, but keep responsibilities clearly separated.

---

# Package name

Use:

```text id="n18cp4"
@company/smbc-devextreme-theme
```

unless this project already contains an established corporate npm scope.

Do not hardcode a registry URL.

The package is intended for an internal/private npm registry such as Nexus.

Set:

```json id="b670l7"
{
  "private": false
}
```

only if required for publishing to the internal registry, but explicitly protect against accidental public publication using appropriate package configuration and documentation.

If supported by the selected registry workflow, prefer:

```json id="lo0i5y"
{
  "publishConfig": {
    "access": "restricted"
  }
}
```

Do not add a public npm registry URL.

---

# CSS entry point

Create a single primary CSS entry point:

```text id="5t4j2n"
@company/smbc-devextreme-theme/styles.css
```

It must load resources in the correct order:

```text id="uwccb8"
1. fonts
2. design tokens
3. generated DevExtreme ThemeBuilder CSS
4. SMBC DevExtreme overrides
```

Equivalent conceptual structure:

```css id="hkomln"
@import './fonts.css';
@import './tokens.css';
@import './dx.smbc.css';
@import './overrides.css';
```

A consumer should not normally need to understand this order.

This:

```ts id="sge592"
import '@company/smbc-devextreme-theme/styles.css';
```

must be sufficient to enable the full corporate DevExtreme visual theme.

---

# Design tokens

Preserve the existing `tokens.css` design.

It must remain the single source of truth for:

- brand palette;
- semantic colors;
- typography;
- spacing;
- radii;
- borders;
- outlines;
- shadows;
- motion;
- focus styles;
- visualization colors.

Do not duplicate token values inside other CSS files where a semantic token already exists.

Do not rename existing CSS custom properties unless necessary.

Backward compatibility with the existing design-system application is preferred.

---

# Corporate brand assets

The npm package must also own the canonical shared visual brand assets currently stored in:

```text id="xfwcfj"
public/smbc-logo.svg
public/favicon.ico
```

Move or copy them into the package source so that applications no longer need local duplicated copies.

Target runtime package structure:

```text id="fk01c3"
dist/
├── assets/
│   ├── smbc-logo.svg
│   ├── favicon.ico
│   └── fonts/
│       └── ...
```

These assets are part of the theme package's public contract.

Do not modify or redraw the existing logo or favicon as part of this task.

---

# Brand asset API

Provide a stable programmatic entry point:

```text id="21ylt6"
@company/smbc-devextreme-theme/assets
```

with:

```ts id="xy2pkq"
export const smbcLogoUrl: string;
export const smbcFaviconUrl: string;
```

The implementation should resolve URLs relative to the installed npm package and work correctly after bundling.

Prefer an implementation based on module-relative URLs where appropriate:

```ts id="304rb8"
export const smbcLogoUrl = new URL(
  './assets/smbc-logo.svg',
  import.meta.url
).href;

export const smbcFaviconUrl = new URL(
  './assets/favicon.ico',
  import.meta.url
).href;
```

Adjust paths according to the final compiled package structure.

Verify this approach with the actual build configuration rather than assuming it works.

It must work with the project's Vite-based consumer application.

---

# Direct asset exports

Also expose direct asset subpaths where practical:

```text id="e6rb9z"
@company/smbc-devextreme-theme/assets/smbc-logo.svg
@company/smbc-devextreme-theme/assets/favicon.ico
```

This allows bundlers and build pipelines to use the files without depending on internal package paths.

For example:

```ts id="v2wvhp"
import logoUrl from '@company/smbc-devextreme-theme/assets/smbc-logo.svg';
```

where supported by the consuming bundler.

The documented preferred application API should still be the stable `assets` module unless direct asset import is necessary.

---

# Logo usage

Update the existing design-system application so corporate header/logo components no longer reference:

```text id="v23x4f"
/smbc-logo.svg
```

or other application-local asset paths.

Instead use:

```ts id="iuc33p"
import {
  smbcLogoUrl
} from '@company/smbc-devextreme-theme/assets';
```

Example:

```tsx id="x4ytbu"
<img
  src={smbcLogoUrl}
  alt="SMBC"
/>
```

Do not include the `GlobalHeader` component itself in the theme package.

The logo asset belongs to the theme package.

The application shell and header layout remain application/UI-library responsibilities.

---

# Favicon usage

Provide documentation and a working example for consuming the favicon.

For React/Vite applications, prefer a build-safe solution.

For example, if favicon application happens from JavaScript:

```ts id="5ek64m"
import {
  smbcFaviconUrl
} from '@company/smbc-devextreme-theme/assets';
```

Then configure or create the document `<link rel="icon">` using that URL.

Alternatively document an explicit asset-copy approach if that is more reliable for static HTML entry points.

Do not require applications to copy the favicon manually into their source project unless their build system requires static root assets.

The canonical file must remain in the npm package.

---

# DevExtreme ThemeBuilder

Preserve the current approach based on:

```text id="c9u31u"
fluent.blue.light.compact
```

and the existing metadata synchronization logic.

The package must contain a command equivalent to:

```bash id="qfyjvz"
npm run theme:build
```

The flow must remain:

```text id="x54dib"
tokens.css
    ↓
sync-devextreme-theme.mjs
    ↓
smbc-theme.metadata.json
    ↓
DevExtreme ThemeBuilder
    ↓
dx.smbc.css
```

Do not manually maintain ThemeBuilder colors separately from the design tokens.

The synchronization script must continue resolving token aliases such as:

```css id="rga9lc"
--color-action-primary: var(--color-brand-green-700);
```

into concrete ThemeBuilder values.

Circular and missing token references should continue producing explicit errors.

---

# DevExtreme versioning

The existing implementation targets DevExtreme 25.1.

Use the actual installed project versions when configuring the package.

The runtime package should preferably declare DevExtreme as a peer dependency rather than bundling another copy.

Conceptually:

```json id="bfqjjb"
{
  "peerDependencies": {
    "devextreme": ">=25.1 <26"
  }
}
```

Use an exact compatible DevExtreme / ThemeBuilder version in development dependencies to make theme generation reproducible.

Do not require `devextreme-react` unless the package actually needs React-specific runtime code.

The theme package itself should remain framework-independent where possible.

---

# Visualization palette

Refactor the existing:

```text id="xrmnag"
smbc-viz-palette.ts
```

so importing the main package does not automatically mutate DevExtreme global state.

Prefer an explicit API:

```ts id="rxm1q0"
export const SMBC_VIZ_PALETTE_NAME = 'SMBC';

export function registerSmbcVizPalette(): void;
```

Usage:

```ts id="bryqjv"
import {
  registerSmbcVizPalette
} from '@company/smbc-devextreme-theme/viz';

registerSmbcVizPalette();
```

The function should obtain chart colors from the existing semantic CSS tokens.

Avoid reading `document` at module evaluation time so that importing the module remains safe in environments such as:

- tests;
- SSR;
- build tools;
- Node-based tooling.

Perform DOM access only when `registerSmbcVizPalette()` is actually called.

Keep the existing error behavior for missing required tokens.

---

# Fonts

Include the existing local font assets required by the theme.

The existing fonts are:

- Myriad Pro Light;
- Myriad Pro Regular;
- Myriad Pro Bold;
- Capitolium 2 Bold.

Update relative URLs so fonts resolve correctly when consumed from `node_modules`.

Do not introduce external runtime font dependencies.

Do not load fonts from Adobe Typekit or public SMBC websites.

The existing project notes that these fonts are licensed for internal SMBC usage, therefore the package must be treated as an internal package and must not be configured for accidental public publication.

Add an explicit note about this to the package README.

---

# npm package exports

Expose explicit package entry points.

Aim for something similar to:

```json id="f4odrc"
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },

    "./styles.css": "./dist/styles.css",
    "./tokens.css": "./dist/tokens.css",
    "./devextreme.css": "./dist/dx.smbc.css",
    "./overrides.css": "./dist/overrides.css",
    "./fonts.css": "./dist/fonts.css",

    "./viz": {
      "types": "./dist/viz.d.ts",
      "import": "./dist/viz.js"
    },

    "./assets": {
      "types": "./dist/assets.d.ts",
      "import": "./dist/assets.js"
    },

    "./assets/smbc-logo.svg": "./dist/assets/smbc-logo.svg",
    "./assets/favicon.ico": "./dist/assets/favicon.ico"
  }
}
```

The exact implementation may differ if required by the build tooling.

Add:

```json id="6z00c0"
{
  "files": [
    "dist"
  ]
}
```

or equivalent so only required runtime artifacts are published.

Ensure CSS files, logo, favicon, and font assets are included in the resulting npm tarball.

Do not accidentally publish:

- the design-system demo;
- screenshots;
- application pages;
- test fixtures;
- unrelated source files.

---

# sideEffects

Configure package metadata correctly so bundlers do not tree-shake away CSS imports.

For example:

```json id="osafjr"
{
  "sideEffects": [
    "*.css"
  ]
}
```

or an equivalent configuration matching the actual output layout.

Do not mark all package code as having side effects unless necessary.

The asset helper modules should remain side-effect free.

---

# Build

Prefer simple build tooling.

The package primarily contains:

- CSS;
- font assets;
- logo;
- favicon;
- a very small TypeScript API for visualization support;
- a small TypeScript API for brand asset URLs.

Do not introduce a large bundling framework without a concrete reason.

The build must:

1. synchronize ThemeBuilder metadata from `tokens.css`;
2. generate `dx.smbc.css`;
3. compile the TypeScript files;
4. copy CSS files to `dist`;
5. copy fonts to `dist/assets/fonts`;
6. copy `smbc-logo.svg` to `dist/assets`;
7. copy `favicon.ico` to `dist/assets`;
8. preserve valid relative URLs from `fonts.css`;
9. ensure exported asset URLs work from the installed package;
10. produce package metadata suitable for npm publication.

Add commands such as:

```bash id="14o9u3"
npm run theme:build
npm run build
npm run typecheck
npm run pack:check
```

where appropriate.

---

# Existing design-system application

Keep the current application and `/design-system` reference page.

It is useful as:

- documentation;
- visual regression surface;
- development playground;
- integration test of the npm package.

Change it so it consumes the new package instead of directly importing:

```ts id="09zaas"
./theme/dx.smbc.css
./theme/smbc-devextreme-overrides.css
./theme/smbc-viz-palette
```

and instead of using local public paths for:

```text id="ty1xqm"
smbc-logo.svg
favicon.ico
```

The resulting application bootstrap should conceptually look like:

```ts id="kjxduu"
import '@company/smbc-devextreme-theme/styles.css';

import {
  registerSmbcVizPalette
} from '@company/smbc-devextreme-theme/viz';

registerSmbcVizPalette();
```

Brand asset usage should look approximately like:

```ts id="dkhcqq"
import {
  smbcLogoUrl,
  smbcFaviconUrl
} from '@company/smbc-devextreme-theme/assets';
```

Use a workspace dependency or local package reference so development does not require publishing the package first.

---

# Do not move application styles into the package

Do NOT automatically include files such as:

```text id="x4f859"
src/styles/layout.css
src/styles/pages.css
src/app/global-header.css
src/design-system/*
```

These belong to the application/reference implementation rather than the DevExtreme theme.

Review shared files such as:

```text id="ptt24m"
src/styles/typography.css
src/styles/components.css
```

before moving anything.

Only move a rule into the npm theme package if it represents a genuinely reusable corporate visual primitive rather than an application-specific UI pattern.

When uncertain, leave it in the demo application.

The theme package should remain deliberately small.

---

# Compatibility

The extraction must not visually redesign the existing application.

After switching the design-system application to the package:

- buttons should look the same;
- editors should look the same;
- DataGrid and TreeList should look the same;
- tabs should look the same;
- popup/dialog styling should remain unchanged;
- calendar/date components should remain unchanged;
- scheduler styling should remain unchanged;
- focus states should remain unchanged;
- visualization colors should remain unchanged;
- fonts should continue loading locally;
- the existing SMBC logo should render unchanged;
- the favicon should remain unchanged.

The purpose of this task is packaging and separation of responsibilities, not visual redesign.

---

# Validation

Run and fix:

```bash id="oesnk1"
npm install
npm run typecheck
npm run lint
npm run theme:build
npm run build
```

Also validate the actual npm package contents with:

```bash id="p2q284"
npm pack --dry-run
```

or create a real tarball with:

```bash id="kc3hrh"
npm pack
```

Verify that the tarball contains:

- generated DevExtreme CSS;
- tokens;
- overrides;
- font CSS;
- font files;
- SMBC logo;
- favicon;
- visualization JavaScript;
- asset helper JavaScript;
- `.d.ts` files;
- README;
- required package metadata.

Verify that it does NOT contain unrelated application source.

Finally build the design-system application while consuming the local package.

Explicitly verify in the built application that:

```text id="ukivw9"
@company/smbc-devextreme-theme/styles.css
```

loads correctly;

```text id="qiatri"
smbcLogoUrl
```

resolves to a working asset;

```text id="eghz4f"
smbcFaviconUrl
```

resolves to a working asset;

and no application-local copy of those assets is required.

---

# Documentation

Create a package README covering at least:

## Installation

```bash id="7mycj8"
npm install @company/smbc-devextreme-theme
```

and the required compatible DevExtreme dependency.

## Basic usage

```ts id="z2sabt"
import '@company/smbc-devextreme-theme/styles.css';
```

## Logo

```tsx id="hwybyq"
import {
  smbcLogoUrl
} from '@company/smbc-devextreme-theme/assets';

<img
  src={smbcLogoUrl}
  alt="SMBC"
/>
```

## Favicon

```ts id="ljq0cz"
import {
  smbcFaviconUrl
} from '@company/smbc-devextreme-theme/assets';
```

Document the recommended approach for assigning it to:

```html id="213y8x"
<link rel="icon">
```

in the supported application stack.

## Charts

```ts id="drbpte"
import {
  registerSmbcVizPalette,
  SMBC_VIZ_PALETTE_NAME
} from '@company/smbc-devextreme-theme/viz';

registerSmbcVizPalette();
```

Example:

```tsx id="1b4gzv"
<Chart palette={SMBC_VIZ_PALETTE_NAME} />
```

## Design tokens

Explain that semantic CSS custom properties are public theme primitives, for example:

```css id="bdvek6"
color: var(--color-text-primary);
background: var(--color-surface-default);
border-color: var(--color-border-default);
```

Application code should prefer semantic tokens over raw brand palette primitives.

## Theme development

Explain:

```text id="14wi3d"
tokens.css
    ↓
metadata synchronization
    ↓
DevExtreme ThemeBuilder
    ↓
generated theme CSS
    ↓
corporate overrides
```

Explicitly state that `dx.smbc.css` must never be edited manually.

## Corporate assets

Explain that logo, favicon, and corporate fonts have canonical copies inside the package.

Applications should not create their own copies unless required by a specific deployment environment.

## Asset licensing

State that bundled corporate fonts and brand assets are intended for approved internal use only and that the package is intended for an internal registry.

---

# Expected result

The final architecture should be:

```text id="yrnymj"
                @company/smbc-devextreme-theme
                             │
       ┌──────────────┬──────┼────────┬──────────────┐
       │              │      │        │              │
   tokens.css    styles.css  viz    assets         fonts
                       │               │
               ┌───────┴───────┐     ├─ logo.svg
               │               │     └─ favicon.ico
       generated DX theme   overrides
               │
           DevExtreme
```

Applications should normally only need:

```ts id="y7x7ev"
import '@company/smbc-devextreme-theme/styles.css';
```

and optionally:

```ts id="6n90ru"
import {
  smbcLogoUrl,
  smbcFaviconUrl
} from '@company/smbc-devextreme-theme/assets';

import {
  registerSmbcVizPalette
} from '@company/smbc-devextreme-theme/viz';
```

The existing design-system application must successfully consume exactly the same npm package that future production applications will consume.

The package becomes the canonical source for:

```text id="8vvzfl"
DevExtreme corporate theme
Design tokens
Fonts
Logo
Favicon
Visualization palette
```

Do not stop at producing a proposed structure.

Implement the package, update the demo application to consume it, run validation commands, and report:

1. files created/moved;
2. package public API;
3. exported brand assets;
4. npm package contents;
5. validation results;
6. any compatibility issues discovered.
