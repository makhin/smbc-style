import { Button, Card, KpiCard, StatusBadge } from '@smbc/ui';

import Section from '../components/Section';

export default function CardsSection() {
  return (
    <Section id="cards" title="Cards & page patterns">
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Payments today" value="184" meta="12 awaiting review" />
        <KpiCard label="Total value" value="€8.4m" meta="Across 7 currencies" />
        <KpiCard
          label="Exceptions"
          value="6"
          meta="2 require immediate attention"
        />
      </div>

      <Card>
        <Card.Header>
          <div>
            <Card.Title>Payment summary</Card.Title>
            <div className="text-xs text-fg-muted">PAY-2026-008421</div>
          </div>
          <StatusBadge tone="warning">Under review</StatusBadge>
        </Card.Header>
        <Card.Body>
          <dl className="m-0 grid grid-cols-1 gap-x-4 gap-y-1 md:grid-cols-[minmax(140px,220px)_minmax(0,1fr)] md:gap-y-2">
            <dt className="text-fg-muted">Beneficiary</dt>
            <dd className="m-0 text-fg max-md:not-last:mb-2">Aster Components GmbH</dd>
            <dt className="text-fg-muted">Amount</dt>
            <dd className="m-0 text-fg max-md:not-last:mb-2">184,250.45 EUR</dd>
            <dt className="text-fg-muted">Value date</dt>
            <dd className="m-0 text-fg max-md:not-last:mb-2">27 Aug 2026</dd>
            <dt className="text-fg-muted">Created by</dt>
            <dd className="m-0 text-fg max-md:not-last:mb-2">Operations Team</dd>
          </dl>
        </Card.Body>
        <Card.Footer>
          <Button variant="tertiary">Back</Button>
          <Button variant="primary">Approve</Button>
        </Card.Footer>
      </Card>
    </Section>
  );
}
