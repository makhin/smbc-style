# Task: Create `@smbc/ui` reusable React component library using `smbc-style` as the Golden Source

> Historical implementation brief. This records the original extraction task,
> not the current API or architecture. Use [DESIGN_GUIDE.md](../DESIGN_GUIDE.md),
> [the application README](../README.md), and the two package READMEs for current
> instructions. The theme and UI are now separate projects. Chart was removed
> from the application; direct vendor imports have no exception. Toolbar uses
> Item templates with our Button, including its overflow template. Proposed
> package names, source paths and API sketches below may differ from the code.


Work with these existing projects:

```text
smbc-style
devextreme-theme
```

The current state is important.

## Existing theme package

`devextreme-theme` is already a standalone npm package:

```text
@smbc/devextreme-theme
```

Current version:

```text
0.1.0
```

It targets:

```text
DevExtreme 26.1.4
```

and already owns:

- semantic design tokens;
- generated DevExtreme theme;
- DevExtreme overrides;
- corporate fonts;
- SMBC logo;
- favicon;
- visualization palette;
- asset APIs.

Do NOT move or duplicate any of those responsibilities into the new UI package.

The theme package is already successfully consumed by `smbc-style`.

---

# Existing Golden Source

`smbc-style` is the Golden Source application.

It currently depends on:

```json
{
  "@smbc/devextreme-theme": "0.1.0",
  "devextreme": "26.1.4",
  "devextreme-react": "26.1.4",
  "react": "^19.2.8",
  "react-dom": "^19.2.8"
}
```

The local development checkout currently installs the theme from a packed archive.

The application bootstrap already uses:

```ts
import '@smbc/devextreme-theme/styles.css';

import {
  registerSmbcVizPalette
} from '@smbc/devextreme-theme/viz';

import {
  smbcFaviconUrl
} from '@smbc/devextreme-theme/assets';
```

Do not reimplement this functionality.

---

# Goal

Create a separate reusable npm package:

```text
@smbc/ui
```

Prefer a separate sibling source project:

```text
../smbc-ui
```

relative to:

```text
../smbc-style
../devextreme-theme
```

Do NOT create the UI package inside `smbc-style` unless the environment makes a separate sibling project impossible.

The desired architecture is:

```text
                   Production applications
                            │
                            ▼
                       @smbc/ui
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
         devextreme-react    @smbc/devextreme-theme
                  │                   │
                  └─────────┬─────────┘
                            ▼
                       DevExtreme


                     smbc-style
                  Golden Source
                       │    │
                       │    └──────► @smbc/devextreme-theme
                       │
                       └───────────► @smbc/ui
```

`@smbc/ui` owns reusable React components and reusable component-level layout patterns.

`@smbc/devextreme-theme` owns visual foundations.

`smbc-style` owns the Golden Source, application shell, examples, and regression surface.

---

# Golden Source principle

Treat the existing `/design-system` implementation in `smbc-style` as the canonical reference.

Important existing sections include:

```text
src/design-system/sections/
├── AccessibilitySection.tsx
├── ButtonsSection.tsx
├── CardsSection.tsx
├── ChartsSection.tsx
├── ComponentsSection.tsx
├── DataGridSection.tsx
├── DialogsSection.tsx
├── FiltersSection.tsx
├── FormsSection.tsx
├── StatesSection.tsx
└── StatusSection.tsx
```

Also inspect:

```text
src/styles/components.css
src/styles/typography.css
src/styles/layout.css
src/styles/pages.css
src/styles/smbc-shell.css
DESIGN_GUIDE.md
README.md
```

The migration loop is:

```text
Current Golden Source
        │
        ▼
identify stable reusable behavior
        │
        ▼
implement @smbc/ui component
        │
        ▼
replace Golden Source implementation
with @smbc/ui
        │
        ▼
compare visual + behavioral result
```

The package must adapt to the Golden Source.

Do not redesign the Golden Source to make package implementation easier.

---

# Package scope

The new package should initially cover two categories.

## 1. DevExtreme-backed components

Create corporate wrappers for the components already exercised by the Golden Source.

Initial candidates:

```text
Button
TextInput
TextArea
NumberInput
Select
MultiSelect
DatePicker
Checkbox
RadioGroup
Tabs
Accordion
DataGrid
Dialog
ConfirmDialog
Toast
LoadingIndicator
```

Internally they may use:

```text
devextreme-react/*
```

Applications should consume:

```text
@smbc/ui
```

instead.

---

## 2. SMBC reusable UI primitives

The current:

```text
src/styles/components.css
```

contains several reusable application patterns that should be evaluated for promotion into real React components.

Important candidates:

```text
Card
Toolbar
FilterPanel
Field
StatusBadge
Callout
EmptyState
KpiCard
```

Potential supporting/internal abstractions:

```text
TableShell
LoadingState
Divider
```

Do not create an abstraction merely because a CSS class exists.

Only promote patterns with a clear reusable semantic meaning.

---

# What must stay outside `@smbc/ui`

Do NOT move these responsibilities into the package:

```text
routing
application pages
GlobalHeader
RootLayout
application shell
sidebar/navigation composition
page-specific layout
business workflows
design-system demo chrome
demo JSON fixtures
```

Keep:

```text
src/app/*
src/styles/smbc-shell.css
src/styles/pages.css
src/design-system/*
```

application-owned unless a specific reusable UI primitive is intentionally extracted.

Do not create domain components such as:

```text
PaymentGrid
PaymentSummary
ApprovalDialog
SwiftMessageGrid
CustomerSelector
TransactionEditor
```

Generic UI belongs in `@smbc/ui`.

Business meaning stays in applications.

---

# Theme ownership is already solved

Do NOT copy any of the following from `@smbc/devextreme-theme`:

```text
tokens.css
fonts
SMBC logo
favicon
generated DevExtreme CSS
DevExtreme overrides
visualization palette
```

Do not create alternative token definitions.

All package-specific styles must consume the semantic CSS variables already provided by:

```text
@smbc/devextreme-theme
```

For example:

```css
color: var(--color-text-primary);
background: var(--color-surface-default);
border-color: var(--color-border-default);
padding: var(--space-4);
border-radius: var(--radius-md);
```

Never duplicate raw brand values when a suitable semantic token already exists.

---

# Package name and metadata

The npm package name must be exactly:

```text
@smbc/ui
```

Start at:

```text
0.1.0
```

Use:

```json
{
  "name": "@smbc/ui",
  "version": "0.1.0",
  "type": "module",
  "license": "UNLICENSED",
  "private": false,
  "publishConfig": {
    "access": "restricted"
  }
}
```

Do not configure a public registry URL.

This package is intended for an approved internal registry such as Nexus.

Follow the same publication-safety philosophy already used by `@smbc/devextreme-theme`.

---

# Dependencies

Do not bundle React or DevExtreme into `@smbc/ui`.

Use peer dependencies.

Base compatibility on the actual Golden Source versions:

```text
React 19.2.x
DevExtreme 26.1.4
@smbc/devextreme-theme 0.1.x
```

Conceptually:

```json
{
  "peerDependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "devextreme": "~26.1.4",
    "devextreme-react": "~26.1.4",
    "@smbc/devextreme-theme": "^0.1.0"
  }
}
```

Use matching dependencies/devDependencies locally to build and test the package.

For local development, consuming the packed theme archive is acceptable, mirroring the existing `smbc-style` workflow.

Do not create duplicate React or DevExtreme runtimes.

---

# Build strategy

Prefer a simple package build.

The package contains primarily:

```text
TypeScript
React
CSS
type declarations
```

Do not introduce a large bundling framework without a concrete requirement.

A plain TypeScript-based ESM build plus small Node scripts for copying CSS is acceptable.

Output should approximately be:

```text
dist/
├── index.js
├── index.d.ts
├── components/
├── data-grid/
├── validation/
└── styles.css
```

Preserve tree-shakeable ESM modules.

Do not bundle all DevExtreme widgets into one opaque JavaScript file.

---

# Proposed source structure

Use approximately:

```text
smbc-ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   ├── TextInput/
│   │   ├── TextArea/
│   │   ├── NumberInput/
│   │   ├── Select/
│   │   ├── MultiSelect/
│   │   ├── DatePicker/
│   │   ├── Checkbox/
│   │   ├── RadioGroup/
│   │   ├── Tabs/
│   │   ├── Accordion/
│   │   ├── Dialog/
│   │   ├── ConfirmDialog/
│   │   ├── Toast/
│   │   ├── LoadingIndicator/
│   │   ├── DataGrid/
│   │   ├── Card/
│   │   ├── Field/
│   │   ├── StatusBadge/
│   │   ├── Callout/
│   │   ├── EmptyState/
│   │   ├── KpiCard/
│   │   ├── Toolbar/
│   │   └── FilterPanel/
│   │
│   ├── data-grid/
│   ├── validation/
│   ├── styles/
│   │   └── styles.css
│   └── index.ts
│
├── scripts/
├── package.json
├── tsconfig.json
└── README.md
```

Adjust where useful.

Avoid folder-per-file bureaucracy when a component is trivial.

---

# Main API principle

Do NOT simply rename DevExtreme exports.

This is not enough:

```ts
export { default as Button } from 'devextreme-react/button';
```

The package must own the public API for ordinary application usage.

For simple components, applications should not need to know DevExtreme terminology.

---

# Button

Use the current `ButtonsSection.tsx` as the Golden Source.

It demonstrates:

```text
primary
secondary/outlined
tertiary/text
danger/destructive
icon-only
disabled
```

Create an API similar to:

```tsx
<Button variant="primary">
  Approve payment
</Button>

<Button
  variant="secondary"
  icon="exportxlsx"
>
  Export
</Button>

<Button variant="tertiary">
  Cancel
</Button>

<Button
  variant="danger"
  icon="trash"
>
  Delete payment
</Button>

<Button
  icon="refresh"
  ariaLabel="Refresh"
/>
```

Suggested variants:

```ts
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger';
```

Internally map these to the current Golden Source DevExtreme configuration.

For example:

```text
primary
→ type="default"
→ stylingMode="contained"

secondary
→ type="default"
→ stylingMode="outlined"

tertiary
→ stylingMode="text"

danger
→ type="danger"
→ stylingMode="contained"
```

Do not make these DevExtreme props the normal corporate API.

---

# Icon-only Button accessibility

An icon-only Button must have an accessible label.

Prefer:

```tsx
<Button
  icon="refresh"
  ariaLabel="Refresh"
/>
```

Map that to appropriate DevExtreme:

```text
elementAttr
hint
ARIA attributes
```

Do not allow an inaccessible icon-only button silently.

Use TypeScript types or at least a development-time warning where practical.

---

# Form controls

Use these Golden Source files:

```text
FormsSection.tsx
ComponentsSection.tsx
FiltersSection.tsx
```

The component library must support the states currently demonstrated:

```text
value
defaultValue
placeholder
readOnly
disabled
required
validation error
search
multiple selection
numeric formatting
date formatting
checkbox
radio group
```

Prefer React-style callbacks.

For example:

```tsx
<TextInput
  value={reference}
  onChange={setReference}
/>
```

rather than requiring:

```tsx
<TextBox
  value={reference}
  onValueChanged={(event) => setReference(event.value)}
/>
```

The wrapper should translate DevExtreme events internally.

---

# Controlled and uncontrolled behavior

Where appropriate support both:

```tsx
<TextInput
  value={value}
  onChange={setValue}
/>
```

and:

```tsx
<TextInput
  defaultValue="Initial value"
/>
```

Do not maintain a second unnecessary state inside wrappers.

Follow standard React controlled/uncontrolled semantics.

---

# Field

Convert the common Golden Source pattern:

```text
label
control
required marker
caption/help text
validation message
```

into a reusable component.

Example:

```tsx
<Field
  label="Payment reference"
  required
>
  <TextInput
    value={reference}
    onChange={setReference}
  />
</Field>
```

Accessibility relationships must work correctly.

The label must be programmatically associated with the control.

Help text and validation errors must be associated where applicable.

Do not solve this only with visual positioning.

---

# Validation

The current Golden Source uses:

```text
Validator
RequiredRule
EmailRule
RangeRule
ValidationGroup
ValidationSummary
```

Do not force ordinary application components to import these directly from:

```text
devextreme-react/*
```

However, do not design an enormous proprietary validation framework in version 0.1.

Choose one of these approaches after evaluating the existing use cases:

## Preferred if practical

Expose a small semantic validation API on the corporate controls.

For example:

```tsx
<TextInput
  required
  validationRules={[
    { type: 'email', message: 'Enter a valid email address.' }
  ]}
/>
```

## Acceptable v0.1 alternative

Provide a controlled advanced entry point:

```text
@smbc/ui/validation
```

which exposes only the DevExtreme validation primitives actually required by the Golden Source.

The direct DevExtreme dependency must remain isolated behind the `@smbc/ui` package boundary.

Document this as an advanced API rather than the preferred abstraction.

---

# Select

Prefer a generic React-style API where practical.

Example:

```tsx
<Select
  options={countries}
  value={country}
  onChange={setCountry}
  searchable
/>
```

Map internally to:

```text
SelectBox
items
value
onValueChanged
searchEnabled
```

Do not leak event objects unnecessarily.

---

# MultiSelect

Use the current TagBox usage as reference.

Example API:

```tsx
<MultiSelect
  options={reviewTeams}
  value={selectedTeams}
  onChange={setSelectedTeams}
  searchable
/>
```

Preserve the Golden Source behavior such as explicit apply controls where required.

---

# DatePicker

Wrap DevExtreme DateBox.

Expose common date semantics rather than DevExtreme-specific naming where reasonable.

Example:

```tsx
<DatePicker
  value={date}
  onChange={setDate}
  displayFormat="dd MMM yyyy"
/>
```

Do not unnecessarily hide useful DevExtreme formatting capabilities.

---

# StatusBadge

Use:

```text
StatusSection.tsx
```

and the current:

```text
.app-badge*
```

styles as the Golden Source.

Support:

```ts
export type StatusBadgeTone =
  | 'neutral'
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'brand';
```

Example:

```tsx
<StatusBadge tone="warning">
  Under review
</StatusBadge>
```

Preserve the existing accessibility/design principle:

> Color must not be the only indication of business state.

Do not introduce business-specific status names into the generic component.

---

# Callout

Use the existing Golden Source variants.

Support semantic tones such as:

```text
info
brand
warning
danger
```

Example:

```tsx
<Callout
  tone="danger"
  title="Processing failed"
>
  The payment could not be submitted.
</Callout>
```

The component must remain generic.

---

# Card

Extract the reusable behavior from:

```text
.app-card
.app-card__header
.app-card__title
.app-card__body
.app-card__footer
```

Use a simple compositional API.

For example:

```tsx
<Card>
  <Card.Header
    title="Payment summary"
    subtitle="PAY-2026-008421"
  />

  <Card.Body>
    ...
  </Card.Body>

  <Card.Footer>
    ...
  </Card.Footer>
</Card>
```

or a simpler equivalent if that results in a cleaner implementation.

Do not make Card business-aware.

---

# KpiCard

Extract the existing:

```text
.app-kpi
```

pattern.

Example:

```tsx
<KpiCard
  label="Payments today"
  value="184"
  meta="12 awaiting review"
/>
```

It must remain generic despite payment-oriented demo data.

---

# EmptyState

Use `StatesSection.tsx` as the Golden Source.

Example:

```tsx
<EmptyState
  icon="search"
  title="No results"
  description="Try changing the filters."
  action={
    <Button variant="secondary">
      Clear filters
    </Button>
  }
/>
```

Preserve accessible semantic structure.

---

# Toolbar

Extract the reusable:

```text
.app-toolbar
.app-toolbar__group
```

pattern.

Support composition rather than a business-specific configuration object.

Example:

```tsx
<Toolbar>
  <Toolbar.Group>
    ...
  </Toolbar.Group>

  <Toolbar.Group>
    ...
  </Toolbar.Group>
</Toolbar>
```

---

# FilterPanel

Use the current responsive `.app-filter-panel` implementation as the Golden Source.

Example:

```tsx
<FilterPanel
  actions={
    <>
      <Button variant="tertiary">Reset</Button>
      <Button variant="primary">Apply filters</Button>
    </>
  }
>
  <Field label="Reference">
    <TextInput />
  </Field>

  <Field label="Status">
    <Select options={statuses} />
  </Field>

  <Field label="From">
    <DatePicker />
  </Field>

  <Field label="To">
    <DatePicker />
  </Field>
</FilterPanel>
```

Preserve the existing responsive breakpoints and behavior unless an equivalent implementation is demonstrated to be visually identical.

---

# Dialog

Use `DialogsSection.tsx` as the Golden Source.

Create a reusable abstraction over DevExtreme Popup.

Example:

```tsx
<Dialog
  open={open}
  title="Details"
  onOpenChange={setOpen}
>
  ...
</Dialog>
```

Corporate defaults should preserve the current behavior:

```text
showCloseButton = true
dragEnabled = false
hideOnOutsideClick = false
height = auto
responsive max width
```

Do not make each consuming application repeat this configuration.

Allow deliberate overrides where needed.

---

# ConfirmDialog

Provide a reusable higher-level confirmation component.

Example:

```tsx
<ConfirmDialog
  open={open}
  title="Delete customer?"
  message="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  confirmVariant="danger"
  onConfirm={handleDelete}
  onCancel={() => setOpen(false)}
/>
```

Build it from the package's own:

```text
Dialog
Button
```

rather than duplicating implementation.

---

# Toast

Wrap the existing DevExtreme Toast usage.

Expose semantic naming.

Example:

```tsx
<Toast
  open={visible}
  message="Changes saved."
  tone="success"
  duration={2500}
/>
```

The public API should not require knowledge of DevExtreme event names for ordinary usage.

---

# Tabs and Accordion

Wrap the Golden Source implementations.

Prefer:

```tsx
<Tabs
  items={tabs}
  value={selectedTab}
  onChange={setSelectedTab}
/>
```

over exposing `onSelectionChanged` events directly.

Preserve DevExtreme keyboard navigation and focus behavior.

---

# LoadingIndicator

Wrap DevExtreme LoadIndicator with sensible defaults.

The Golden Source currently demonstrates:

```text
24 × 24
aria-hidden when paired with textual role="status"
```

Do not duplicate the accessible status text inside the spinner itself when the parent already provides it.

---

# DataGrid: keep v0.1 pragmatic

DataGrid is different from Button or TextInput.

Do NOT attempt to invent a complete vendor-independent grid abstraction in this task.

The current Golden Source uses:

```text
Column
FilterRow
HeaderFilter
Pager
Paging
Selection
custom cell render
formatting
```

and applies these defaults:

```text
showBorders = false
rowAlternationEnabled = true
hoverStateEnabled = true
columnAutoWidth = true
```

Create a corporate DataGrid wrapper that automatically applies the Golden Source defaults.

---

# DataGrid common API

Expose an ergonomic common API where safe.

For example:

```tsx
<DataGrid
  dataSource={payments}
  keyExpr="id"
  columns={columns}
/>
```

However, do not force a large rewrite of working Golden Source grid behavior merely to achieve theoretical vendor independence.

---

# DataGrid advanced API

For DevExtreme-specific configuration required by the Golden Source, provide a deliberate subpath:

```text
@smbc/ui/data-grid
```

For example, it may expose controlled aliases such as:

```ts
DataGridColumn
DataGridFilterRow
DataGridHeaderFilter
DataGridPager
DataGridPaging
DataGridSelection
```

internally backed by DevExtreme configuration components.

Example:

```tsx
import { DataGrid } from '@smbc/ui';

import {
  DataGridColumn,
  DataGridFilterRow,
  DataGridHeaderFilter,
  DataGridPager,
  DataGridPaging,
  DataGridSelection
} from '@smbc/ui/data-grid';
```

This is preferable to forcing every application to import from:

```text
devextreme-react/data-grid
```

Document that this advanced subpath is intentionally more DevExtreme-coupled than the normal component API.

Do not export the entire DevExtreme DataGrid surface blindly.

Export only capabilities currently needed by the Golden Source plus clearly justified generic capabilities.

---

# Escape hatch for simple components

Simple wrappers may expose an explicit DevExtreme escape hatch where necessary.

For example:

```tsx
<Select
  ...
  devExtremeProps={{
    searchTimeout: 300
  }}
/>
```

or an equivalent typed mechanism.

Rules:

1. it must not be the preferred API;
2. common options must have normal semantic props;
3. do not blindly flatten all DevExtreme props into the corporate API;
4. repeated escape-hatch usage is a signal to promote that capability into the public API.

---

# Charts

Do NOT create a Chart wrapper in version 0.1 unless a real repeated abstraction is discovered.

The Golden Source currently uses:

```tsx
import Chart from 'devextreme-react/chart';

import {
  SMBC_VIZ_PALETTE_NAME
} from '@smbc/devextreme-theme/viz';
```

This is an intentional exception.

The visualization palette already belongs to the theme package.

Keep charts outside the initial `@smbc/ui` scope.

Document direct chart imports as an approved exception to the general DevExtreme-import rule.

---

# Application shell

Do NOT move:

```text
src/styles/smbc-shell.css
GlobalHeader
RootLayout
sidebar composition
routing
```

into `@smbc/ui` during this task.

They remain application-owned.

A future package version can promote them only if multiple real applications demonstrate the same reusable shell requirement.

---

# Typography

Do not copy the global document reset from:

```text
src/styles/typography.css
```

into `@smbc/ui`.

The component package must not unexpectedly change:

```text
html
body
h1
h2
h3
```

in consuming applications.

Component-specific label, caption and muted styles may be reproduced internally using theme tokens where required by a reusable component.

Keep the global application typography baseline in `smbc-style`.

---

# CSS ownership

Package-owned classes must use a collision-resistant prefix.

Prefer:

```text
.smbc-ui-card
.smbc-ui-field
.smbc-ui-status-badge
.smbc-ui-callout
```

Do not expose internal CSS class names as part of normal application usage.

Avoid generic names such as:

```text
.card
.field
.badge
```

---

# Migrating `src/styles/components.css`

Review every rule in:

```text
smbc-style/src/styles/components.css
```

Do not copy the file wholesale.

Classify each rule.

Expected reusable candidates include:

```text
.app-card*
.app-toolbar*
.app-filter-panel
.app-field*
.app-badge*
.app-empty-state
.app-kpi*
.app-callout*
```

Move their styling into matching `@smbc/ui` components.

Rules related only to application pages or native reference examples may remain in `smbc-style`.

Examples that may need separate consideration:

```text
.app-table-scroll
.app-page-error
.app-page-loading
.app-divider
```

Do not force `components.css` to become empty as an artificial goal.

The goal is correct ownership, not file deletion.

---

# CSS entry point

Expose:

```text
@smbc/ui/styles.css
```

It should contain only styles owned by reusable `@smbc/ui` components.

Do NOT embed or duplicate:

```text
@smbc/devextreme-theme/styles.css
```

inside the generated CSS bundle.

Keep the theme as an explicit dependency and explicit import.

This preserves separation of responsibilities and avoids hidden duplicate theme loading.

---

# Golden Source style loading order

The current `smbc-style` application intentionally loads application/component patterns before the DevExtreme theme.

Preserve visual compatibility during migration.

Initially use approximately:

```ts
import '@smbc/ui/styles.css';
import './styles/index.css';
import '@smbc/devextreme-theme/styles.css';
import './styles/smbc-shell.css';
```

Adjust the exact position of the remaining application styles based on ownership.

The key requirement is:

> do not silently change cascade order and then compensate with stronger selectors.

If another order is proven visually equivalent and cleaner, document the change.

---

# Package public API

The normal root import should expose approximately:

```ts
import {
  Button,
  TextInput,
  TextArea,
  NumberInput,
  Select,
  MultiSelect,
  DatePicker,
  Checkbox,
  RadioGroup,
  Tabs,
  Accordion,
  DataGrid,
  Dialog,
  ConfirmDialog,
  Toast,
  LoadingIndicator,
  Card,
  Field,
  StatusBadge,
  Callout,
  EmptyState,
  KpiCard,
  Toolbar,
  FilterPanel
} from '@smbc/ui';
```

Keep advanced vendor-coupled features in explicit subpaths such as:

```text
@smbc/ui/data-grid
@smbc/ui/validation
```

Do not pollute the root API with dozens of DevExtreme implementation details.

---

# Package exports

Configure explicit exports.

Conceptually:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css",
    "./data-grid": {
      "types": "./dist/data-grid/index.d.ts",
      "import": "./dist/data-grid/index.js"
    },
    "./validation": {
      "types": "./dist/validation/index.d.ts",
      "import": "./dist/validation/index.js"
    }
  }
}
```

Only include subpaths that actually exist.

Do not expose internal source paths.

---

# sideEffects

Ensure CSS survives tree shaking.

For example:

```json
{
  "sideEffects": [
    "**/*.css"
  ]
}
```

Keep ordinary TypeScript/React modules side-effect free where practical.

---

# Golden Source migration

Once `@smbc/ui` components exist, modify `smbc-style` so `/design-system` consumes the package.

For example:

Before:

```tsx
import Button from 'devextreme-react/button';
```

After:

```tsx
import {
  Button
} from '@smbc/ui';
```

Use the package in the Golden Source exactly as future applications will use it.

Do not keep a separate private implementation for the demo.

---

# Recommended migration order

Migrate incrementally:

```text
1. Button
2. StatusBadge
3. Card
4. Callout
5. EmptyState
6. KpiCard
7. TextInput / TextArea / NumberInput
8. Checkbox / RadioGroup
9. Select / MultiSelect
10. DatePicker
11. Field
12. Tabs / Accordion
13. Dialog / ConfirmDialog / Toast
14. Toolbar / FilterPanel
15. LoadingIndicator
16. DataGrid
17. Validation integration
```

After each meaningful group, build and verify the Golden Source.

Do not perform a giant blind replacement and debug the resulting archaeological site afterward.

---

# Golden Source package consumption

Mirror the existing theme-package workflow.

Build and pack `@smbc/ui`:

```bash
cd ../smbc-ui
npm ci
npm run typecheck
npm run build
npm run pack:check
npm test
npm pack
```

Then install the resulting tarball into `smbc-style`.

For example:

```bash
cd ../smbc-style
npm install ../smbc-ui/smbc-ui-0.1.0.tgz
```

Record the local packed dependency in:

```text
package.json
package-lock.json
```

just as the theme is currently consumed locally.

Do not use a workspace/symlink unless there is a concrete reason to change the existing integration model.

The objective is to test the actual package artifact.

---

# Package testing

Follow the quality pattern already established by:

```text
devextreme-theme
```

Create package-level validation commands where appropriate:

```text
npm run typecheck
npm run build
npm run pack:check
npm test
```

`npm pack --dry-run` or equivalent validation must confirm that only intended runtime files are published.

---

# Installed-package integration test

Prefer an integration test that builds the real package tarball and installs it into a temporary small React/Vite consumer.

Validate at least:

```text
root imports
styles.css
Button render
one form control
one primitive such as StatusBadge
DataGrid import
advanced DataGrid subpath
validation subpath if implemented
```

The test must consume the packed package rather than importing source files directly.

This catches broken package exports that ordinary source tests conveniently fail to notice.

---

# npm package contents

The tarball should contain:

```text
compiled ESM JavaScript
TypeScript declarations
component CSS
README
package metadata
```

It should not contain:

```text
smbc-style demo pages
demo JSON
screenshots
routing
Golden Source application
business fixtures
unrelated source code
```

---

# Accessibility

Use:

```text
AccessibilitySection.tsx
```

as part of the Golden Source contract.

Preserve at minimum:

```text
visible keyboard focus
keyboard navigation
accessible control labels
accessible icon-only buttons
disabled semantics
read-only semantics
validation semantics
dialog focus behavior
tabs keyboard behavior
DataGrid actions
focus visibility on light surfaces
focus visibility on dark surfaces
```

Do not wrap a DevExtreme component in a way that destroys its built-in accessibility.

---

# Behavioral regression

Do not validate only screenshots.

Verify:

```text
click
change callbacks
controlled values
default values
keyboard interaction
focus
disabled
read-only
validation
dialog open/close
toast lifecycle
tab selection
accordion selection
DataGrid filtering
DataGrid header filters
DataGrid selection
DataGrid paging
custom DataGrid cells
```

---

# Visual regression

The Golden Source must remain visually equivalent after migration.

Compare at least:

```text
spacing
typography
button variants
borders
focus states
hover states
selected states
disabled states
form states
badges
callouts
cards
empty states
dialogs
DataGrid
responsive FilterPanel
```

Do not add a heavy browser-testing stack solely for this task if the environment does not already support one.

If automated screenshots are available, use them.

Otherwise use the Golden Source application as the integration/regression surface and document manual visual checks required.

---

# Direct DevExtreme imports after migration

The long-term rule is:

> ordinary application UI should use `@smbc/ui`, not `devextreme-react/*`.

However, do not pretend all DevExtreme usage is abstracted if it is not.

After migration, inventory all remaining direct DevExtreme imports.

Expected approved exceptions may include:

```text
ChartsSection.tsx
```

because Chart remains explicitly out of v0.1 scope.

If another direct import remains, document why.

Do not silently leave random direct imports behind.

---

# ESLint policy

Once the Golden Source has migrated sufficiently, add a restriction preventing new accidental direct DevExtreme imports in ordinary application code.

Do not apply the restriction inside the `@smbc/ui` implementation.

Allow documented exceptions such as charts.

Use the smallest practical ESLint configuration.

Do not make the lint configuration more complicated than the problem.

---

# README for `@smbc/ui`

Document:

## Installation

```bash
npm install \
  @smbc/ui \
  @smbc/devextreme-theme \
  devextreme \
  devextreme-react
```

Use the actual compatible versions.

---

## Styles

Document the required imports explicitly.

For example:

```ts
import '@smbc/ui/styles.css';
import '@smbc/devextreme-theme/styles.css';
```

Document the tested loading order.

Do not tell consumers to load a stock DevExtreme theme in addition.

---

## Basic usage

```tsx
import {
  Button,
  Field,
  TextInput,
  Select
} from '@smbc/ui';

<Field label="Reference">
  <TextInput
    value={reference}
    onChange={setReference}
  />
</Field>

<Button variant="primary">
  Save
</Button>
```

---

## Status

```tsx
<StatusBadge tone="warning">
  Under review
</StatusBadge>
```

---

## Dialog

```tsx
<ConfirmDialog
  open={open}
  title="Delete item?"
  message="This action cannot be undone."
  confirmLabel="Delete"
  confirmVariant="danger"
  onConfirm={handleDelete}
  onCancel={() => setOpen(false)}
/>
```

---

## DataGrid

Provide one realistic example showing:

```text
corporate defaults
columns
selection
filtering
paging
custom cell rendering
```

Document the advanced:

```text
@smbc/ui/data-grid
```

entry point separately.

---

## Validation

Document the selected v0.1 validation strategy.

If a DevExtreme-backed advanced subpath exists, clearly distinguish it from the preferred application API.

---

## Theme

State clearly:

```text
@smbc/ui does not own the SMBC theme.
```

The theme comes from:

```text
@smbc/devextreme-theme
```

and owns:

```text
tokens
fonts
logo
favicon
DevExtreme theme
visualization palette
```

---

## Golden Source

Document:

> `smbc-style` is the Golden Source and integration reference for `@smbc/ui`.

A public component behavior or visual change should be reflected in the Golden Source in the same change/release cycle.

---

# Versioning

Prepare for semantic versioning.

Use:

```text
PATCH
```

for backward-compatible fixes.

Use:

```text
MINOR
```

for backward-compatible new components or props.

Use:

```text
MAJOR
```

for breaking public API changes.

During `0.x`, still document breaking changes explicitly rather than using zero-major status as an excuse for chaos.

---

# Important architectural constraints

Do NOT:

```text
duplicate @smbc/devextreme-theme
copy fonts
copy logo/favicon
copy tokens
bundle React
bundle another DevExtreme runtime
copy business components
move application routing
move GlobalHeader
move the application shell
create a huge UniversalComponent
create a 300-prop DataGrid facade
mirror every DevExtreme prop at the root level
invent a new design
silently change the Golden Source appearance
```

Prefer:

```text
small semantic APIs
React-style callbacks
composition
corporate defaults
explicit advanced subpaths
controlled escape hatches
incremental migration
real packed-package testing
Golden Source regression checks
```

---

# Expected final source layout

After this task, the projects should conceptually look like:

```text
devextreme-theme/
    │
    └── @smbc/devextreme-theme


smbc-ui/
    │
    ├── @smbc/ui
    │
    ├── uses devextreme-react
    │
    └── consumes @smbc/devextreme-theme contract


smbc-style/
    │
    ├── Golden Source
    ├── consumes @smbc/ui
    └── consumes @smbc/devextreme-theme
```

Runtime dependency direction:

```text
smbc-style
   │
   ├──────────────► @smbc/ui
   │                    │
   │                    ├────► devextreme-react
   │                    │
   │                    └────► @smbc/devextreme-theme
   │
   └──────────────► @smbc/devextreme-theme
                        │
                        └────► devextreme
```

The direct Golden Source theme dependency remains legitimate because the application itself uses:

```text
favicon
logo
visualization palette
global theme CSS
```

These are not UI-component responsibilities.

---

# Definition of Done

Do not stop at proposing an architecture.

Implement it.

The task is complete when:

1. A separate buildable npm package named exactly `@smbc/ui` exists.
2. It starts at version `0.1.0`.
3. It uses `@smbc/devextreme-theme` rather than duplicating theme functionality.
4. React and DevExtreme are not bundled into the package.
5. The initial corporate wrapper set is implemented.
6. Reusable Golden Source `.app-*` component patterns have been moved where appropriate.
7. `smbc-style` installs the packed `@smbc/ui` artifact.
8. `/design-system` consumes `@smbc/ui`.
9. Golden Source appearance remains equivalent.
10. Golden Source behavior remains equivalent.
11. Accessibility behavior remains intact.
12. The package exposes a stable root API.
13. Complex DevExtreme-specific APIs are isolated into deliberate subpaths.
14. Charts remain a documented exception unless there is a compelling reason to include them.
15. Remaining direct `devextreme-react/*` imports in `smbc-style` are inventoried and justified.
16. `npm pack --dry-run` / `pack:check` passes.
17. Installed-package integration tests pass.
18. `smbc-style` lint, typecheck and build pass.
19. Package README documents installation, styles, API, DataGrid, validation, theme relationship and Golden Source.
20. No changes are made to `devextreme-theme` unless a genuine blocking defect is discovered.

If a blocking defect is found in `@smbc/devextreme-theme`, do not silently change that package as part of this task. Document the required theme-package change separately.

---

# Final report

At completion report:

1. created `@smbc/ui` project structure;
2. package version and peer dependencies;
3. public root exports;
4. advanced subpath exports;
5. DevExtreme-to-SMBC component mappings;
6. styles moved out of `smbc-style`;
7. styles deliberately left in `smbc-style` and why;
8. Golden Source sections migrated;
9. remaining direct DevExtreme imports and justification;
10. validation/test commands executed;
11. `npm pack` contents;
12. visual differences discovered;
13. behavioral differences discovered;
14. accessibility issues discovered;
15. recommended components for the next package release.
