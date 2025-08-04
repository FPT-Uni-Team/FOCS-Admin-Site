import { type FC, useEffect, useState } from "react";
import { Typography, Switch, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import TableReuse from "../../common/Table/TableReuse";
import FilterReuse from "../../common/Filter/FilterReuse";
import { useAppSelector } from "../../../hooks/redux";
import type { VariantGroup } from "../../../type/variant/variant";
import type { ListPageParams } from "../../../type/common/common";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import styles from "./VariantGroupList.module.scss";

const { Text } = Typography;

interface VariantGroupListProps {
  fetchData: (params: ListPageParams) => void;
}

const VariantGroupList: FC<VariantGroupListProps> = ({ fetchData }) => {
  const { variantGroupsList, loading, total } = useAppSelector(
    (state) => state.variantGroup
  );

  const [params, setParams] = useState<ListPageParams>({
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  });

  const onFilter = createOnFilterHandler({
    setParams,
  });

  const onSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search_by: "group_name",
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<VariantGroup>({
    currentParams: params,
    setParams,
  });

  useEffect(() => {
    fetchData(params);
  }, [fetchData, params]);

  const columns: ColumnsType<VariantGroup> = [
    {
      title: "Variant Group Name",
      dataIndex: "group_name",
      key: "group_name",
      sorter: true,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Variants Count",
      dataIndex: "variants",
      key: "variants_count",
      width: 150,
      align: "center",
      render: (variants: VariantGroup["variants"]) => (
        <Tag color="blue">{variants?.length || 0} variants</Tag>
      ),
    },
    {
      title: "Min Select",
      dataIndex: "min_select",
      key: "min_select",
      width: 120,
      align: "center",
      sorter: true,
      render: (text: number) => text || "-",
    },
    {
      title: "Max Select",
      dataIndex: "max_select",
      key: "max_select",
      width: 120,
      align: "center",
      sorter: true,
      render: (text: number) => text || "-",
    },
    {
      title: "Required",
      dataIndex: "is_required",
      key: "is_required",
      width: 100,
      align: "center",
      render: (checked: boolean) => (
        <Switch checked={checked} disabled size="small" />
      ),
    },
    {
      title: "Available Variants",
      dataIndex: "variants",
      key: "available_variants",
      width: 150,
      align: "center",
      render: (variants: VariantGroup["variants"]) => {
        const availableCount = variants?.filter(v => v.is_available)?.length || 0;
        const totalCount = variants?.length || 0;
        return (
          <Text type={availableCount === totalCount ? "success" : "warning"}>
            {availableCount}/{totalCount}
          </Text>
        );
      },
    },

  ];

  const expandedRowRender = (group: VariantGroup) => {
    const variantColumns: ColumnsType<VariantGroup["variants"][0]> = [
      {
        title: "Variant Name",
        dataIndex: "name",
        key: "name",
              render: (text: string, record: VariantGroup["variants"][0]) => (
        <div className={styles.variantInfo}>
          <Text>{text}</Text>
          {!record.is_available && (
            <Tag color="red" className={styles.unavailableTag}>Unavailable</Tag>
          )}
        </div>
      ),
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        width: 100,
        align: "right",
        render: (price: number) => (
          <Text type={price > 0 ? "success" : undefined}>
            {price > 0 ? `+${price.toLocaleString()}đ` : "Free"}
          </Text>
        ),
      },
      {
        title: "Prep Time",
        dataIndex: "prep_per_time",
        key: "prep_per_time",
        width: 100,
        align: "center",
        render: (prep: number) => (prep ? `${prep} min` : "-"),
      },
      {
        title: "Quantity/Time",
        dataIndex: "quantity_per_time",
        key: "quantity_per_time",
        width: 120,
        align: "center",
        render: (qty: number) => qty || "-",
      },
      {
        title: "Available",
        dataIndex: "is_available",
        key: "is_available",
        width: 100,
        align: "center",
        render: (available: boolean) => (
          <Switch checked={available} disabled size="small" />
        ),
      },
    ];

    return (
      <div className={styles.expandedTable}>
        <TableReuse
          columns={variantColumns}
          dataSource={group.variants}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </div>
    );
  };



  const selectConfigs = [
    {
      name: "is_required",
      label: "Required",
      type: "select" as const,
      placeholder: "Filter by required status",
      options: [
        { label: "All", value: "" },
        { label: "Required", value: "true" },
        { label: "Optional", value: "false" },
      ],
    },
  ];

 
  return (
    <div>
      <FilterReuse
        onFilter={onFilter}
        selectConfigs={selectConfigs}
        onSearch={onSearch}

      />
      
      <ContentInner>
        <TableReuse<VariantGroup>
          columns={columns}
          dataSource={variantGroupsList}
          loading={loading}
          onChange={handleOnChangeTable}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
          }}
          rowKey="id"
          expandable={{
            expandedRowRender,
            rowExpandable: (record) =>
              record.variants && record.variants.length > 0,
          }}
        />
      </ContentInner>
    </div>
  );
};

export default VariantGroupList;