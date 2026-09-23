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
      <div className="ds-accessibility-grid">
        <Card>
          <Card.Body>
            <h3>Keyboard focus</h3>
            <p className="app-muted">
              Tab through these controls. Focus must remain obvious on both
              light and dark surfaces.
            </p>

            <div className="ds-focus-surface ds-focus-surface--light">
              <Button>Light surface</Button>
              <a href="#accessibility">Text link</a>
            </div>

            <div className="ds-focus-surface ds-focus-surface--dark">
              <Button devExtremeProps={{ type: 'normal' }} variant="secondary">
                Dark surface
              </Button>
              <a href="#accessibility">Text link</a>
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
            <div className="ds-tab-content">
              Selected: <strong>{tabs[selectedTab].text}</strong>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Section>
  );
}
