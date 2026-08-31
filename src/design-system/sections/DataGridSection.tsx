import Button from 'devextreme-react/button';
import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  Pager,
  Paging,
  Selection,
} from 'devextreme-react/data-grid';

import Section from '../components/Section';
import paymentsData from '../data/payments.json';

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

const statusClass: Record<PaymentStatus, string> = {
  Pending: 'app-badge app-badge--info',
  'Under Review': 'app-badge app-badge--warning',
  Approved: 'app-badge app-badge--success',
  Rejected: 'app-badge app-badge--danger',
  Cancelled: 'app-badge',
  Failed: 'app-badge app-badge--danger',
};

const payments = paymentsData as PaymentRow[];

function StatusCell({ value }: { value: PaymentStatus }) {
  return <span className={statusClass[value]}>{value}</span>;
}

export default function DataGridSection() {
  return (
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
            cellRender={({ value }) => <StatusCell value={value as PaymentStatus} />}
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
  );
}
