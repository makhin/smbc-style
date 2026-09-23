import { Card } from '@smbc/ui';
import Chart, { Legend, Series } from 'devextreme-react/chart';

import { SMBC_VIZ_PALETTE_NAME } from '@smbc/devextreme-theme/viz';
import type { Palette } from 'devextreme/common/charts';
import Section from '../components/Section';
import paymentVolume from '../data/payment-volume.json';

export default function ChartsSection() {
  return (
    <Section
      id="charts"
      title="Charts"
      description="SVG-based components use the separately registered SMBC palette."
    >
      <Card>
        <Card.Header>
          <Card.Title>Daily payment volume</Card.Title>
        </Card.Header>
        <Card.Body>
          <Chart
            dataSource={paymentVolume}
            palette={SMBC_VIZ_PALETTE_NAME as Palette}
            height={320}
          >
            <Series
              valueField="approved"
              argumentField="day"
              name="Approved"
              type="bar"
            />
            <Series
              valueField="pending"
              argumentField="day"
              name="Pending"
              type="line"
              dashStyle="dash"
            />
            <Legend verticalAlignment="top" horizontalAlignment="right" />
          </Chart>
        </Card.Body>
      </Card>
    </Section>
  );
}
