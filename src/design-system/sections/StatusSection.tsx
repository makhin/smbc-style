import { Callout, StatusBadge } from '@smbc/ui';
import Section from '../components/Section';

export default function StatusSection() {
  return (
    <Section
      id="status"
      title="Status system"
      description="Business state uses text plus semantic styling; colour is never the only cue."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge>Cancelled</StatusBadge>
        <StatusBadge tone="info">Pending</StatusBadge>
        <StatusBadge tone="warning">Under review</StatusBadge>
        <StatusBadge tone="success">Approved</StatusBadge>
        <StatusBadge tone="danger">Rejected</StatusBadge>
        <StatusBadge tone="danger">Failed</StatusBadge>
        <StatusBadge tone="brand">Selected</StatusBadge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Callout className="flex flex-col gap-1">
          <strong>Information</strong>
          <span>The payment has supporting documents.</span>
        </Callout>
        <Callout className="flex flex-col gap-1" tone="brand">
          <strong>Brand highlight</strong>
          <span>Fresh Green is emphasis, not a universal success colour.</span>
        </Callout>
        <Callout className="flex flex-col gap-1" tone="warning">
          <strong>Attention required</strong>
          <span>Beneficiary details changed since the previous payment.</span>
        </Callout>
        <Callout className="flex flex-col gap-1" tone="danger">
          <strong>Processing failed</strong>
          <span>The payment could not be submitted.</span>
        </Callout>
      </div>
    </Section>
  );
}
