import { type FC, useCallback, useEffect, useState } from "react";
import TableReuse from "../../common/Table/TableReuse";
import {
  promotionStatusOptions,
  promotionTypeOptions,
  type PromotionListDataType,
} from "../../../type/promotion/promotion";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import FilterReuse from "../../common/Filter/FilterReuse";
import type { ListPageParams, SelectConfig } from "../../../type/common/common";
import { createOnTableChangeHandler } from "../../common/Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { columnsPromotionList } from "../../common/Columns/Colums";
import { Modal, type ModalProps } from "antd";
import { fetchPromotionsStart } from "../../../store/slices/promotion/promotionListSlice";
interface ModalPromotionListProps extends ModalProps {
  handleSubmitModal: (data: PromotionListDataType[], key: React.Key[]) => void;
  selectedData: PromotionListDataType[];
  selectedDataKey: React.Key[];
  singleSelectMode?: boolean;
}

const selectConfigs: SelectConfig[] = [
  {
    name: "promotion_type",
    type: "select",
    label: "Promotion Type",
    placeholder: "Select Promotion Type",
    options: promotionTypeOptions,
  },
  {
    name: "status",
    type: "select",
    label: "Promotion Status",
    placeholder: "Select Promotion Status",
    options: promotionStatusOptions,
  },
  {
    name: "date",
    type: "rangePicker",
    label: "Promotion Date",
    placeholder: "Select Promotion Date",
  },
];

const ModalPromotionList: FC<ModalPromotionListProps> = ({
  handleSubmitModal,
  selectedData,
  selectedDataKey,
  singleSelectMode,
  ...modalProps
}) => {
  const { loading, promotions, total } = useAppSelector(
    (state) => state.promotion
  );
  const dispatch = useAppDispatch();
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionListDataType[]>(selectedData);
  const [selectedPromotionKeys, setSelectedPromotionKeys] =
    useState<React.Key[]>(selectedDataKey);

  const [params, setParams] = useState<ListPageParams>({
    page: 1,
    page_size: 5,
    search_by: "",
    search_value: "",
    sort_by: "",
    sort_order: "",
    filters: {},
  });

  const onRowSelectionChange = useCallback(
    (selectedRowKeys: React.Key[], selectedRows: PromotionListDataType[]) => {
      setSelectedPromotion(selectedRows);
      setSelectedPromotionKeys(selectedRowKeys);
    },
    []
  );

  const rowSelection = {
    selectedRowKeys: selectedPromotionKeys,
    onChange: onRowSelectionChange,
    getCheckboxProps: (record: PromotionListDataType) => ({
      disabled:
        singleSelectMode &&
        selectedPromotionKeys.length > 0 &&
        !selectedPromotionKeys.includes(record.promotionId),
    }),
  };

  const onFilter = createOnFilterHandler({
    setParams,
  });

  const onSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search_by: "title",
      search_value: value,
    }));
  };

  const handleOnChangeTable = createOnTableChangeHandler<PromotionListDataType>(
    {
      currentParams: params,
      setParams,
    }
  );

  useEffect(() => {
    dispatch(fetchPromotionsStart(params));
  }, [dispatch, params]);

  return (
    <Modal
      {...modalProps}
      onOk={() => handleSubmitModal(selectedPromotion, selectedPromotionKeys)}
      centered
    >
      <FilterReuse
        onFilter={onFilter}
        selectConfigs={selectConfigs}
        onSearch={onSearch}
        isShowFilter={true}
      />
      <TableReuse<PromotionListDataType>
        columns={columnsPromotionList}
        dataSource={promotions}
        loading={loading}
        onChange={handleOnChangeTable}
        pagination={{
          current: params.page,
          pageSize: params.page_size,
          total,
          showTotal: (total) => `Total ${total} items`,
        }}
        rowKey="promotionId"
        rowSelection={rowSelection}
      />
    </Modal>
  );
};

export default ModalPromotionList;
