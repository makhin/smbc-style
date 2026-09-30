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
      <FilterPanel className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 xl:grid-cols-4">
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
        <div className="col-span-full flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="tertiary">Reset</Button>
          <Button variant="primary">Apply filters</Button>
        </div>
      </FilterPanel>
    </Section>
  );
}
