import { Button, Card, Tabs } from '@smbc/ui';
import { useState } from 'react';

import Section from '../components/Section';

const tabs = [
  { id: 0, text: 'Overview' },
  { id: 1, text: 'Payment details' },
  { id: 2, text: 'Audit history' },
];

export default function AccessibilitySection() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Section
      id="accessibility"
      title="Accessibility reference"
      description="Focus, target size, keyboard navigation, and contrast must be visible here."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <Card.Body>
            <h3>Keyboard focus</h3>
            <p className="text-fg-muted">
              Tab through these controls. Focus must remain obvious on both
              light and dark surfaces.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-card border-[length:var(--border-width-default)] border-border bg-surface p-4">
              <Button>Light surface</Button>
              <a href="#accessibility">Text link</a>
            </div>

            <div className="ds-focus-surface--dark mt-4 flex flex-wrap items-center gap-3 rounded-card bg-primary p-4 [--focus-ring-color:var(--focus-ring-color-on-dark)]">
              <Button devExtremeProps={{ type: 'normal' }} variant="secondary">
                Dark surface
              </Button>
              <a className="text-fg-inverse" href="#accessibility">Text link</a>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <h3>Tabs</h3>
            <Tabs
              items={tabs}
              selectedIndex={selectedTab}
              onChange={setSelectedTab}
            />
            <div className="border-[length:var(--border-width-default)] border-t-0 border-border bg-surface p-4">
              Selected: <strong>{tabs[selectedTab].text}</strong>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Section>
  );
}
