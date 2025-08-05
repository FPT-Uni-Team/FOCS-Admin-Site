import React from "react";
import { Modal, Form, Input, type FormInstance } from "antd";
import type { VariantGroup } from "../../type/variant/variant";
import { useAppSelector } from "../../hooks/redux";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: FormInstance;
  loading?: boolean;
}

const VariantGroupCreateModal: React.FC<Props> = ({
  visible,
  onCancel,
  onOk,
  form,
  loading = false,
}) => {
  const { variantGroupsList } = useAppSelector((state) => state.variantGroup);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk();
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Create New Variant Group"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Create"
      cancelText="Cancel"
      width={500}
    >
      <Form form={form} layout="vertical" name="variantGroupCreateForm" colon={true}>
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
                
                if (value) {
                  const trimmedValue = value.trim();
                  const isDuplicate = variantGroupsList.some(
                    (group: VariantGroup) => group.group_name.toLowerCase() === trimmedValue.toLowerCase()
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
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VariantGroupCreateModal; 