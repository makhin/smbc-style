import {
  Button,
  DatePicker,
  Field,
  FilterPanel,
  Select,
  TextInput,
} from '@smbc/ui';

import Section from '../components/Section';

const statuses = ['Pending', 'Under review', 'Approved', 'Rejected', 'Failed'];

export default function FiltersSection() {
  return (
    <Section id="filters" title="Filters">
      <FilterPanel>
        <Field id="ds-filter-reference" label="Reference">
          <TextInput placeholder="Payment reference" />
        </Field>
        <Field id="ds-filter-status" label="Status">
          <Select options={statuses} placeholder="All statuses" clearable />
        </Field>
        <Field id="ds-filter-from" label="From">
          <DatePicker />
        </Field>
        <Field id="ds-filter-to" label="To">
          <DatePicker />
        </Field>
        <div className="ds-filter-actions">
          <Button variant="tertiary">Reset</Button>
          <Button variant="primary">Apply filters</Button>
        </div>
      </FilterPanel>
    </Section>
  );
}
