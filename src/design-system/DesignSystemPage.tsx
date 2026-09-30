import { StatusBadge } from '@smbc/ui';
import AccessibilitySection from './sections/AccessibilitySection';
import ButtonsSection from './sections/ButtonsSection';
import CardsSection from './sections/CardsSection';
import ComponentsSection from './sections/ComponentsSection';
import DataGridSection from './sections/DataGridSection';
import DialogsSection from './sections/DialogsSection';
import FiltersSection from './sections/FiltersSection';
import FormsSection from './sections/FormsSection';
import FoundationsSection from './sections/FoundationsSection';
import StatesSection from './sections/StatesSection';
import StatusSection from './sections/StatusSection';
import TypographySection from './sections/TypographySection';


const sections = [
  {
    id: 'foundations',
    navigationLabel: 'Foundations',
    Component: FoundationsSection,
  },
  {
    id: 'typography',
    navigationLabel: 'Typography',
    Component: TypographySection,
  },
  { id: 'buttons', navigationLabel: 'Buttons', Component: ButtonsSection },
  { id: 'forms', navigationLabel: 'Forms', Component: FormsSection },
  {
    id: 'components',
    navigationLabel: 'More components',
    Component: ComponentsSection,
  },
  { id: 'status', navigationLabel: 'Status', Component: StatusSection },
  { id: 'cards', navigationLabel: 'Cards', Component: CardsSection },
  { id: 'filters', navigationLabel: 'Filters', Component: FiltersSection },
  { id: 'grid', navigationLabel: 'DataGrid', Component: DataGridSection },
  {
    id: 'dialogs',
    navigationLabel: 'Dialogs & feedback',
    Component: DialogsSection,
  },
  { id: 'states', navigationLabel: 'States', Component: StatesSection },
  {
    id: 'accessibility',
    navigationLabel: 'Accessibility',
    Component: AccessibilitySection,
  },
] as const;

export default function DesignSystemPage() {
  return (
    <div className="grid min-h-[calc(100vh-var(--global-header-height))] grid-cols-1 bg-page lg:grid-cols-[224px_minmax(0,1fr)]">
      <aside className="reference-nav border-r-[length:var(--border-width-default)] border-border-inverse-subtle bg-primary text-fg-inverse [--focus-ring-color:var(--focus-ring-color-on-dark)] lg:sticky lg:top-(--sticky-header-offset) lg:h-[calc(100vh-var(--sticky-header-offset))] lg:overflow-y-auto" aria-label="Design system sections">
        <div className="flex min-h-18 flex-col items-start gap-1 border-b-[length:var(--border-width-default)] border-border-inverse-subtle p-4">
          <strong className="text-lg font-bold text-fg-inverse">Design system</strong>
          <span className="block text-xs text-nav-secondary">Application UI reference</span>
        </div>

        <nav className="flex overflow-x-auto p-2 lg:block lg:px-0 lg:pt-3 lg:pb-6">
          {sections.map(({ id, navigationLabel }) => (
            <a className="block shrink-0 border-b-[length:var(--border-width-emphasis)] border-transparent px-4 py-2 text-sm text-nav-text hover:bg-nav-hover hover:text-fg-inverse focus-visible:bg-nav-hover focus-visible:text-fg-inverse focus-visible:outline-offset-(--outline-offset-inset) lg:border-b-0 lg:border-l-[length:var(--border-width-emphasis)]" key={id} href={`#${id}`}>
              {navigationLabel}
            </a>
          ))}
        </nav>
      </aside>

      <main className="w-full max-w-[1500px] min-w-0 px-3 pb-12 sm:px-4 lg:px-8">
        <header className="flex flex-col items-start justify-between gap-6 border-b-[length:var(--border-width-default)] border-border pt-10 pb-8 sm:flex-row">
          <div>
            <div className="text-xs font-bold text-primary">Design system reference</div>
            <h1 className="mt-1 font-brand text-3xl font-semibold tracking-[-0.02em]">SMBC application UI</h1>
            <p className="mt-2 max-w-[760px] text-fg-muted">
              Visual regression surface for shared application tokens, patterns,
              accessibility states, and DevExtreme components.
            </p>
          </div>
          <StatusBadge tone="brand">v1.2</StatusBadge>
        </header>

        {sections.map(({ id, Component }) => (
          <Component key={id} />
        ))}

        <footer className="flex flex-col justify-between gap-4 pt-6 text-xs text-fg-muted sm:flex-row">
          <span>SMBC application design system</span>
          <span>Reference surface · DevExtreme 26.1</span>
        </footer>
      </main>
    </div>
  );
}
