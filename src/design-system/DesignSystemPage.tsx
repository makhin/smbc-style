import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import Accordion from 'devextreme-react/accordion';
import Button from 'devextreme-react/button';
import CheckBox from 'devextreme-react/check-box';
import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  Pager,
  Paging,
  Selection,
} from 'devextreme-react/data-grid';
import DateBox from 'devextreme-react/date-box';
import LoadIndicator from 'devextreme-react/load-indicator';
import NumberBox from 'devextreme-react/number-box';
import Popup from 'devextreme-react/popup';
import RadioGroup from 'devextreme-react/radio-group';
import SelectBox from 'devextreme-react/select-box';
import Tabs from 'devextreme-react/tabs';
import TagBox from 'devextreme-react/tag-box';
import TextArea from 'devextreme-react/text-area';
import TextBox from 'devextreme-react/text-box';
import Toast from 'devextreme-react/toast';
import ValidationGroup from 'devextreme-react/validation-group';
import ValidationSummary from 'devextreme-react/validation-summary';
import Validator, {
  EmailRule,
  RangeRule,
  RequiredRule,
} from 'devextreme-react/validator';
import Chart, {
  Legend,
  Series,
} from 'devextreme-react/chart';
import { smbcVizPalette } from '../theme/smbc-viz-palette';

import './design-system.css';

type PaymentStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Cancelled'
  | 'Failed';

type PaymentRow = {
  id: number;
  reference: string;
  beneficiary: string;
  amount: number;
  currency: string;
  valueDate: string;
  status: PaymentStatus;
};

const payments: PaymentRow[] = [
  {
    id: 1,
    reference: 'PAY-2026-008421',
    beneficiary: 'Aster Components GmbH',
    amount: 184250.45,
    currency: 'EUR',
    valueDate: '2026-08-27',
    status: 'Under Review',
  },
  {
    id: 2,
    reference: 'PAY-2026-008422',
    beneficiary: 'Northbridge Holdings Ltd',
    amount: 78500,
    currency: 'GBP',
    valueDate: '2026-08-28',
    status: 'Approved',
  },
  {
    id: 3,
    reference: 'PAY-2026-008423',
    beneficiary: 'Hikari Trading Co.',
    amount: 12500000,
    currency: 'JPY',
    valueDate: '2026-08-28',
    status: 'Pending',
  },
  {
    id: 4,
    reference: 'PAY-2026-008424',
    beneficiary: 'Baltic Services Sp. z o.o.',
    amount: 42000,
    currency: 'PLN',
    valueDate: '2026-08-29',
    status: 'Rejected',
  },
  {
    id: 5,
    reference: 'PAY-2026-008425',
    beneficiary: 'Meridian Logistics AG',
    amount: 217900.2,
    currency: 'CHF',
    valueDate: '2026-08-30',
    status: 'Failed',
  },
];

const chartData = [
  { day: 'Mon', approved: 42, pending: 14 },
  { day: 'Tue', approved: 51, pending: 18 },
  { day: 'Wed', approved: 47, pending: 10 },
  { day: 'Thu', approved: 64, pending: 16 },
  { day: 'Fri', approved: 58, pending: 13 },
];

const countries = ['Poland', 'Germany', 'United Kingdom', 'Japan', 'France'];
const priorities = ['Standard', 'Urgent', 'Critical'];
const reviewTeams = [
  'Payments Operations',
  'Financial Crime',
  'Credit Risk',
  'Relationship Management',
];

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

const tabs = [
  { id: 0, text: 'Overview' },
  { id: 1, text: 'Payment details' },
  { id: 2, text: 'Audit history' },
];

const statusClass: Record<PaymentStatus, string> = {
  Pending: 'app-badge app-badge--info',
  'Under Review': 'app-badge app-badge--warning',
  Approved: 'app-badge app-badge--success',
  Rejected: 'app-badge app-badge--danger',
  Cancelled: 'app-badge',
  Failed: 'app-badge app-badge--danger',
};

const swatches = [
  ['Brand green 900', '--color-brand-green-900'],
  ['Brand green 800', '--color-brand-green-800'],
  ['Brand green 700', '--color-brand-green-700'],
  ['Brand green 600', '--color-brand-green-600'],
  ['Fresh 500', '--color-brand-fresh-500'],
  ['Fresh 300', '--color-brand-fresh-300'],
  ['Fresh 100', '--color-brand-fresh-100'],
  ['Page background', '--color-page-background'],
  ['Default border', '--color-border-default'],
  ['Control border', '--color-border-control'],
  ['Primary text', '--color-text-primary'],
  ['Secondary text', '--color-text-secondary'],
] as const;

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="ds-section" id={id}>
      <div className="ds-section__header">
        <div>
          <h2>{title}</h2>
          {description && <p className="app-muted">{description}</p>}
        </div>
        <a className="ds-anchor" href={`#${id}`} aria-label={`Link to ${title}`}>
          #
        </a>
      </div>
      <div className="ds-section__content">{children}</div>
    </section>
  );
}

function StatusCell({ value }: { value: PaymentStatus }) {
  return <span className={statusClass[value]}>{value}</span>;
}

export default function DesignSystemPage() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const loadingTimeout = useRef<number | undefined>(undefined);

  const navigation = useMemo(
    () => [
      ['foundations', 'Foundations'],
      ['typography', 'Typography'],
      ['buttons', 'Buttons'],
      ['forms', 'Forms'],
      ['components', 'More components'],
      ['status', 'Status'],
      ['cards', 'Cards'],
      ['filters', 'Filters'],
      ['grid', 'DataGrid'],
      ['dialogs', 'Dialogs & feedback'],
      ['states', 'States'],
      ['charts', 'Charts'],
      ['accessibility', 'Accessibility'],
    ],
    [],
  );

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
    <div className="ds-page">
      <aside className="ds-nav" aria-label="Design system sections">
        <div className="ds-nav__brand">
          <strong>Design system</strong>
          <span>Application UI reference</span>
        </div>

        <nav>
          {navigation.map(([href, label]) => (
            <a key={href} href={`#${href}`}>
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="ds-main">
        <header className="ds-hero">
          <div>
            <div className="ds-eyebrow">Design system reference</div>
            <h1 className="app-display-title">SMBC Application UI</h1>
            <p>
              Visual regression surface for shared application tokens, patterns,
              accessibility states, and DevExtreme components.
            </p>
          </div>
          <span className="app-badge app-badge--brand">v1.2</span>
        </header>

        <Section
          id="foundations"
          title="Foundations"
          description="Colour, spacing, shape, and surface rules."
        >
          <div className="ds-swatch-grid">
            {swatches.map(([name, token]) => (
              <div className="ds-swatch" key={name}>
                <div
                  className="ds-swatch__color"
                  style={{ background: `var(${token})` }}
                />
                <div className="ds-swatch__meta">
                  <strong>{name}</strong>
                  <code>{token}</code>
                </div>
              </div>
            ))}
          </div>

          <div className="ds-subsection">
            <h3>Spacing scale</h3>
            <div className="ds-spacing-row">
              {[4, 8, 12, 16, 20, 24, 32, 40, 48].map((value) => (
                <div className="ds-spacing-item" key={value}>
                  <div style={{ width: value, height: value }} />
                  <span>{value}px</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ds-subsection">
            <h3>Shape</h3>
            <div className="ds-control-row">
              <div className="ds-shape ds-shape--control">3px control</div>
              <div className="ds-shape ds-shape--card">6px card</div>
              <span className="app-badge app-badge--brand">Pill status</span>
            </div>
          </div>
        </Section>

        <Section
          id="typography"
          title="Typography"
          description="Application hierarchy is deliberately denser than the public EMEA website."
        >
          <div className="app-card">
            <div className="app-card__body ds-type-stack">
              <div>
                <span className="ds-type-meta">Brand display · Capitolium 30 / 700</span>
                <div className="app-display-title">A trusted partner</div>
              </div>
              <div>
                <span className="ds-type-meta">Application page title · Myriad Pro 24 / 600</span>
                <h1>Payment Review</h1>
              </div>
              <div>
                <span className="ds-type-meta">Application section · Myriad Pro 20 / 600</span>
                <h2>Payment information</h2>
              </div>
              <div>
                <span className="ds-type-meta">Component title · Myriad Pro 16 / 600</span>
                <h3>Approval history</h3>
              </div>
              <div>
                <span className="ds-type-meta">Standard UI · 14 / 400</span>
                <p>Standard application body text for operational information.</p>
              </div>
              <div>
                <span className="ds-type-meta">Secondary</span>
                <p className="app-muted">
                  Secondary information must remain clearly readable.
                </p>
              </div>
              <div>
                <span className="ds-type-meta">Caption · 12 / 400</span>
                <p className="app-caption">Last updated 27 Aug 2026, 14:32 CET</p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="buttons"
          title="Buttons"
          description="Primary, secondary, destructive, disabled, and icon-only actions."
        >
          <div className="ds-control-row">
            <Button text="Approve payment" type="default" stylingMode="contained" />
            <Button text="Export" type="default" stylingMode="outlined" icon="exportxlsx" />
            <Button text="Cancel" stylingMode="text" />
            <Button text="Delete payment" type="danger" stylingMode="contained" icon="trash" />
            <Button
              icon="refresh"
              hint="Refresh"
              elementAttr={{ 'aria-label': 'Refresh' }}
            />
            <Button text="Disabled" disabled />
          </div>
        </Section>

        <Section
          id="forms"
          title="Forms"
          description="Default, validation, read-only, disabled, and selection states."
        >
          <div className="app-card">
            <div className="app-card__body">
              <div className="ds-form-grid">
                <div className="app-field">
                  <label className="app-label" htmlFor="ds-reference">
                    Payment reference
                  </label>
                  <TextBox
                    inputAttr={{ id: 'ds-reference' }}
                    defaultValue="PAY-2026-008421"
                  />
                </div>

                <div className="app-field">
                  <label className="app-label" htmlFor="ds-country">
                    Country
                  </label>
                  <SelectBox
                    inputAttr={{ id: 'ds-country' }}
                    items={countries}
                    defaultValue="Poland"
                    searchEnabled
                  />
                </div>

                <div className="app-field">
                  <label className="app-label" htmlFor="ds-settlement-date">
                    Settlement date
                  </label>
                  <DateBox
                    inputAttr={{ id: 'ds-settlement-date' }}
                    type="date"
                    defaultValue={new Date(2026, 7, 27)}
                    displayFormat="dd MMM yyyy"
                  />
                </div>

                <div className="app-field">
                  <div className="app-label" id="ds-priority-label">
                    Priority
                  </div>
                  <RadioGroup
                    elementAttr={{ 'aria-labelledby': 'ds-priority-label' }}
                    items={priorities}
                    defaultValue="Standard"
                    layout="horizontal"
                  />
                </div>

                <div className="app-field app-field--wide">
                  <label className="app-label" htmlFor="ds-payment-note">
                    Payment note *
                  </label>
                  <TextArea
                    inputAttr={{ id: 'ds-payment-note' }}
                    height={88}
                    placeholder="Enter a short operational note"
                  >
                    <Validator>
                      <RequiredRule message="Enter a payment note." />
                    </Validator>
                  </TextArea>
                </div>

                <div className="app-field">
                  <label className="app-label" htmlFor="ds-read-only-value">
                    Read-only value
                  </label>
                  <TextBox
                    inputAttr={{ id: 'ds-read-only-value' }}
                    value="SMBC Bank International"
                    readOnly
                  />
                </div>

                <div className="app-field">
                  <label className="app-label" htmlFor="ds-disabled-value">
                    Disabled value
                  </label>
                  <TextBox
                    inputAttr={{ id: 'ds-disabled-value' }}
                    value="Unavailable"
                    disabled
                  />
                </div>

                <div className="app-field ds-checkbox-field">
                  <CheckBox text="Require additional approval" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="components"
          title="More DevExtreme components"
          description="A small set of common application patterns beyond the basic form controls."
        >
          <div className="ds-component-grid">
            <div className="app-card">
              <div className="app-card__header">
                <div>
                  <div className="app-card__title">NumberBox</div>
                  <div className="app-caption">Formatted numeric input</div>
                </div>
              </div>
              <div className="app-card__body">
                <div className="app-field">
                  <label className="app-label" htmlFor="ds-payment-amount">
                    Payment amount
                  </label>
                  <NumberBox
                    inputAttr={{ id: 'ds-payment-amount' }}
                    defaultValue={184250.45}
                    format="#,##0.00"
                    min={0}
                    showSpinButtons
                  />
                  <span className="app-caption">EUR · minimum 0.00</span>
                </div>
              </div>
            </div>

            <div className="app-card">
              <div className="app-card__header">
                <div>
                  <div className="app-card__title">TagBox</div>
                  <div className="app-caption">Searchable multiple selection</div>
                </div>
              </div>
              <div className="app-card__body">
                <div className="app-field">
                  <label className="app-label" htmlFor="ds-review-teams">
                    Review teams
                  </label>
                  <TagBox
                    inputAttr={{ id: 'ds-review-teams' }}
                    items={reviewTeams}
                    defaultValue={['Payments Operations', 'Financial Crime']}
                    placeholder="Select teams"
                    searchEnabled
                    showSelectionControls
                    applyValueMode="useButtons"
                  />
                  <span className="app-caption">
                    Search, select several values, then apply.
                  </span>
                </div>
              </div>
            </div>

            <div className="app-card ds-component-grid__wide">
              <div className="app-card__header">
                <div>
                  <div className="app-card__title">Accordion</div>
                  <div className="app-caption">Progressive disclosure for related content</div>
                </div>
              </div>
              <div className="app-card__body">
                <Accordion
                  items={accordionItems}
                  defaultSelectedIndex={0}
                  collapsible
                  multiple={false}
                />
              </div>
            </div>

            <div className="app-card ds-component-grid__wide">
              <div className="app-card__header">
                <div>
                  <div className="app-card__title">Validation</div>
                  <div className="app-caption">
                    Field-level rules with a form-level summary
                  </div>
                </div>
              </div>
              <div className="app-card__body">
                <form
                  className="ds-validation-form"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <ValidationGroup>
                    <div className="ds-validation-fields">
                      <div className="app-field">
                        <label className="app-label" htmlFor="ds-approver-email">
                          Approver email *
                        </label>
                        <TextBox
                          inputAttr={{ id: 'ds-approver-email' }}
                          placeholder="name@smbcgroup.com"
                        >
                          <Validator>
                            <RequiredRule message="Enter the approver email." />
                            <EmailRule message="Enter a valid email address." />
                          </Validator>
                        </TextBox>
                      </div>

                      <div className="app-field">
                        <label className="app-label" htmlFor="ds-approval-limit">
                          Approval limit *
                        </label>
                        <NumberBox
                          inputAttr={{ id: 'ds-approval-limit' }}
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
                        </NumberBox>
                      </div>
                    </div>

                    <div className="ds-validation-actions">
                      <ValidationSummary />
                      <Button
                        text="Validate fields"
                        type="default"
                        useSubmitBehavior
                      />
                    </div>
                  </ValidationGroup>
                </form>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="status"
          title="Status system"
          description="Business state uses text plus semantic styling; colour is never the only cue."
        >
          <div className="ds-control-row">
            <span className="app-badge">Cancelled</span>
            <span className="app-badge app-badge--info">Pending</span>
            <span className="app-badge app-badge--warning">Under Review</span>
            <span className="app-badge app-badge--success">Approved</span>
            <span className="app-badge app-badge--danger">Rejected</span>
            <span className="app-badge app-badge--danger">Failed</span>
            <span className="app-badge app-badge--brand">Selected</span>
          </div>

          <div className="ds-message-grid">
            <div className="app-callout">
              <strong>Information</strong>
              <span>The payment has supporting documents.</span>
            </div>
            <div className="app-callout app-callout--fresh">
              <strong>Brand highlight</strong>
              <span>Fresh Green is emphasis, not a universal success colour.</span>
            </div>
            <div className="app-callout app-callout--warning">
              <strong>Attention required</strong>
              <span>Beneficiary details changed since the previous payment.</span>
            </div>
            <div className="app-callout app-callout--danger">
              <strong>Processing failed</strong>
              <span>The payment could not be submitted.</span>
            </div>
          </div>
        </Section>

        <Section id="cards" title="Cards & page patterns">
          <div className="app-grid app-grid--3">
            <article className="app-kpi">
              <div className="app-kpi__label">Payments today</div>
              <div className="app-kpi__value">184</div>
              <div className="app-kpi__meta">12 awaiting review</div>
            </article>
            <article className="app-kpi">
              <div className="app-kpi__label">Total value</div>
              <div className="app-kpi__value">€8.4m</div>
              <div className="app-kpi__meta">Across 7 currencies</div>
            </article>
            <article className="app-kpi">
              <div className="app-kpi__label">Exceptions</div>
              <div className="app-kpi__value">6</div>
              <div className="app-kpi__meta">2 require immediate attention</div>
            </article>
          </div>

          <div className="app-card">
            <div className="app-card__header">
              <div>
                <div className="app-card__title">Payment summary</div>
                <div className="app-caption">PAY-2026-008421</div>
              </div>
              <span className="app-badge app-badge--warning">Under Review</span>
            </div>
            <div className="app-card__body">
              <dl className="app-details">
                <dt>Beneficiary</dt>
                <dd>Aster Components GmbH</dd>
                <dt>Amount</dt>
                <dd>184,250.45 EUR</dd>
                <dt>Value date</dt>
                <dd>27 Aug 2026</dd>
                <dt>Created by</dt>
                <dd>Operations Team</dd>
              </dl>
            </div>
            <div className="app-card__footer">
              <Button text="Back" stylingMode="text" />
              <Button text="Approve" type="default" />
            </div>
          </div>
        </Section>

        <Section id="filters" title="Filters">
          <div className="app-filter-panel">
            <div className="app-field">
              <label className="app-label" htmlFor="ds-filter-reference">
                Reference
              </label>
              <TextBox
                inputAttr={{ id: 'ds-filter-reference' }}
                placeholder="Payment reference"
              />
            </div>
            <div className="app-field">
              <label className="app-label" htmlFor="ds-filter-status">
                Status
              </label>
              <SelectBox
                inputAttr={{ id: 'ds-filter-status' }}
                items={['Pending', 'Under Review', 'Approved', 'Rejected', 'Failed']}
                placeholder="All statuses"
                showClearButton
              />
            </div>
            <div className="app-field">
              <label className="app-label" htmlFor="ds-filter-from">
                From
              </label>
              <DateBox inputAttr={{ id: 'ds-filter-from' }} type="date" />
            </div>
            <div className="app-field">
              <label className="app-label" htmlFor="ds-filter-to">
                To
              </label>
              <DateBox inputAttr={{ id: 'ds-filter-to' }} type="date" />
            </div>
            <div className="ds-filter-actions">
              <Button text="Reset" stylingMode="text" />
              <Button text="Apply filters" type="default" />
            </div>
          </div>
        </Section>

        <Section
          id="grid"
          title="DataGrid"
          description="Compact density, subtle selection, filtering, paging, and semantic statuses."
        >
          <div className="app-table-shell">
            <DataGrid
              dataSource={payments}
              keyExpr="id"
              showBorders={false}
              rowAlternationEnabled
              hoverStateEnabled
              columnAutoWidth
            >
              <Selection mode="multiple" showCheckBoxesMode="always" />
              <FilterRow visible />
              <HeaderFilter visible />
              <Paging defaultPageSize={5} />
              <Pager
                visible
                showInfo
                showPageSizeSelector
                allowedPageSizes={[5, 10, 20]}
              />

              <Column dataField="reference" caption="Reference" />
              <Column dataField="beneficiary" caption="Beneficiary" minWidth={210} />
              <Column
                dataField="amount"
                caption="Amount"
                dataType="number"
                alignment="right"
                format={{ type: 'fixedPoint', precision: 2 }}
              />
              <Column dataField="currency" caption="CCY" width={80} />
              <Column
                dataField="valueDate"
                caption="Value date"
                dataType="date"
                format="dd MMM yyyy"
              />
              <Column
                dataField="status"
                caption="Status"
                cellRender={({ value }) => (
                  <StatusCell value={value as PaymentStatus} />
                )}
                allowFiltering={false}
              />
              <Column
                caption=""
                width={54}
                allowSorting={false}
                allowFiltering={false}
                cellRender={() => (
                  <Button
                    icon="more"
                    stylingMode="text"
                    hint="Payment actions"
                    elementAttr={{ 'aria-label': 'Payment actions' }}
                  />
                )}
              />
            </DataGrid>
          </div>
        </Section>

        <Section id="dialogs" title="Dialogs & feedback">
          <div className="ds-control-row">
            <Button
              text="Open dialog"
              type="default"
              onClick={() => setPopupVisible(true)}
            />
            <Button
              text="Show success toast"
              stylingMode="outlined"
              onClick={() => setToastVisible(true)}
            />
          </div>

          <Popup
            visible={popupVisible}
            width={600}
            height="auto"
            maxWidth="calc(100vw - 32px)"
            title="Approve payment?"
            showCloseButton
            dragEnabled={false}
            hideOnOutsideClick={false}
            onHiding={() => setPopupVisible(false)}
          >
            <div className="ds-dialog-body">
              <p>
                You are approving <strong>PAY-2026-008421</strong> for
                184,250.45 EUR.
              </p>
              <p className="app-muted">
                The payment will proceed to the next workflow stage.
              </p>
              <div className="ds-dialog-actions">
                <Button
                  text="Cancel"
                  stylingMode="text"
                  onClick={() => setPopupVisible(false)}
                />
                <Button
                  text="Approve payment"
                  type="default"
                  onClick={() => {
                    setPopupVisible(false);
                    setToastVisible(true);
                  }}
                />
              </div>
            </div>
          </Popup>

          <Toast
            visible={toastVisible}
            message="Payment approved."
            type="success"
            displayTime={2500}
            onHiding={() => setToastVisible(false)}
          />
        </Section>

        <Section id="states" title="Loading, empty & error states">
          <div className="ds-state-grid">
            <div className="app-card">
              <div className="app-card__header">
                <div className="app-card__title">Loading</div>
              </div>
              <div
                className="app-card__body ds-loading-demo"
                aria-busy={loadingDemo}
              >
                {loadingDemo ? (
                  <div
                    className="ds-loading-status"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <LoadIndicator elementAttr={{ 'aria-hidden': 'true' }} />
                    <span>Refreshing payments…</span>
                  </div>
                ) : (
                  <Button text="Run loading state" onClick={runLoadingDemo} />
                )}
              </div>
            </div>

            <div className="app-empty-state">
              <div className="ds-empty-icon" aria-hidden="true">
                <i className="dx-icon dx-icon-search" />
              </div>
              <h3>No payments match these filters</h3>
              <p>Try changing the date range or clearing one or more filters.</p>
              <Button text="Clear filters" stylingMode="outlined" type="default" />
            </div>

            <div className="app-card">
              <div className="app-card__header">
                <div className="app-card__title">Error</div>
              </div>
              <div className="app-card__body">
                <div className="app-callout app-callout--danger">
                  <strong>Unable to load payment history</strong>
                  <span>Try again. If the problem continues, contact support.</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="charts"
          title="Charts"
          description="SVG-based components use the separately registered SMBC palette."
        >
          <div className="app-card">
            <div className="app-card__header">
              <div className="app-card__title">Daily payment volume</div>
            </div>
            <div className="app-card__body">
              <Chart dataSource={chartData} palette={smbcVizPalette.simpleSet} height={320}>
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
                  type="bar"
                />
                <Legend verticalAlignment="top" horizontalAlignment="right" />
              </Chart>
            </div>
          </div>
        </Section>

        <Section
          id="accessibility"
          title="Accessibility reference"
          description="Focus, target size, keyboard navigation, and contrast must be visible here."
        >
          <div className="ds-accessibility-grid">
            <div className="app-card">
              <div className="app-card__body">
                <h3>Keyboard focus</h3>
                <p className="app-muted">
                  Tab through these controls. Focus must remain obvious on both
                  light and dark surfaces.
                </p>

                <div className="ds-focus-surface ds-focus-surface--light">
                  <Button text="Light surface" />
                  <a href="#accessibility">Text link</a>
                </div>

                <div className="ds-focus-surface ds-focus-surface--dark">
                  <Button text="Dark surface" stylingMode="outlined" />
                  <a href="#accessibility">Text link</a>
                </div>
              </div>
            </div>

            <div className="app-card">
              <div className="app-card__body">
                <h3>Tabs</h3>
                <Tabs
                  items={tabs}
                  selectedIndex={selectedTab}
                  onSelectionChanged={(event) => {
                    const item = event.addedItems[0] as { id?: number } | undefined;
                    if (typeof item?.id === 'number') {
                      setSelectedTab(item.id);
                    }
                  }}
                />
                <div className="ds-tab-content">
                  Selected: <strong>{tabs[selectedTab].text}</strong>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <footer className="ds-footer">
          <span>SMBC Application Design System</span>
          <span>Reference surface · DevExtreme 25.1</span>
        </footer>
      </main>
    </div>
  );
}
