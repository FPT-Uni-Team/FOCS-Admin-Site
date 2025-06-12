import { useEffect, useState } from "react";
import type {
  TablePaginationConfig,
  SorterResult,
  FilterValue,
} from "antd/es/table/interface";
import TableReuse from "../../common/Table/TableReuse";
import type {
  PromotionListDataType,
  PromotionListParams,
} from "../../../type/promotion/promotion";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchPromotionsStart } from "../../../store/slices/promotion/promotionListSlice";

const PromotionList = () => {
  const [data, setData] = useState<PromotionListDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [params, setParams] = useState<PromotionListParams>({
    page: 1,
    page_size: 10,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  });

  const fetchData = async () => {
    setLoading(true);
    dispatch(fetchPromotionsStart(params));
  };

  useEffect(() => {
    fetchData();
  });

  const handleOnChangeTable = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter:
      | SorterResult<PromotionListDataType>
      | SorterResult<PromotionListDataType>[]
  ) => {
    let sortField = "";
    let sortOrder = "";

    if (!Array.isArray(sorter) && sorter.column) {
      sortField = sorter.field as string;
      sortOrder = sorter.order || "";
    }

    const newParams = {
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      sortField,
      sortOrder,
    };

    setParams(newParams);
    fetchData(newParams);
  };

  const columns = [
    {
      title: "Promotion Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Promotion Type",
      dataIndex: "type",
      key: "type",
      sorter: true,
    },
    {
      title: "Promotion Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <TableReuse
      columns={columns}
      dataSource={data}
      loading={loading}
      onChange={handleOnChangeTable}
      pagination={{
        current: params.page,
        pageSize: params.pageSize,
        total: 100,
      }}
      rowKey="key"
    />
  );
};

export default PromotionList;
