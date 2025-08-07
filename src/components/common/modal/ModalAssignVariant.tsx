import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Table,
  Checkbox,
  Button,
  Typography,
  message,
  Input,
  Row,
  Col,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Variant } from "../../../type/variant/variant";
import {
  defaultParams,
  type ListPageParams,
} from "../../../type/common/common";
import { fetchVariantsStart } from "../../../store/slices/variant/variantListSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { assignVariantsStart, resetVariantAssign } from "../../../store/slices/variant/variantAssignSlice";
import { formatPrice } from "../../../helper/formatPrice";

const { Text } = Typography;
const { Search } = Input;

interface ModalAssignVariantProps {
  visible: boolean;
  onCancel: () => void;
  variantGroupId: string;
  variantGroupName: string;
  onSuccess?: () => void;
  excludeVariantIds?: string[];
}

const ModalAssignVariant: React.FC<ModalAssignVariantProps> = ({
  visible,
  onCancel,
  variantGroupId,
  variantGroupName,
  onSuccess,
  excludeVariantIds = [],
}) => {
  const dispatch = useAppDispatch();
  const { variants: variantsList, loading: variantsLoading } = useAppSelector(
    (state) => state.variantList
  );
  const { loading: assignLoading, success, error } = useAppSelector(
    (state) => state.variantAssign
  );

  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [params] = useState<ListPageParams>(defaultParams(100));

  const availableVariants = (variantsList || []).filter(
    (variant) => !excludeVariantIds.includes(variant.id)
  );

  const filteredVariants = availableVariants.filter((variant) =>
    variant.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    if (visible) {
      dispatch(fetchVariantsStart(params));
    }
  }, [visible, dispatch, params]);

  useEffect(() => {
    if (success) {
      message.success("Variants assigned successfully!");
      dispatch(resetVariantAssign());
      setSelectedVariantIds([]);
      onSuccess?.();
      onCancel();
    }
  }, [success, dispatch, onSuccess, onCancel]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(resetVariantAssign());
    }
  }, [error, dispatch]);

  const handleSelectVariant = useCallback((variantId: string, checked: boolean) => {
    setSelectedVariantIds((prev) => {
      if (checked) {
        return [...prev, variantId];
      } else {
        return prev.filter((id) => id !== variantId);
      }
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedVariantIds(filteredVariants.map((variant) => variant.id));
    } else {
      setSelectedVariantIds([]);
    }
  }, [filteredVariants]);

  const handleAssign = useCallback(() => {
    if (selectedVariantIds.length === 0) {
      message.warning("Please select at least one variant to assign.");
      return;
    }

    dispatch(
      assignVariantsStart({
        variantIds: selectedVariantIds,
        variantGroupId,
      })
    );
  }, [selectedVariantIds, variantGroupId, dispatch]);

  const handleCancel = useCallback(() => {
    setSelectedVariantIds([]);
    setSearchText("");
    dispatch(resetVariantAssign());
    onCancel();
  }, [dispatch, onCancel]);

  const columns: ColumnsType<Variant> = [
    {
      title: (
        <Checkbox
          checked={
            filteredVariants.length > 0 &&
            selectedVariantIds.length === filteredVariants.length
          }
          indeterminate={
            selectedVariantIds.length > 0 &&
            selectedVariantIds.length < filteredVariants.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          Select All
        </Checkbox>
      ),
      dataIndex: "select",
      key: "select",
      width: 120,
      render: (_, record) => (
        <Checkbox
          checked={selectedVariantIds.includes(record.id)}
          onChange={(e) => handleSelectVariant(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: "Variant Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "20%",
      render: (price: number) => formatPrice(price),
    },
    {
      title: "Available",
      dataIndex: "is_available",
      key: "is_available",
      width: "15%",
      render: (is_available: boolean) => (
        <Text type={is_available ? "success" : "danger"}>
          {is_available ? "Available" : "Unavailable"}
        </Text>
      ),
    },
    {
      title: "Prep Time (min)",
      dataIndex: "prep_per_time",
      key: "prep_per_time",
      width: "15%",
      render: (prep_per_time: number | undefined) =>
        prep_per_time ? `${prep_per_time} min` : "-",
    },
    {
      title: "Quantity per Time",
      dataIndex: "quantity_per_time",
      key: "quantity_per_time",
      width: "20%",
      render: (quantity_per_time: number | undefined) =>
        quantity_per_time || "-",
    },
  ];

  return (
    <Modal
      title={`Assign Variants to "${variantGroupName}"`}
      open={visible}
      onCancel={handleCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="assign"
          type="primary"
          loading={assignLoading}
          onClick={handleAssign}
          disabled={selectedVariantIds.length === 0}
        >
          Assign Selected ({selectedVariantIds.length})
        </Button>,
      ]}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Search
            placeholder="Search variants..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12}>
          <Text type="secondary">
            {selectedVariantIds.length} of {filteredVariants.length} variants selected
          </Text>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredVariants}
        rowKey="id"
        loading={variantsLoading}
        pagination={{
          total: filteredVariants.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} variants`,
        }}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default ModalAssignVariant;