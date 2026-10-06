import type { ReactNode } from 'react';

import styles from './Table.module.css';

export type TableColumn<Row> = {
  key: string;
  header: ReactNode;
  render: (row: Row) => ReactNode;
};

type Props<Row> = {
  columns: readonly TableColumn<Row>[];
  data: readonly Row[];
  getRowKey: (row: Row) => string;
};

export const Table = <Row,>({ columns, data, getRowKey }: Props<Row>) => (
  <div className={styles.scrollArea}>
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={getRowKey(row)}>
            {columns.map((column) => (
              <td key={column.key}>{column.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
