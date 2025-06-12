import { Table } from "antd";
import type { TableProps } from "antd";
import styles from "./TableReuse.module.scss";

const TableReuse = <RecordType extends object>({
  columns,
  dataSource,
  rowKey = "key",
  ...rest
}: TableProps<RecordType>) => {
  return (
    <Table<RecordType>
      className={styles.customBorderedTable}
      bordered
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      {...rest}
    />
  );
};

export default TableReuse;
