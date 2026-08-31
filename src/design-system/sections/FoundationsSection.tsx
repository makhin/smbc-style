import Section from '../components/Section';

const swatches = [
  ['Brand green 900', '--color-brand-green-900'],
  ['Brand green 800', '--color-brand-green-800'],
  ['Brand green 700', '--color-brand-green-700'],
  ['Brand green 600', '--color-brand-green-600'],
  ['Fresh 500', '--color-brand-fresh-500'],
  ['Fresh 300', '--color-brand-fresh-300'],
  ['Fresh 100', '--color-brand-fresh-100'],
  ['Page background', '--color-page-background'],
  ['Default border', '--color-border-default'],
  ['Control border', '--color-border-control'],
  ['Primary text', '--color-text-primary'],
  ['Secondary text', '--color-text-secondary'],
] as const;

const spacingValues = [2, 4, 8, 12, 16, 20, 24, 32, 40, 48];

export default function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      description="Colour, spacing, shape, and surface rules."
    >
      <div className="ds-swatch-grid">
        {swatches.map(([name, token]) => (
          <div className="ds-swatch" key={name}>
            <div
              className="ds-swatch__color"
              style={{ background: `var(${token})` }}
            />
            <div className="ds-swatch__meta">
              <strong>{name}</strong>
              <code>{token}</code>
            </div>
          </div>
        ))}
      </div>

      <div className="ds-subsection">
        <h3>Spacing scale</h3>
        <div className="ds-spacing-row">
          {spacingValues.map((value) => (
            <div className="ds-spacing-item" key={value}>
              <div style={{ width: value, height: value }} />
              <span>{value}px</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ds-subsection">
        <h3>Shape</h3>
        <div className="ds-control-row">
          <div className="ds-shape ds-shape--control">3px control</div>
          <div className="ds-shape ds-shape--card">6px card</div>
          <span className="app-badge app-badge--brand">Pill status</span>
        </div>
      </div>
    </Section>
  );
}
