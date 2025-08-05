import React, { useEffect, useState } from "react";
import { Space, Typography, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import TableReuse from "../Table/TableReuse";
import type { Variant, VariantGroup } from "../../../type/variant/variant";

const { Text } = Typography;

interface VariantDisplayDetailProps {
  displayVariantGroups: VariantGroup[];
}

const VariantDisplayDetail: React.FC<VariantDisplayDetailProps> = ({
  displayVariantGroups,
}) => {
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);

  useEffect(() => {
    if (displayVariantGroups && displayVariantGroups.length > 0) {
      setVariantGroups(displayVariantGroups);
    } else {
      setVariantGroups([]);
    }
  }, [displayVariantGroups]);

  const columns: ColumnsType<VariantGroup> = [
    {
      title: "Variant Group Name",
      dataIndex: "group_name",
      key: "group_name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
  ];

  const expandedRowRender = (group: VariantGroup) => {
    const variantColumns: ColumnsType<Variant> = [
      {
        title: "Variant Name",
        dataIndex: "name",
        key: "name",
        render: (text: string, record: Variant) => (
          <Space>
            <Text>{text}</Text>
            {!record.is_available && (
              <Text type="secondary">(Unavailable)</Text>
            )}
          </Space>
        ),
      },
      {
        title: "Prep Time (min)",
        dataIndex: "prep_per_time",
        key: "prep_per_time",
        align: "center",
        width: 100,
        render: (prep: number) => (prep !== undefined ? `${prep}′` : "-"),
      },
      {
        title: "Qty / Time",
        dataIndex: "quantity_per_time",
        key: "quantity_per_time",
        width: 100,
        align: "center",
        render: (qty: number) => (qty !== undefined ? qty : "-"),
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        width: 100,
        render: (price: number) => (
          <Text type="success">
            {price > 0 ? `+${price.toLocaleString()}đ` : "-"}
          </Text>
        ),
      },
      {
        title: "Available",
        dataIndex: "is_available",
        key: "is_available",
        width: 100,
        align: "center",
        render: (available: boolean) => <Switch checked={available} disabled />,
      },
    ];

    return (
      <TableReuse
        columns={variantColumns}
        dataSource={group.variants}
        rowKey="id"
        pagination={false}
      />
    );
  };

  return (
    <div>
      <Typography.Title level={5}>Variant Details</Typography.Title>
      <TableReuse
        loading={false}
        columns={columns}
        dataSource={variantGroups}
        rowKey="id"
        expandable={{
          expandedRowRender,
          rowExpandable: (record) =>
            record.variants && record.variants.length > 0,
        }}
        pagination={false}
      />
    </div>
  );
};

export default VariantDisplayDetail;
