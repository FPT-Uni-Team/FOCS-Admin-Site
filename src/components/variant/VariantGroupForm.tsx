import { Col, Form, Input, Row, type FormInstance } from "antd";
import { useEffect } from "react";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import type { VariantGroup } from "../../type/variant/variant";
import { useAppSelector } from "../../hooks/redux";

interface Props {
  mode?: "Update" | "Create" | "Detail";
  form: FormInstance;
  initData?: VariantGroup;
}

const VariantGroupForm: React.FC<Props> = ({ mode = "Create", form, initData }) => {
  const { variantGroupsList } = useAppSelector((state) => state.variantGroup);
  
  useEffect(() => {
    if (initData && (mode == "Update" || mode == "Detail")) {
      form.setFieldsValue({
        name: initData.group_name,
      });
    }
  }, [initData, form, mode]);

  return (
    <ContentInner style={{ minHeight: "fit-content" }}>
      <Form form={form} layout="vertical" name="variantGroupForm" colon={true}>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Variant Group Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input variant group name!",
                },
                {
                  validator: async (_, value) => {
                    if (value && value.trim().length === 0) {
                      throw new Error("Variant group name cannot be empty");
                    }
                    
                   
                    if (mode === "Create" && value) {
                      const trimmedValue = value.trim();
                      const isDuplicate = variantGroupsList.some(
                        (group: VariantGroup) => group.group_name.toLowerCase() === trimmedValue.toLowerCase()
                      );
                      
                      if (isDuplicate) {
                        throw new Error("Variant group name already exists");
                      }
                    }
                    
                    
                    if (mode === "Update" && value && initData) {
                      const trimmedValue = value.trim();
                      const isDuplicate = variantGroupsList.some(
                        (group: VariantGroup) => 
                          group.id !== initData.id && 
                          group.group_name.toLowerCase() === trimmedValue.toLowerCase()
                      );
                      
                      if (isDuplicate) {
                        throw new Error("Variant group name already exists");
                      }
                    }
                  },
                },
              ]}
            >
              <Input
                placeholder="Enter variant group name"
                disabled={mode == "Detail"}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ContentInner>
  );
};

export default VariantGroupForm; 