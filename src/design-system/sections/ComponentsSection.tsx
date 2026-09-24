import { useState } from 'react';
import {
  Accordion,
  Button,
  Card,
  Field,
  MultiSelect,
  NumberInput,
  TextInput,
  Toolbar,
} from '@smbc/ui';
import {
  EmailRule,
  RangeRule,
  RequiredRule,
  ValidationGroup,
  ValidationSummary,
  Validator,
} from '@smbc/ui/validation';

import Section from '../components/Section';
import formOptions from '../data/form-options.json';

const accordionItems = [
  {
    title: 'Payment details',
    text: 'Core transaction data, settlement instructions, and beneficiary information.',
  },
  {
    title: 'Compliance checks',
    text: 'Screening results, policy exceptions, and any checks requiring manual review.',
  },
  {
    title: 'Audit history',
    text: 'A chronological record of changes, decisions, and responsible users.',
  },
];

export default function ComponentsSection() {
  const [toolbarAction, setToolbarAction] = useState('Ready');
  const renderRefresh = () => (
    <Button icon="refresh" onClick={() => setToolbarAction('Payments refreshed')}>
      Refresh payments
    </Button>
  );
  const renderExport = () => (
    <Button icon="exportxlsx" onClick={() => setToolbarAction('Export requested')}>
      Export payments
    </Button>
  );
  const renderHistory = () => (
    <Button icon="clock" onClick={() => setToolbarAction('History requested')}>
      View history
    </Button>
  );
  const renderDelete = () => <Button disabled>Delete selected</Button>;

  return (
    <Section
      id="components"
      title="More DevExtreme components"
      description="A small set of common application patterns beyond the basic form controls."
    >
      <div className="ds-component-grid">
        <Card className="ds-component-card ds-component-grid__wide">
          <Card.Header>
            <div>
              <Card.Title>Toolbar</Card.Title>
              <div className="app-caption">
                Actions move into the menu when space is limited
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Toolbar devExtremeProps={{ elementAttr: { id: 'ds-toolbar', 'aria-label': 'Payment actions' } }}>
              <Toolbar.Item location="before" render={() => <Toolbar.Group>Payments</Toolbar.Group>} />
              <Toolbar.Item
                location="after"
                locateInMenu="auto"
                render={renderRefresh}
                menuItemRender={renderRefresh}
              />
              <Toolbar.Item
                location="after"
                locateInMenu="auto"
                render={renderExport}
                menuItemRender={renderExport}
              />
              <Toolbar.Item
                location="after"
                locateInMenu="always"
                render={renderHistory}
                menuItemRender={renderHistory}
              />
              <Toolbar.Item
                location="after"
                locateInMenu="always"
                disabled
                render={renderDelete}
                menuItemRender={renderDelete}
              />
            </Toolbar>
            <p role="status" id="ds-toolbar-status" className="app-caption">{toolbarAction}</p>
          </Card.Body>
        </Card>

        <Card className="ds-component-card">
          <Card.Header>
            <div>
              <Card.Title>NumberBox</Card.Title>
              <div className="app-caption">Formatted numeric input</div>
            </div>
          </Card.Header>
          <Card.Body>
            <Field
              id="ds-payment-amount"
              label="Payment amount"
              help="EUR · minimum 0.00"
            >
              <NumberInput
                defaultValue={184250.45}
                format="#,##0.00"
                min={0}
                showSpinButtons
              />
            </Field>
          </Card.Body>
        </Card>

        <Card className="ds-component-card">
          <Card.Header>
            <div>
              <Card.Title>TagBox</Card.Title>
              <div className="app-caption">Searchable multiple selection</div>
            </div>
          </Card.Header>
          <Card.Body>
            <Field
              id="ds-review-teams"
              label="Review teams"
              help="Search, select several values, then apply."
            >
              <MultiSelect
                options={formOptions.reviewTeams}
                defaultValue={['Payments Operations', 'Financial Crime']}
                placeholder="Select teams"
                searchable
                selectionControls
                applyMode="buttons"
              />
            </Field>
          </Card.Body>
        </Card>

        <Card className="ds-component-card ds-component-grid__wide">
          <Card.Header>
            <div>
              <Card.Title>Accordion</Card.Title>
              <div className="app-caption">
                Progressive disclosure for related content
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Accordion
              items={accordionItems}
              defaultSelectedIndex={0}
              collapsible
              multiple={false}
            />
          </Card.Body>
        </Card>

        <Card className="ds-component-card ds-component-grid__wide">
          <Card.Header>
            <div>
              <Card.Title>Validation</Card.Title>
              <div className="app-caption">
                Field-level rules with a form-level summary
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <form
              className="ds-validation-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <ValidationGroup>
                <div className="ds-validation-fields">
                  <Field id="ds-approver-email" label="Approver email" required>
                    <TextInput placeholder="name@smbcgroup.com">
                      <Validator>
                        <RequiredRule message="Enter the approver email." />
                        <EmailRule message="Enter a valid email address." />
                      </Validator>
                    </TextInput>
                  </Field>

                  <Field id="ds-approval-limit" label="Approval limit" required>
                    <NumberInput
                      defaultValue={0}
                      format="#,##0.00"
                      showSpinButtons
                    >
                      <Validator>
                        <RequiredRule message="Enter the approval limit." />
                        <RangeRule
                          min={100}
                          max={1000000}
                          message="Use a value from 100.00 to 1,000,000.00."
                        />
                      </Validator>
                    </NumberInput>
                  </Field>
                </div>

                <div className="ds-validation-actions">
                  <ValidationSummary />
                  <Button submit variant="primary">
                    Validate fields
                  </Button>
                </div>
              </ValidationGroup>
            </form>
          </Card.Body>
        </Card>
      </div>
    </Section>
  );
}
