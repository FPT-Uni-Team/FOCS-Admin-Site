import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "antd";
import type { ModalProps } from "antd";
import TableReuse from "../Table/TableReuse";
import FilterReuse from "../Filter/FilterReuse";
import type { ListPageParams } from "../../../type/common/common";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { columnsCouponList } from "../Columns/Colums";
import { type CouponAdminDTO } from "../../../type/coupon/coupon";
import { createOnTableChangeHandler } from "../Table/HandleTableChange/HandleTableChange";
import { createOnFilterHandler } from "../../../helper/formatFilters";
import { fetchCouponsValidStart } from "../../../store/slices/coupon/couponListValidSlice";

interface MenuItemSelectionModalProps extends ModalProps {
  handleSubmitModal: (data: CouponAdminDTO[], key: React.Key[]) => void;
  selectedData: CouponAdminDTO[];
  selectedDataKey: React.Key[];
  singleSelectMode?: boolean;
}

const ModalCouponList: React.FC<MenuItemSelectionModalProps> = ({
  handleSubmitModal,
  selectedData,
  selectedDataKey,
  singleSelectMode = false,
  ...modalProps
}) => {
  const dispatch = useAppDispatch();
  const { loading, coupons, total } = useAppSelector(
    (state) => state.couponValid
  );
  const [selectedCoupon, setSelectedCoupon] =
    useState<CouponAdminDTO[]>(selectedData);
  const [selectedCouponKeys, setSelectedCouponKeys] =
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
    (selectedRowKeys: React.Key[], selectedRows: CouponAdminDTO[]) => {
      setSelectedCoupon(selectedRows);
      setSelectedCouponKeys(selectedRowKeys);
    },
    []
  );

  const rowSelection = {
    selectedRowKeys: selectedCouponKeys,
    onChange: onRowSelectionChange,
    getCheckboxProps: (record: CouponAdminDTO) => ({
      disabled:
        singleSelectMode &&
        selectedCouponKeys.length > 0 &&
        !selectedCouponKeys.includes(record.id),
    }),
  };

  const handleOnChangeTable = createOnTableChangeHandler<CouponAdminDTO>({
    currentParams: params,
    setParams,
  });

  const onFilter = createOnFilterHandler({
    setParams,
  });
  const onSearch = useCallback((value: string) => {
    const trimmedValue = value.trim();
    setParams((prev) => ({
      ...prev,
      page: 1,
      search_by: trimmedValue ? "code" : "",
      search_value: trimmedValue,
    }));
  }, []);

  useEffect(() => {
    dispatch(fetchCouponsValidStart(params));
  }, [dispatch, params]);

  return (
    <Modal
      {...modalProps}
      onOk={() => handleSubmitModal(selectedCoupon, selectedCouponKeys)}
      centered
    >
      <FilterReuse
        onFilter={onFilter}
        onSearch={onSearch}
        isShowFilter={true}
      />
      <TableReuse<CouponAdminDTO>
        columns={columnsCouponList}
        dataSource={coupons}
        loading={loading}
        onChange={handleOnChangeTable}
        pagination={{
          current: params.page,
          pageSize: params.page_size,
          total: total,
          showTotal: (total) => `Total ${total} items`,
        }}
        rowSelection={rowSelection}
        rowKey="id"
      />
    </Modal>
  );
};

export default ModalCouponList;
