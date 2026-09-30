import { StatusBadge } from '@smbc/ui';
import Section from '../components/Section';

type Swatch = readonly [name: string, token: string, value: string];

const primarySwatches = [
  ['Traditional Green', '--color-brand-traditional', '#004831'],
  ['Fresh Green', '--color-brand-fresh-500', '#C4D600'],
] as const satisfies readonly Swatch[];

const traditionalGreenTints = [
  ['Traditional Green 100%', '--color-brand-traditional', '#004831'],
  ['Traditional Green 90%', '--color-brand-traditional-tint-90', '#005742'],
  ['Traditional Green 80%', '--color-brand-traditional-tint-80', '#006451'],
  ['Traditional Green 70%', '--color-brand-traditional-tint-70', '#137260'],
  ['Traditional Green 60%', '--color-brand-traditional-tint-60', '#398171'],
  ['Traditional Green 50%', '--color-brand-traditional-tint-50', '#589284'],
  ['Traditional Green 40%', '--color-brand-traditional-tint-40', '#75A499'],
  ['Traditional Green 30%', '--color-brand-traditional-tint-30', '#91B7AE'],
  ['Traditional Green 20%', '--color-brand-traditional-tint-20', '#B1CCC4'],
  ['Traditional Green 10%', '--color-brand-traditional-tint-10', '#D5E4E1'],
] as const satisfies readonly Swatch[];

const supplementarySwatches = [
  ['Pure crimson', '--color-brand-pure-crimson', '#C3272B'],
  ['Daylily', '--color-brand-daylily', '#FF8936'],
  ['Triandra grass', '--color-brand-triandra-grass', '#E2B13C'],
  ['Thousand herbs', '--color-brand-thousand-herbs', '#317589'],
  ['Navy', '--color-brand-navy', '#003171'],
  ['Vine grape', '--color-brand-vine-grape', '#6D2B50'],
  ['Cherry blossom', '--color-brand-cherry-blossom', '#FCC9BA'],
  ['Smoked bamboo', '--color-brand-smoked-bamboo', '#593A27'],
  ['Indigo ink', '--color-brand-indigo-ink', '#393432'],
] as const satisfies readonly Swatch[];

const interfaceSwatches = [
  ['Page background', '--color-page-background', '#F6F8F6'],
  ['Default border', '--color-border-default', '#D8DDD9'],
  ['Control border', '--color-border-control', '#7F8C85'],
  ['Primary text', '--color-text-primary', '#1F2522'],
  ['Secondary text', '--color-text-secondary', '#68716C'],
] as const satisfies readonly Swatch[];

const spacingValues = [2, 4, 8, 12, 16, 20, 24, 32, 40, 48];

function SwatchGrid({ swatches }: { swatches: readonly Swatch[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {swatches.map(([name, token, value]) => (
        <div className="overflow-hidden rounded-card border-[length:var(--border-width-default)] border-border bg-surface" key={name}>
          <div
            className="h-18 border-b-[length:var(--border-width-default)] border-border"
            style={{ background: `var(${token})` }}
          />
          <div className="flex flex-col gap-0.5 p-3">
            <strong className="text-sm">{name}</strong>
            <code className="text-xs text-fg-muted">{value}</code>
            <code className="text-xs text-fg-muted">{token}</code>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      description="Corporate colour, spacing, shape, and interface surface rules."
    >
      <div className="mt-4 flex flex-col gap-4">
        <h3>Primary corporate colours</h3>
        <p className="text-fg-muted">
          Traditional Green is dominant. Fresh Green is a restrained accent; the
          project keeps #C4D600 pending confirmation against the source PDF.
        </p>
        <SwatchGrid swatches={primarySwatches} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h3>Traditional Green tints</h3>
        <SwatchGrid swatches={traditionalGreenTints} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h3>Supplementary corporate colours</h3>
        <p className="text-fg-muted">
          Use these only when a category or semantic role needs distinction;
          they are not decorative page colours.
        </p>
        <SwatchGrid swatches={supplementarySwatches} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h3>Interface neutrals</h3>
        <SwatchGrid swatches={interfaceSwatches} />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h3>Spacing scale</h3>
        <div className="flex flex-wrap items-end gap-3">
          {spacingValues.map((value) => (
            <div className="flex min-w-[54px] flex-col items-center gap-2" key={value}>
              <div className="min-h-1 min-w-1 bg-primary" style={{ width: value, height: value }} />
              <span className="text-xs text-fg-muted">{value}px</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h3>Shape</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="grid min-h-14 w-32 place-items-center rounded-control border-[length:var(--border-width-default)] border-border-strong bg-surface">3px control</div>
          <div className="grid min-h-14 w-32 place-items-center rounded-card border-[length:var(--border-width-default)] border-border-strong bg-surface">6px card</div>
          <StatusBadge tone="brand">Pill status</StatusBadge>
        </div>
      </div>
    </Section>
  );
}
