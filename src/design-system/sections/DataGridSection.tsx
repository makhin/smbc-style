import {
  Button,
  DataGrid,
  StatusBadge,
  TableShell,
  type StatusBadgeTone,
} from '@smbc/ui';
import {
  DataGridColumn as Column,
  DataGridFilterRow as FilterRow,
  DataGridHeaderFilter as HeaderFilter,
  DataGridPager as Pager,
  DataGridPaging as Paging,
  DataGridSelection as Selection,
} from '@smbc/ui/data-grid';

import Section from '../components/Section';
import paymentsData from '../data/payments.json';

type PaymentStatus =
  | 'Pending'
  | 'Under review'
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

const statusTone: Record<PaymentStatus, StatusBadgeTone> = {
  Pending: 'info',
  'Under review': 'warning',
  Approved: 'success',
  Rejected: 'danger',
  Cancelled: 'neutral',
  Failed: 'danger',
};

const payments = paymentsData as PaymentRow[];

function StatusCell({ value }: { value: PaymentStatus }) {
  return <StatusBadge tone={statusTone[value]}>{value}</StatusBadge>;
}

export default function DataGridSection() {
  return (
    <Section
      id="grid"
      title="DataGrid"
      description="Horizontal hierarchy, tabular lining figures, right-aligned numbers, and restrained row fills."
    >
      <TableShell>
        <DataGrid dataSource={payments} keyExpr="id">
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

          <Column dataField="reference" caption="Reference" minWidth={130} />
          <Column
            dataField="beneficiary"
            caption="Beneficiary"
            minWidth={210}
          />
          <Column
            dataField="amount"
            caption="Amount"
            dataType="number"
            minWidth={120}
            alignment="right"
            format={{ type: 'fixedPoint', precision: 2 }}
          />
          <Column dataField="currency" caption="CCY" width={80} />
          <Column
            dataField="valueDate"
            caption="Value date"
            dataType="date"
            minWidth={120}
            format="dd MMM yyyy"
          />
          <Column
            dataField="status"
            caption="Status"
            minWidth={110}
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
                ariaLabel="Payment actions"
                variant="tertiary"
              />
            )}
          />
        </DataGrid>
      </TableShell>

      <TableShell>
        <div
          className="app-table-scroll"
          role="region"
          aria-label="Payment summary: scroll horizontally on narrow screens"
          tabIndex={0}
        >
          <table>
            <caption>Payment summary — native table</caption>
            <thead>
              <tr>
                <th scope="col">Reference</th>
                <th scope="col">Beneficiary</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 3).map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.reference}</td>
                  <td>{payment.beneficiary}</td>
                  <td>
                    <StatusCell value={payment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableShell>
    </Section>
  );
}
