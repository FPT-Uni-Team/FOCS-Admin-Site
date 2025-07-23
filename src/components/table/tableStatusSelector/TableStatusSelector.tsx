import React, { useState } from "react";
import { Button, Dropdown, Modal, Typography } from "antd";
import { DownOutlined, CheckOutlined } from "@ant-design/icons";
import { TableStatus, TableStatusLabel } from "../../../type/table/table";
import type { MenuProps } from "antd";

interface TableStatusSelectorProps {
  currentStatus: number;
  tableId: string;
  onStatusChange: (tableId: string, newStatus: number) => void;
  disabled?: boolean;
}

const TableStatusSelector: React.FC<TableStatusSelectorProps> = ({
  currentStatus,
  tableId,
  onStatusChange,
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  const getStatusDescription = (status: number): string => {
    const descriptions: Record<number, string> = {
      [TableStatus.Available]: "The table is free and usable.",
      [TableStatus.Occupied]: "The table is currently in use.",
      [TableStatus.Reserved]: "The table is reserved.",
      [TableStatus.Cleaning]: "The table is being cleaned.",
      [TableStatus.OutOfService]: "The table is unavailable.",
    };
    return descriptions[status] || "Unknown status";
  };

  const getStatusLabel = (status: number): string => {
    return TableStatusLabel[status as keyof typeof TableStatusLabel] || "Unknown";
  };

  
  const menuItems: MenuProps['items'] = Object.entries(TableStatus)
    .map(([key, value]) => ({
      key: value.toString(),
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography.Text>{key}</Typography.Text>
          {value === currentStatus && <CheckOutlined style={{ color: '#1890ff' }} />}
        </div>
      ),
      onClick: () => {
        if (value !== currentStatus) {
          setSelectedStatus(value);
          setIsModalOpen(true);
        }
      },
      disabled: value === currentStatus,
    }));

  const handleConfirm = () => {
    if (selectedStatus !== null) {
      onStatusChange(tableId, selectedStatus);
      setIsModalOpen(false);
      setSelectedStatus(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStatus(null);
  };

  return (
    <>
      <Dropdown 
        menu={{ items: menuItems }} 
        trigger={['click']}
        disabled={disabled}
      >
        <Button disabled={disabled}>
          Change Status <DownOutlined />
        </Button>
      </Dropdown>

      <Modal
        title="Confirm Status Change"
        open={isModalOpen}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        {selectedStatus !== null && (
          <div>
            <Typography.Paragraph>
              Are you sure you want to change the table status from{' '}
              <Typography.Text strong>
                {getStatusLabel(currentStatus)}
              </Typography.Text>{' '}
              to{' '}
              <Typography.Text strong>
                {getStatusLabel(selectedStatus)}
              </Typography.Text>?
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary">
              {getStatusDescription(selectedStatus)}
            </Typography.Paragraph>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TableStatusSelector; 