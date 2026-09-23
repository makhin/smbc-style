import { Button, Card, KpiCard, StatusBadge } from '@smbc/ui';

import Section from '../components/Section';

export default function CardsSection() {
  return (
    <Section id="cards" title="Cards & page patterns">
      <div className="app-grid app-grid--3">
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
            <div className="app-caption">PAY-2026-008421</div>
          </div>
          <StatusBadge tone="warning">Under review</StatusBadge>
        </Card.Header>
        <Card.Body>
          <dl className="app-details">
            <dt>Beneficiary</dt>
            <dd>Aster Components GmbH</dd>
            <dt>Amount</dt>
            <dd>184,250.45 EUR</dd>
            <dt>Value date</dt>
            <dd>27 Aug 2026</dd>
            <dt>Created by</dt>
            <dd>Operations Team</dd>
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
