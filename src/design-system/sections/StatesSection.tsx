import { Button, Callout, Card, EmptyState, LoadingIndicator } from '@smbc/ui';
import { useEffect, useRef, useState } from 'react';

import Section from '../components/Section';

export default function StatesSection() {
  const [loadingDemo, setLoadingDemo] = useState(false);
  const loadingTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(loadingTimeout.current);
  }, []);

  const runLoadingDemo = () => {
    window.clearTimeout(loadingTimeout.current);
    setLoadingDemo(true);
    loadingTimeout.current = window.setTimeout(() => {
      setLoadingDemo(false);
      loadingTimeout.current = undefined;
    }, 1200);
  };

  return (
    <Section id="states" title="Loading, empty & error states">
      <div className="ds-state-grid">
        <Card>
          <Card.Header>
            <Card.Title>Loading</Card.Title>
          </Card.Header>
          <Card.Body className="ds-loading-demo" aria-busy={loadingDemo}>
            {loadingDemo ? (
              <div
                className="app-page-loading"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <LoadingIndicator />
                <span>Refreshing payments…</span>
              </div>
            ) : (
              <Button onClick={runLoadingDemo}>Run loading state</Button>
            )}
          </Card.Body>
        </Card>

        <EmptyState
          icon="search"
          title="No payments match these filters"
          description="Try changing the date range or clearing one or more filters."
          action={<Button variant="secondary">Clear filters</Button>}
        />

        <Card>
          <Card.Header>
            <Card.Title>Error</Card.Title>
          </Card.Header>
          <Card.Body>
            <Callout className="app-page-error" tone="danger" role="alert">
              <strong>Unable to load payment history</strong>
              <span>Try again. If the problem continues, contact support.</span>
            </Callout>
          </Card.Body>
        </Card>
      </div>
    </Section>
  );
}
