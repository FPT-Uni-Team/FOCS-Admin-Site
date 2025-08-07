import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  type FormInstance,
  Card,
  Table,
  Tag,
  Button,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { VariantGroup } from "../../../type/variant/variant";
import { formatPrice } from "../../../helper/formatPrice";
import styles from "./VariantGroupDetail.module.scss";
import ModalAssignVariant from "../../common/modal/ModalAssignVariant";
import { fetchVariantGroupDetailStart } from "../../../store/slices/variant/variantGroupDetailSlice";
import { useAppDispatch } from "../../../hooks/redux";

interface Props {
  form: FormInstance;
  variantGroupDetail: VariantGroup;
  mode?: "View" | "Update";
}

const VariantGroupDetail: React.FC<Props> = ({ form, variantGroupDetail, mode = "View" }) => {
  const dispatch = useAppDispatch();
  const isEditMode = mode === "Update";
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  useEffect(() => {
    if (variantGroupDetail?.group_name) {
      form.setFieldsValue({
        group_name: variantGroupDetail.group_name,
      });
    }
  }, [variantGroupDetail, form]);

  if (!variantGroupDetail) {
    return <div>Loading...</div>;
  }

  const variantColumns = [
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
        <Tag color={is_available ? "green" : "red"}>
          {is_available ? "Available" : "Unavailable"}
        </Tag>
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

  const handleAssignSuccess = () => {
    // Refresh variant group detail after successful assignment
    if (variantGroupDetail?.id) {
      dispatch(fetchVariantGroupDetailStart(variantGroupDetail.id));
    }
  };

  const getAssignedVariantIds = () => {
    return variantGroupDetail?.variants?.map(variant => variant.id) || [];
  };

  return (
    <Form form={form} layout="vertical" name="variantGroupDetailForm" colon={true}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="Group Name" name="group_name">
            <Input disabled={!isEditMode} />
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.variantTable}>
        <Col span={24}>
          <Card 
            title="Variants" 
            size="small"
            extra={
              !isEditMode && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowAssignModal(true)}
                >
                  Assign Variants
                </Button>
              )
            }
          >
            <Table
              columns={variantColumns}
              dataSource={variantGroupDetail.variants || []}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {variantGroupDetail?.id && (
        <ModalAssignVariant
          visible={showAssignModal}
          onCancel={() => setShowAssignModal(false)}
          variantGroupId={variantGroupDetail.id}
          variantGroupName={variantGroupDetail.group_name || ""}
          excludeVariantIds={getAssignedVariantIds()}
          onSuccess={handleAssignSuccess}
        />
      )}
    </Form>
  );
};

export default VariantGroupDetail;