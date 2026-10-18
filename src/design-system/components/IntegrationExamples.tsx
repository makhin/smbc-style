import { useMemo, useRef, useState } from 'react';
import { Button, Drawer, Stepper, DataGrid, type ButtonRef } from '@smbc/ui';
import { CustomStore, type DataGridRef, DataGridColumn, DataGridPaging, DataGridPager } from '@smbc/ui/data-grid';
const integrationRows = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }];
export default function IntegrationExamples() {
  const button = useRef<ButtonRef>(null);
  const grid = useRef<DataGridRef<{ id: number; name: string }, number>>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [load, setLoad] = useState('');
  const store = useMemo(() => new CustomStore<{ id: number; name: string }, number>({
    key: 'id', loadMode: 'processed',
    load: async (options) => {
      setLoad(JSON.stringify(options));
      const rows = options.filter ? integrationRows.filter((row) => row.name === 'B') : integrationRows;
      return { data: rows.slice(options.skip ?? 0, (options.skip ?? 0) + (options.take ?? 1)), totalCount: rows.length };
    },
  }), []);
  return <section id="extensions" className="min-w-0 flex flex-col gap-3">
    <Button ref={button} onClick={() => setOpen(true)}>Open panel</Button>
    <Button onClick={() => button.current?.focus()}>Focus trigger</Button>
    <Drawer open={open} onOpenChange={setOpen} panel={() => <Button onClick={() => setOpen(false)}>Close panel</Button>}
      devExtremeProps={{ openedStateMode: 'overlap', shading: true, closeOnOutsideClick: true, maxSize: 200 }}>
      <p>Drawer content</p>
    </Drawer>
    <Stepper items={[{ label: 'First' }, { label: 'Second' }]} selectedIndex={step} readOnly />
    <Button onClick={() => setStep(1)}>Advance progress</Button>
    <DataGrid ref={grid} dataSource={store} devExtremeProps={{ remoteOperations: true, elementAttr: { id: 'remote-grid' } }}>
      <DataGridColumn dataField="name" />
      <DataGridPaging defaultPageSize={1} />
      <DataGridPager visible />
    </DataGrid>
    <Button onClick={() => { grid.current?.instance().pageIndex(0); grid.current?.instance().filter(['name', '=', 'B']); }}>Filter remote</Button>
    <Button onClick={() => void grid.current?.instance().refresh()}>Refresh remote</Button>
    <output id="remote-load" className="block min-w-0 wrap-anywhere text-xs text-fg-muted">{load}</output>
  </section>;
}
