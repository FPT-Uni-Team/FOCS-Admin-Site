import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Space,
  Typography,
  Form,
  InputNumber,
  Popconfirm,
  Switch,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import TableReuse from "../Table/TableReuse";
import type { Variant, VariantGroup } from "../../../type/variant/variant";
import {
  defaultParams,
  type ListPageParams,
} from "../../../type/common/common";
import { fetchVariantGroupsStart } from "../../../store/slices/variant/variantGroupSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useForm } from "antd/es/form/Form";

const { Text } = Typography;

type SelectedVariants = Record<string, string[]>;

interface VariantSelectionModalProps {
  onSaveSelection: (selectedData: VariantGroup[]) => void;
}

const VariantSelectionAdmin: React.FC<VariantSelectionModalProps> = ({
  onSaveSelection,
}) => {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const { variantGroupsList, loading } = useAppSelector(
    (state) => state.variantGroup
  );
  const [params] = useState<ListPageParams>(defaultParams(1000));

  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
  const [cachedSelectedVariants, setCachedSelectedVariants] =
    useState<SelectedVariants>({});

  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>(
    {}
  );

  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);

  const [editingKey, setEditingKey] = useState<string>("");
  const [editingVariantKey, setEditingVariantKey] = useState<string>("");

  const isEditing = (record: VariantGroup | Variant) =>
    record.id === editingKey;
  const isEditingVariant = (record: Variant) => record.id === editingVariantKey;

  const edit = (record: VariantGroup) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const editVariant = (record: Variant) => {
    form.setFieldsValue({ ...record });
    setEditingVariantKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
    setEditingVariantKey("");
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as VariantGroup;
      const newData = [...variantGroups];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setVariantGroups(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setVariantGroups(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const saveVariant = async (groupId: string, variantId: string) => {
    try {
      const row = (await form.validateFields()) as Variant;
      const newVariantGroups = variantGroups.map((group) => {
        if (group.id === groupId) {
          const newVariants = group.variants.map((variant) =>
            variant.id === variantId ? { ...variant, ...row } : variant
          );
          return { ...group, variants: newVariants };
        }
        return group;
      });
      setVariantGroups(newVariantGroups);
      setEditingVariantKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const isAllVariantsSelected = (groupId: string): boolean => {
    const group = variantGroups.find((g) => g.id === groupId);
    if (!group) return false;
    const availableVariantIds = group.variants
      .filter((v) => v.is_available)
      .map((v) => v.id);

    const selectedIds = selectedVariants[groupId] || [];

    return (
      availableVariantIds.length > 0 &&
      availableVariantIds.every((id) => selectedIds.includes(id))
    );
  };

  const handleGroupSelect = (groupId: string, checked: boolean) => {
    const group = variantGroups.find((g) => g.id === groupId);
    if (!group) return;

    setSelectedVariants((prev) => {
      const newSelection = { ...prev };

      if (checked) {
        newSelection[groupId] = group.variants
          .filter((v) => v.is_available)
          .map((v) => v.id);
      } else {
        delete newSelection[groupId];
      }

      return newSelection;
    });
  };

  const handleVariantSelect = (
    groupId: string,
    variantId: string,
    checked: boolean
  ) => {
    setSelectedVariants((prev) => {
      const newSelection = { ...prev };
      if (checked) {
        if (!newSelection[groupId]) {
          newSelection[groupId] = [];
        }
        if (!newSelection[groupId].includes(variantId)) {
          newSelection[groupId].push(variantId);
        }
      } else {
        newSelection[groupId] =
          newSelection[groupId]?.filter((id) => id !== variantId) || [];
        if (newSelection[groupId].length === 0) {
          delete newSelection[groupId];
        }
      }
      return newSelection;
    });
  };

  const groupRowSelection = {
    selectedRowKeys: Object.keys(selectedVariants).filter((groupId) =>
      isAllVariantsSelected(groupId)
    ),
    onSelect: (record: VariantGroup, selected: boolean) => {
      if (isSelectionMode) {
        handleGroupSelect(record.id, selected);
      }
    },
    getCheckboxProps: (record: VariantGroup) => ({
      disabled:
        !isSelectionMode ||
        record.variants.every((v) => !v.is_available) ||
        isEditing(record),
      indeterminate:
        selectedVariants[record.id]?.length > 0 &&
        !isAllVariantsSelected(record.id),
    }),
    onSelectAll: (selected: boolean, selectedRows: VariantGroup[]) => {
      if (isSelectionMode) {
        setSelectedVariants((prev) => {
          const newSelection = { ...prev };
          if (selected) {
            selectedRows.forEach((group) => {
              if (!isEditing(group)) {
                const availableVariantIds = group.variants
                  .filter((v) => v.is_available)
                  .map((v) => v.id);
                if (availableVariantIds.length > 0) {
                  newSelection[group.id] = availableVariantIds;
                }
              }
            });
          } else {
            Object.keys(selectedVariants).forEach((groupId) => {
              const group = variantGroups.find((g) => g.id === groupId);
              if (group && !isEditing(group)) {
                delete newSelection[groupId];
              }
            });
          }
          return newSelection;
        });
      }
    },
  };

  const columns: ColumnsType<VariantGroup> = [
    {
      title: "Variant Group Name",
      dataIndex: "group_name",
      key: "group_name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Min Select",
      dataIndex: "min_select",
      key: "min_select",
      width: 100,
      align: "center",
      render: (text: number, record: VariantGroup) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="min_select"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: "Max Select",
      dataIndex: "max_select",
      key: "max_select",
      width: 100,
      align: "center",
      render: (text: number, record: VariantGroup) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="max_select"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: "Required",
      dataIndex: "is_required",
      key: "is_required",
      width: 100,
      align: "center",
      render: (checked: boolean, record: VariantGroup) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="is_required"
            valuePropName="checked"
            style={{ margin: 0 }}
          >
            <Switch />
          </Form.Item>
        ) : (
          <Switch checked={checked} disabled />
        );
      },
    },
    {
      title: "Selected",
      key: "selected",
      width: 100,
      align: "center",
      render: (_, record) => {
        const selectedCount = selectedVariants[record.id]?.length || 0;
        const availableCount = record.variants.filter(
          (v) => v.is_available
        ).length;
        return `${selectedCount}/${availableCount}`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 150,
      align: "center",
      render: (_, record: VariantGroup) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={
              editingKey !== "" || editingVariantKey !== "" || isSelectionMode
            }
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const expandedRowRender = (group: VariantGroup) => {
    const variantColumns: ColumnsType<Variant> = [
      {
        title: "Variant Name",
        dataIndex: "name",
        key: "name",
        render: (text: string, record: Variant) => (
          <Space>
            <Text>{text}</Text>
            {!record.is_available && (
              <Text type="secondary">(Unavailable)</Text>
            )}
          </Space>
        ),
      },
      {
        title: "Prep Time (min)",
        dataIndex: "prep_per_time",
        key: "prep_per_time",
        align: "center",
        width: 100,
        render: (prep: number, record: Variant) => {
          const editable = isEditingVariant(record);
          return editable ? (
            <Form.Item
              name="prep_per_time"
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
          ) : prep !== undefined ? (
            `${prep}′`
          ) : (
            "-"
          );
        },
      },
      {
        title: "Qty / Time",
        dataIndex: "quantity_per_time",
        key: "quantity_per_time",
        width: 100,
        align: "center",
        render: (qty: number, record: Variant) => {
          const editable = isEditingVariant(record);
          return editable ? (
            <Form.Item
              name="quantity_per_time"
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
          ) : qty !== undefined ? (
            qty
          ) : (
            "-"
          );
        },
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        width: 100,
        render: (price: number) => (
          <Text type="success">
            {price > 0 ? `+${price.toLocaleString()}đ` : "-"}
          </Text>
        ),
      },
      {
        title: "Available",
        dataIndex: "is_available",
        key: "is_available",
        width: 100,
        align: "center",
        render: (available: boolean, record: Variant) => {
          const editable = isEditingVariant(record);
          return editable ? (
            <Form.Item
              name="is_available"
              valuePropName="checked"
              style={{ margin: 0 }}
            >
              <Switch />
            </Form.Item>
          ) : (
            <Switch checked={available} disabled />
          );
        },
      },
      {
        title: "Action",
        key: "action",
        width: 150,
        align: "center",
        render: (_, variant: Variant) => {
          const editable = isEditingVariant(variant);
          return (
            <Space>
              {editable ? (
                <>
                  <Typography.Link
                    onClick={() => saveVariant(group.id, variant.id)}
                  >
                    Save
                  </Typography.Link>
                  <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <a>Cancel</a>
                  </Popconfirm>
                </>
              ) : (
                <>
                  <Checkbox
                    checked={
                      selectedVariants[group.id]?.includes(variant.id) || false
                    }
                    onChange={(e) =>
                      handleVariantSelect(
                        group.id,
                        variant.id,
                        e.target.checked
                      )
                    }
                    disabled={
                      !variant.is_available ||
                      editingVariantKey !== "" ||
                      !isSelectionMode
                    }
                  />
                  <Typography.Link
                    disabled={
                      editingKey !== "" ||
                      editingVariantKey !== "" ||
                      isSelectionMode
                    }
                    onClick={() => editVariant(variant)}
                  >
                    Edit
                  </Typography.Link>
                </>
              )}
            </Space>
          );
        },
      },
    ];

    return (
      <TableReuse
        columns={variantColumns}
        dataSource={group.variants}
        rowKey="id"
        pagination={false}
      />
    );
  };

  useEffect(() => {
    dispatch(fetchVariantGroupsStart(params));
  }, [dispatch, params]);

  useEffect(() => {
    if (variantGroupsList) {
      setVariantGroups(variantGroupsList);
    }
  }, [variantGroupsList]);

  const handleSaveAndExitSelectionMode = () => {
    const dataToSave = variantGroups
      .filter((group) => selectedVariants[group.id]?.length > 0)
      .map((group) => {
        const selectedIds = selectedVariants[group.id];
        const selectedVariantsData = group.variants
          .filter((variant) => selectedIds.includes(variant.id))
          .map((variant) => ({
            id: variant.id,
            name: variant.name,
            price: variant.price,
            prep_per_time: variant.prep_per_time || 0,
            quantity_per_time: variant.quantity_per_time || 0,
            is_available: variant.is_available,
          }));

        return {
          id: group.id,
          group_name: group.group_name,
          is_required: group.is_required,
          min_select: group.min_select || 0,
          max_select: group.max_select || 0,
          variants: selectedVariantsData,
        };
      });

    onSaveSelection(dataToSave);
    setIsSelectionMode(false);
    setCachedSelectedVariants({});
  };

  const handleAddVariantClick = () => {
    setCachedSelectedVariants(selectedVariants);
    setIsSelectionMode(true);
  };

  const handleCancelSelection = () => {
    setSelectedVariants(cachedSelectedVariants);
    setIsSelectionMode(false);
  };

  return (
    <Form form={form} component={false}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography.Title level={5}>Select Variants</Typography.Title>
        {!isSelectionMode && (
          <Button
            type="primary"
            onClick={handleAddVariantClick}
            disabled={editingKey !== "" || editingVariantKey !== ""}
          >
            Add Variant
          </Button>
        )}
        {isSelectionMode && (
          <Space>
            <Button type="primary" onClick={handleSaveAndExitSelectionMode}>
              OK
            </Button>
            <Button onClick={handleCancelSelection}>Cancel</Button>
          </Space>
        )}
      </div>

      <TableReuse
        loading={loading}
        columns={columns}
        dataSource={variantGroups}
        rowKey="id"
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.variants.length > 0,
        }}
        pagination={false}
        rowSelection={{
          type: "checkbox",
          ...groupRowSelection,
        }}
      />
    </Form>
  );
};

export default VariantSelectionAdmin;
