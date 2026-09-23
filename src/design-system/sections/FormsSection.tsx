import {
  Card,
  Checkbox,
  DatePicker,
  Field,
  RadioGroup,
  Select,
  TextArea,
  TextInput,
} from '@smbc/ui';
import { Validator, RequiredRule } from '@smbc/ui/validation';

import formOptions from '../data/form-options.json';
import Section from '../components/Section';

export default function FormsSection() {
  return (
    <Section
      id="forms"
      title="Forms"
      description="Default, validation, read-only, disabled, and selection states."
    >
      <Card>
        <Card.Body>
          <div className="ds-form-grid">
            <Field id="ds-reference" label="Payment reference">
              <TextInput defaultValue="PAY-2026-008421" />
            </Field>

            <Field id="ds-country" label="Country">
              <Select
                options={formOptions.countries}
                defaultValue="Poland"
                searchable
              />
            </Field>

            <Field id="ds-settlement-date" label="Settlement date">
              <DatePicker
                defaultValue={new Date(2026, 7, 27)}
                displayFormat="dd MMM yyyy"
              />
            </Field>

            <Field id="ds-priority" label="Priority">
              <RadioGroup
                options={formOptions.priorities}
                defaultValue="Standard"
                orientation="horizontal"
              />
            </Field>

            <Field wide id="ds-payment-note" label="Payment note" required>
              <TextArea
                height={88}
                placeholder="Enter a short operational note"
              >
                <Validator>
                  <RequiredRule message="Enter a payment note." />
                </Validator>
              </TextArea>
            </Field>

            <Field id="ds-read-only-value" label="Read-only value">
              <TextInput value="SMBC Bank International" readOnly />
            </Field>

            <Field id="ds-disabled-value" label="Disabled value">
              <TextInput value="Unavailable" disabled />
            </Field>

            <Field className="ds-checkbox-field">
              <Checkbox label="Require additional approval" />
            </Field>
          </div>
        </Card.Body>
      </Card>
    </Section>
  );
}
