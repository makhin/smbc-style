import { Button } from '@smbc/ui';

import Section from '../components/Section';

export default function ButtonsSection() {
  return (
    <Section
      id="buttons"
      title="Buttons"
      description="Primary, secondary, destructive, disabled, and icon-only actions."
    >
      <div className="ds-control-row">
        <Button variant="primary">Approve payment</Button>
        <Button icon="exportxlsx" variant="secondary">
          Export
        </Button>
        <Button variant="tertiary">Cancel</Button>
        <Button icon="trash" variant="danger">
          Delete payment
        </Button>
        <Button icon="refresh" ariaLabel="Refresh" />
        <Button disabled>Disabled</Button>
      </div>
    </Section>
  );
}
