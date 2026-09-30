import { Callout, Card } from '@smbc/ui';
import Section from '../components/Section';

export default function TypographySection() {
  return (
    <Section
      id="typography"
      title="Typography"
      description="Left-aligned sentence case with a consistent Myriad Pro application hierarchy."
    >
      <Card>
        <Card.Body className="flex flex-col gap-6">
          <div>
            <span className="mb-1 block text-xs text-fg-muted">
              Brand display · Capitolium 30 / 700
            </span>
            <div className="font-brand text-3xl font-bold tracking-[-0.02em]">A trusted partner</div>
            <p className="text-xs text-fg-muted">
              Capitolium is reserved for occasional brand display headings.
            </p>
          </div>
          <div>
            <span className="mb-1 block text-xs text-fg-muted">
              Application page title · Myriad Pro 24 / 600
            </span>
            <div className="text-2xl leading-tight font-semibold">Payment review</div>
          </div>
          <div>
            <span className="mb-1 block text-xs text-fg-muted">
              Application section · Myriad Pro 20 / 600
            </span>
            <h2>Payment information</h2>
          </div>
          <div>
            <span className="mb-1 block text-xs text-fg-muted">
              Component title · Myriad Pro 16 / 600
            </span>
            <h3>Approval history</h3>
          </div>
          <div>
            <span className="mb-1 block text-xs text-fg-muted">Standard UI · 14 / 400</span>
            <p>Standard application body text for operational information.</p>
          </div>
          <div>
            <span className="mb-1 block text-xs text-fg-muted">Secondary</span>
            <p className="text-fg-muted">
              Secondary information must remain clearly readable.
            </p>
          </div>
          <div>
            <span className="mb-1 block text-xs text-fg-muted">Caption · 12 / 400</span>
            <p className="text-xs text-fg-muted">Last updated 27 Aug 2026, 14:32 CET</p>
          </div>
          <Callout>
            <strong>Use sentence case</strong>
            <p>
              Capitalise only the first word and proper names. Keep body copy
              left aligned and use one family in varying sizes and weights.
            </p>
          </Callout>
        </Card.Body>
      </Card>
    </Section>
  );
}
