import { useMemo, useRef, useState } from 'react';
import { Button, Card, Drawer, Stepper, ProgressBar, DataGrid, type ButtonRef } from '@smbc/ui';
import { CustomStore, type DataGridRef, DataGridColumn, DataGridPaging, DataGridPager } from '@smbc/ui/data-grid';

const integrationRows = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }];
const steps = [{ label: 'Created' }, { label: 'In review' }, { label: 'Approved' }];

function StepperExample() {
  const [step, setStep] = useState(0);
  return (
    <Card className="min-w-0" id="stepper-example">
      <Card.Header><Card.Title>Stepper</Card.Title></Card.Header>
      <Card.Body>
        <div className="flex min-w-0 max-w-xl flex-col gap-4">
          <p className="text-sm text-fg-muted">Track a payment through its approval stages.</p>
          <Stepper items={steps} selectedIndex={step} readOnly
            devExtremeProps={{ elementAttr: { 'aria-label': 'Payment approval stages' } }} />
          <p role="status" className="text-sm text-fg-muted">Step {step + 1} of {steps.length}: {steps[step].label}</p>
          <div className="flex flex-wrap gap-2">
            <Button disabled={step === 0} onClick={() => setStep(current => Math.max(0, current - 1))}>Previous step</Button>
            <Button variant="primary" disabled={step === steps.length - 1}
              onClick={() => setStep(current => Math.min(steps.length - 1, current + 1))}>Next step</Button>
            <Button variant="tertiary" disabled={step === 0} onClick={() => setStep(0)}>Reset steps</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function ProgressBarExample() {
  const [progress, setProgress] = useState(0);
  return (
    <Card className="min-w-0" id="progressbar-example">
      <Card.Header><Card.Title>ProgressBar</Card.Title></Card.Header>
      <Card.Body>
        <div className="flex min-w-0 max-w-xl flex-col gap-4">
          <p className="text-sm text-fg-muted">Show how much of a batch has been processed.</p>
          <ProgressBar value={progress} ariaLabel="Batch processing progress" />
          <p role="status" className="text-sm text-fg-muted">
            {progress === 0 ? 'Ready to process.' : progress === 100 ? 'Batch complete.' : `Processing: ${progress}% complete.`}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" disabled={progress === 100}
              onClick={() => setProgress(current => Math.min(100, current + 25))}>Advance by 25%</Button>
            <Button variant="tertiary" disabled={progress === 0} onClick={() => setProgress(0)}>Reset progress</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function DrawerExample() {
  const button = useRef<ButtonRef>(null);
  const [open, setOpen] = useState(false);
  return (
    <Card className="min-w-0" id="drawer-example">
      <Card.Header><Card.Title>Drawer</Card.Title></Card.Header>
      <Card.Body>
        <div className="flex min-w-0 flex-col gap-4">
          <p className="text-sm text-fg-muted">Open a contextual panel while keeping the main content visible.</p>
          <div className="flex flex-wrap gap-2">
            <Button ref={button} variant="primary" onClick={() => setOpen(true)}>Open panel</Button>
            <Button onClick={() => button.current?.focus()}>Focus trigger</Button>
          </div>
          <Drawer open={open} onOpenChange={setOpen} panel={() => (
            <div className="flex flex-col gap-3 p-3">
              <p className="font-semibold">Payment details</p>
              <Button onClick={() => setOpen(false)}>Close panel</Button>
            </div>
          )} devExtremeProps={{ openedStateMode: 'overlap', shading: true, closeOnOutsideClick: true, maxSize: 200 }}>
            <div className="min-h-28 rounded-control border border-border bg-surface-subtle p-4 text-sm text-fg-muted">
              Select a payment to inspect its details in the side panel.
            </div>
          </Drawer>
        </div>
      </Card.Body>
    </Card>
  );
}

function RemoteGridExample() {
  const grid = useRef<DataGridRef<{ id: number; name: string }, number>>(null);
  const store = useMemo(() => new CustomStore<{ id: number; name: string }, number>({
    key: 'id', loadMode: 'processed',
    load: async (options) => {
      const rows = options.filter ? integrationRows.filter((row) => row.name === 'B') : integrationRows;
      return { data: rows.slice(options.skip ?? 0, (options.skip ?? 0) + (options.take ?? 1)), totalCount: rows.length };
    },
  }), []);
  return (
    <Card className="min-w-0" id="remote-grid-example">
      <Card.Header><Card.Title>Remote grid integration</Card.Title></Card.Header>
      <Card.Body>
        <div className="flex min-w-0 flex-col gap-4">
          <p className="text-sm text-fg-muted">Paging and filtering through a CustomStore, using local sample data.</p>
          <DataGrid ref={grid} dataSource={store} devExtremeProps={{ remoteOperations: true, elementAttr: { id: 'remote-grid' } }}>
            <DataGridColumn dataField="name" />
            <DataGridPaging defaultPageSize={1} />
            <DataGridPager visible />
          </DataGrid>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { grid.current?.instance().pageIndex(0); grid.current?.instance().filter(['name', '=', 'B']); }}>Filter remote</Button>
            <Button onClick={() => void grid.current?.instance().refresh()}>Refresh remote</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function IntegrationExamples() {
  return <div id="extensions" className="flex min-w-0 flex-col gap-4">
    <StepperExample />
    <ProgressBarExample />
    <DrawerExample />
    <RemoteGridExample />
  </div>;
}
