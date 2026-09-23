# @smbc/ui 0.1.0 migration

Implemented 23 September 2026. Source project: `../smbc-ui`, separate from both
`smbc-style` and `devextreme-theme`. No theme-package files were changed.
The npm package has not been published to a registry. Source is maintained in
the separate private `makhin/smbc-ui` GitHub repository.

## Package and API

The project contains `src/components`, `src/data-grid`, `src/validation`,
`src/styles`, build/publication/package-check scripts, a real consumer fixture,
a browser integration runner, README, TypeScript configuration and npm lockfile.
TypeScript emits individual ESM modules and declarations; the build copies only
component CSS. React and DevExtreme remain external peers.

| Peer | Range |
|---|---|
| react / react-dom | ^19.2.8 |
| devextreme / devextreme-react | ~26.1.4 |
| @smbc/devextreme-theme | ^0.1.0 |

Root components: Button, TextInput, TextArea, NumberInput, Select, MultiSelect,
DatePicker, Checkbox, RadioGroup, Tabs, Accordion, DataGrid, Dialog,
ConfirmDialog, Toast, LoadingIndicator, Card, Field, StatusBadge, Callout,
EmptyState, KpiCard, Toolbar, FilterPanel and TableShell. Public Props types,
ButtonVariant and StatusBadgeTone are included. Card has Header/Title/Body/Footer
and Toolbar has Group composition. Internal Field context/helpers are not
root exports.

Advanced exports:

- `@smbc/ui/data-grid`: DataGridColumn, DataGridFilterRow, DataGridHeaderFilter,
  DataGridPager, DataGridPaging, DataGridSelection.
- `@smbc/ui/validation`: Validator, RequiredRule, EmailRule, RangeRule,
  ValidationGroup, ValidationSummary.
- `@smbc/ui/styles.css`: reusable component CSS only.

Mappings: TextBox→TextInput, NumberBox→NumberInput, SelectBox→Select,
TagBox→MultiSelect, DateBox→DatePicker, CheckBox→Checkbox,
Popup→Dialog/ConfirmDialog, LoadIndicator→LoadingIndicator. Button, TextArea,
RadioGroup, Tabs, Accordion, DataGrid and Toast retain recognizable names but
use corporate semantic props and/or defaults. Advanced grid and validation
aliases deliberately retain vendor configuration semantics.

See the [package README](../../smbc-ui/README.md) for full APIs, examples,
controlled/uncontrolled behavior, generic options, style order and release rules.

## CSS ownership

Every original components.css rule was classified. Reusable card, toolbar,
filter panel, field, badge, empty state, KPI, callout and table shell rules moved
to the corresponding private `smbc-ui-*` classes. Their responsive rules and
scoped embedded-widget integration rules moved with them. Field label/caption
and dialog/empty-state presentation use component-scoped token styles.

Application components.css retains:

- `.app-divider`: a simple application separator, no new abstraction needed;
- `.app-table-scroll*`: native reference table and its keyboard scroll region;
- `.app-page-loading`, `.app-page-error`: application feedback arrangements.

Global typography/reset, layout.css, pages.css, smbc-shell.css, GlobalHeader,
routing, application shell, fixtures and design-system chrome stay application
owned. Demo layout overrides now use explicit `ds-*` classes passed into
components, rather than selecting package-private classes. The obsolete dialog
host stylesheet and extracted demo dialog/empty-icon CSS were removed.

Tested loading order is UI CSS → application styles → theme CSS → shell helpers.
No additional specificity compensation or duplicate theme loading was added.

## Golden Source migration

Migrated Buttons, Cards, Forms, Components, Filters, States, Status, DataGrid,
Dialogs and Accessibility. Typography, Foundations, Charts and page chrome also
consume extracted cards/callouts/status badges where previously used.
ConfirmDialog now implements the original approval dialog. Chart rendering
itself is unchanged.

The application installs `../smbc-ui/smbc-ui-0.1.0.tgz`; package.json and
package-lock.json record that real artifact. It is not a workspace or symlink.
`npm ls` confirms React 19.2.8, React DOM 19.2.8 and DevExtreme/React 26.1.4 are
deduplicated between the application, UI package and theme.

The only remaining direct DevExtreme React import is
`src/design-system/sections/ChartsSection.tsx`: Chart, Legend and Series from
`devextreme-react/chart`. Its `Palette` import from `devextreme/common/charts`
is type-only. These are the documented out-of-scope chart exception. ESLint
rejects new direct DevExtreme React imports in all other src files.

## Verification

Package commands: `npm ci`, `npm run typecheck`, `npm run build`, `npm run pack:check`,
`npm test`, `npm pack`. Application commands: `npm run lint`,
`npm run typecheck`, `npm run build`, `git diff --check`, and runtime
peer-deduplication inspection.

The tarball has 45 files: 21 JavaScript modules, 21 matching declarations,
component CSS, README and package metadata. No demos, fixtures, screenshots,
source TS, theme assets, fonts or bundled runtimes are included. Publication
metadata is restricted/UNLICENSED and the publish guard rejects public npm.

The installed-consumer test packs the library, creates a temporary application,
installs the tarball and peer packages, typechecks root and advanced subpaths,
builds with Vite and runs Chromium interactions. The clean packed-consumer run
passed, including click callbacks, controlled and default editor values,
read-only/disabled state, external error clearing, help/error associations,
radio selection, date formatting, MultiSelect cancel/apply, tab keyboard
navigation, accordion expand/collapse, dialog focus/Escape, toast lifecycle,
validation summaries and DataGrid selection/filtering/header filters/paging/
custom cells. The fixture uses standards-mode
HTML and explicitly imports both UI and theme styles.

Visual comparisons against the pre-migration source in headless Chromium:

| Surface | Result |
|---|---|
| Full page, 1440 px wide | 0 changed pixels |
| Full page, 760 px wide | 0 changed pixels |
| Full page, 390 px wide | 0 changed pixels |
| Outlined button hover | 0 changed pixels |
| Keyboard focus, light surface | 0 changed pixels |
| Keyboard focus, dark surface | 0 changed pixels |
| Selected tabs | 0 changed pixels |
| Validation errors and summary | 0 changed pixels |
| Open approval dialog | 0 changed pixels |

Reference screenshots and capture scripts are local verification artifacts in
`/tmp/smbc-ui-regression/`, not package contents. The separate before-state Vite
server needed access to the original node_modules directory for local fonts;
comparisons were made after confirming fonts loaded on both sides.

## Accessibility and behavior findings

Icon-only buttons now require an accessible label in both types and runtime.
Field associates labels, help and external errors with inputs/composite roots;
required markers are decorative while aria-required carries the meaning.
DevExtreme can overwrite aria-describedby during invalid-state rendering.
Field preserves vendor descriptions and merges its own help/error references,
including cleanup when descriptions change. External `error` is a controlled
validation owner: clearing it resets validity; omitting it leaves Validator in
charge. Tabs now explicitly label rendered
items because the Fluent hidden sizing span can leave unselected tabs without
an accessible name. Tabs and Accordion ignore transient removal events when
item objects are replaced, preserving React-controlled selection. These shared
component fixes require no theme modification and do not alter visual output.

LoadingIndicator defaults to decorative, preserving the existing textual status
announcement. Disabled/read-only controls and vendor keyboard behavior remain
in the underlying widgets. The advanced validation model is unchanged.

Automated checks do not substitute for a screen-reader audit or Firefox/WebKit
coverage. Those remain manual follow-up checks. The application retains Vite's
large-chunk warning; this extraction does not attempt app-level code splitting.
DevExtreme evaluation-license warnings in the temporary consumer are unrelated
to wrapper behavior; licensing configuration remains application-owned.

## Next release

Consider a semantic validationRules API, a reusable LoadingState, and a grouped
field-description pattern once real consumers need them. Keep Chart and shell
abstractions out until repeated application requirements justify them. Document
breaking changes explicitly even in 0.x.
