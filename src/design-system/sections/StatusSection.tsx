import { Callout, StatusBadge } from '@smbc/ui';
import Section from '../components/Section';

export default function StatusSection() {
  return (
    <Section
      id="status"
      title="Status system"
      description="Business state uses text plus semantic styling; colour is never the only cue."
    >
      <div className="ds-control-row">
        <StatusBadge>Cancelled</StatusBadge>
        <StatusBadge tone="info">Pending</StatusBadge>
        <StatusBadge tone="warning">Under review</StatusBadge>
        <StatusBadge tone="success">Approved</StatusBadge>
        <StatusBadge tone="danger">Rejected</StatusBadge>
        <StatusBadge tone="danger">Failed</StatusBadge>
        <StatusBadge tone="brand">Selected</StatusBadge>
      </div>

      <div className="ds-message-grid">
        <Callout className="ds-message">
          <strong>Information</strong>
          <span>The payment has supporting documents.</span>
        </Callout>
        <Callout className="ds-message" tone="brand">
          <strong>Brand highlight</strong>
          <span>Fresh Green is emphasis, not a universal success colour.</span>
        </Callout>
        <Callout className="ds-message" tone="warning">
          <strong>Attention required</strong>
          <span>Beneficiary details changed since the previous payment.</span>
        </Callout>
        <Callout className="ds-message" tone="danger">
          <strong>Processing failed</strong>
          <span>The payment could not be submitted.</span>
        </Callout>
      </div>
    </Section>
  );
}
