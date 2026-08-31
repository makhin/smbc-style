import AccessibilitySection from './sections/AccessibilitySection';
import ButtonsSection from './sections/ButtonsSection';
import CardsSection from './sections/CardsSection';
import ChartsSection from './sections/ChartsSection';
import ComponentsSection from './sections/ComponentsSection';
import DataGridSection from './sections/DataGridSection';
import DialogsSection from './sections/DialogsSection';
import FiltersSection from './sections/FiltersSection';
import FormsSection from './sections/FormsSection';
import FoundationsSection from './sections/FoundationsSection';
import StatesSection from './sections/StatesSection';
import StatusSection from './sections/StatusSection';
import TypographySection from './sections/TypographySection';

import './design-system.css';

const navigation = [
  ['foundations', 'Foundations'],
  ['typography', 'Typography'],
  ['buttons', 'Buttons'],
  ['forms', 'Forms'],
  ['components', 'More components'],
  ['status', 'Status'],
  ['cards', 'Cards'],
  ['filters', 'Filters'],
  ['grid', 'DataGrid'],
  ['dialogs', 'Dialogs & feedback'],
  ['states', 'States'],
  ['charts', 'Charts'],
  ['accessibility', 'Accessibility'],
] as const;

export default function DesignSystemPage() {
  return (
    <div className="ds-page">
      <aside className="ds-nav" aria-label="Design system sections">
        <div className="ds-nav__brand">
          <strong>Design system</strong>
          <span>Application UI reference</span>
        </div>

        <nav>
          {navigation.map(([href, label]) => (
            <a key={href} href={`#${href}`}>
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="ds-main">
        <header className="ds-hero">
          <div>
            <div className="ds-eyebrow">Design system reference</div>
            <h1 className="app-display-title">SMBC Application UI</h1>
            <p>
              Visual regression surface for shared application tokens, patterns,
              accessibility states, and DevExtreme components.
            </p>
          </div>
          <span className="app-badge app-badge--brand">v1.2</span>
        </header>

        <FoundationsSection />
        <TypographySection />
        <ButtonsSection />
        <FormsSection />
        <ComponentsSection />
        <StatusSection />
        <CardsSection />
        <FiltersSection />
        <DataGridSection />
        <DialogsSection />
        <StatesSection />
        <ChartsSection />
        <AccessibilitySection />

        <footer className="ds-footer">
          <span>SMBC Application Design System</span>
          <span>Reference surface · DevExtreme 25.1</span>
        </footer>
      </main>
    </div>
  );
}
