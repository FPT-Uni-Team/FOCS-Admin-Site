import React, { useEffect } from "react";
import { Form, Input, Switch, Row, Col, type FormInstance } from "antd";
import type { Variant } from "../../../type/variant/variant";
import { formatPrice } from "../../../helper/formatPrice";
import styles from "./VariantDetail.module.scss";

interface Props {
  form: FormInstance;
  variantDetail: Variant;
  mode?: "View" | "Update";
}

const VariantDetail: React.FC<Props> = ({
  form,
  variantDetail,
  mode = "View",
}) => {
  const isEditMode = mode === "Update";

  useEffect(() => {
    if (variantDetail) {
      form.setFieldsValue({
        name: variantDetail.name || "",
        price: formatPrice(variantDetail.price),
        is_available: variantDetail.is_available ?? true,
      });
    }
  }, [variantDetail, form]);

  return (
    <Form form={form} layout="vertical" name="variantDetailForm" colon={true}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="Variant Name" name="name">
            <Input disabled={!isEditMode} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Price (VND)"
            name="price"
            normalize={(value) => {
              if (!isEditMode) return value;
              const rawValue = value.replace(/\./g, "").replace(/[^0-9]/g, "");
              const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              return formatted;
            }}
          >
            <Input disabled={!isEditMode} addonBefore="VND" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <div className={styles.flexClass}>
            {isEditMode ? (
              <>
                <Form.Item
                  name="is_available"
                  valuePropName="checked"
                  style={{ marginBottom: 0 }}
                >
                  <Switch disabled={!isEditMode} />
                </Form.Item>
                <div className={styles.switchLabel}>Available for ordering</div>
              </>
            ) : (
              ""
            )}
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default VariantDetail;
