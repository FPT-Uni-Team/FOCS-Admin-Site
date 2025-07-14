import { Table } from "antd";
import type { TableProps } from "antd";

const TableReuse = <RecordType extends object>({
  columns,
  dataSource,
  rowKey = "key",
  ...rest
}: TableProps<RecordType>) => {
  return (
    <Table<RecordType>
      bordered
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      {...rest}
    />
  );
};

export default TableReuse;
