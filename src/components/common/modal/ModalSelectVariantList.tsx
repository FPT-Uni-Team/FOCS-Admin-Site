import React, { useEffect, useState, useCallback } from "react";
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
  initData?: VariantGroup[];
  onDeleteVariantGroup?: (groupId: string) => void;
  onDeleteVariant?: (groupId: string, variantId: string) => void;
  isloading?: boolean;
}

const VariantSelectionAdmin: React.FC<VariantSelectionModalProps> = ({
  onSaveSelection,
  initData = [],
  onDeleteVariantGroup,
  onDeleteVariant,
  isloading,
}) => {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const { variantGroupsList, loading } = useAppSelector(
    (state) => state.variantGroup
  );
  const [params] = useState<ListPageParams>(defaultParams(1000));

  const [displayVariantGroups, setDisplayVariantGroups] = useState<
    VariantGroup[]
  >([]);
  const [initialSelectedGroupIds, setInitialSelectedGroupIds] = useState<
    Set<string>
  >(new Set());
  const [initialSelectedVariantIds, setInitialSelectedVariantIds] = useState<
    Set<string>
  >(new Set());

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

  const isInitialItem = useCallback(
    (id: string, isVariant: boolean = false): boolean => {
      return isVariant
        ? initialSelectedVariantIds.has(id)
        : initialSelectedGroupIds.has(id);
    },
    [initialSelectedGroupIds, initialSelectedVariantIds]
  );

  const edit = (record: VariantGroup) => {
    if (isInitialItem(record.id)) return;
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const editVariant = (record: Variant) => {
    if (isInitialItem(record.id, true)) return;
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
      const newData = [...displayVariantGroups];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDisplayVariantGroups(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setDisplayVariantGroups(newData);
        setEditingKey("");
      }
    } catch {
      /* no-op */
    }
  };

  const saveVariant = async (groupId: string, variantId: string) => {
    try {
      const row = (await form.validateFields()) as Variant;
      const newVariantGroups = displayVariantGroups.map((group) => {
        if (group.id === groupId) {
          const newVariants = group.variants.map((variant) =>
            variant.id === variantId ? { ...variant, ...row } : variant
          );
          return { ...group, variants: newVariants };
        }
        return group;
      });
      setDisplayVariantGroups(newVariantGroups);
      setEditingVariantKey("");
    } catch {
      /* no-op */
    }
  };

  const isAllVariantsSelected = (groupId: string): boolean => {
    const group = displayVariantGroups.find((g) => g.id === groupId);
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
    if (!checked && isInitialItem(groupId)) return;

    const group = displayVariantGroups.find((g) => g.id === groupId);
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

      if (isInitialItem(groupId)) {
        const initialGroupVariants =
          initData.find((g) => g.id === groupId)?.variants || [];
        if (!newSelection[groupId]) {
          newSelection[groupId] = [];
        }
        initialGroupVariants.forEach((variant) => {
          if (!newSelection[groupId].includes(variant.id)) {
            newSelection[groupId].push(variant.id);
          }
        });
      }

      return newSelection;
    });
  };

  const handleVariantSelect = (
    groupId: string,
    variantId: string,
    checked: boolean
  ) => {
    if (!checked && isInitialItem(variantId, true)) return;

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
        if (newSelection[groupId].length === 0 && !isInitialItem(groupId)) {
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
        isEditing(record) ||
        isInitialItem(record.id),
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
              if (!isEditing(group) && !isInitialItem(group.id)) {
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
              const group = displayVariantGroups.find((g) => g.id === groupId);
              if (group && !isEditing(group) && !isInitialItem(groupId)) {
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
        return editable && !isInitialItem(record.id) ? (
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
        return editable && !isInitialItem(record.id) ? (
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
        return editable && !isInitialItem(record.id) ? (
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
      title: "Action",
      dataIndex: "action",
      width: 150,
      align: "center",
      render: (_, record: VariantGroup) => {
        const editable = isEditing(record);
        const isInitial = isInitialItem(record.id);

        return (
          <Space>
            {editable && !isInitial ? (
              <>
                <Typography.Link
                  onClick={() => save(record.id)}
                  style={{ marginRight: 8 }}
                >
                  Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </>
            ) : (
              <>
                {!isInitial && (
                  <Typography.Link
                    disabled={
                      editingKey !== "" ||
                      editingVariantKey !== "" ||
                      isSelectionMode
                    }
                    onClick={() => edit(record)}
                  >
                    Edit
                  </Typography.Link>
                )}
                {isInitial && (
                  <Popconfirm
                    title="Sure to delete this variant group?"
                    onConfirm={() => onDeleteVariantGroup?.(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                )}
              </>
            )}
          </Space>
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
          return editable && !isInitialItem(record.id, true) ? (
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
          return editable && !isInitialItem(record.id, true) ? (
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
          return editable && !isInitialItem(record.id, true) ? (
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
          const isInitial = isInitialItem(variant.id, true);

          return (
            <Space>
              {editable && !isInitial ? (
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
                      !isSelectionMode ||
                      isInitial
                    }
                  />
                  {!isInitial && (
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
                  )}
                  {isInitial && (
                    <Popconfirm
                      title="Sure to delete this variant?"
                      onConfirm={() => onDeleteVariant?.(group.id, variant.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  )}
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
    if (variantGroupsList || initData) {
      const mergedGroups: VariantGroup[] = [];
      const tempGroupIds = new Set<string>();
      const tempVariantIds = new Set<string>();
      const initialSelection: SelectedVariants = {};

      initData.forEach((initGroup) => {
        const copiedInitGroup: VariantGroup = {
          ...initGroup,
          variants: initGroup.variants.map((v) => ({ ...v })),
        };
        mergedGroups.push(copiedInitGroup);
        tempGroupIds.add(initGroup.id);
        if (!initialSelection[initGroup.id]) {
          initialSelection[initGroup.id] = [];
        }
        initGroup.variants.forEach((initVariant) => {
          tempVariantIds.add(initVariant.id);
          initialSelection[initGroup.id].push(initVariant.id);
        });
      });

      if (variantGroupsList) {
        variantGroupsList.forEach((apiGroup: VariantGroup) => {
          if (!tempGroupIds.has(apiGroup.id)) {
            mergedGroups.push({
              ...apiGroup,
              variants: apiGroup.variants.map((v) => ({ ...v })),
            });
          } else {
            const existingGroupIndex = mergedGroups.findIndex(
              (g) => g.id === apiGroup.id
            );
            if (existingGroupIndex > -1) {
              const existingGroup = mergedGroups[existingGroupIndex];

              apiGroup.variants.forEach((apiVariant) => {
                if (!tempVariantIds.has(apiVariant.id)) {
                  existingGroup.variants.push({ ...apiVariant });
                }
              });
            }
          }
        });
      }

      setDisplayVariantGroups(mergedGroups);
      setInitialSelectedGroupIds(tempGroupIds);
      setInitialSelectedVariantIds(tempVariantIds);
      setSelectedVariants(initialSelection);
    }
  }, [variantGroupsList, initData]);

  const handleSaveAndExitSelectionMode = () => {
    const dataToSave: VariantGroup[] = [];

    displayVariantGroups.forEach((group) => {
      const currentSelectedVariantIds = selectedVariants[group.id] || [];

      const variantsToInclude = group.variants.filter((variant) => {
        return (
          (isInitialItem(variant.id, true) &&
            currentSelectedVariantIds.includes(variant.id)) ||
          (!isInitialItem(variant.id, true) &&
            currentSelectedVariantIds.includes(variant.id))
        );
      });

      if (isInitialItem(group.id) || variantsToInclude.length > 0) {
        dataToSave.push({
          id: group.id,
          group_name: group.group_name,
          is_required: group.is_required,
          min_select: group.min_select || 0,
          max_select: group.max_select || 0,
          variants: variantsToInclude.map((variant) => ({
            id: variant.id,
            name: variant.name,
            price: variant.price,
            prep_per_time: variant.prep_per_time || 0,
            quantity_per_time: variant.quantity_per_time || 0,
            is_available: variant.is_available,
          })),
        });
      }
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
        loading={loading || isloading}
        columns={columns}
        dataSource={displayVariantGroups}
        rowKey="id"
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.variants.length > 0,
        }}
        pagination={false}
        rowSelection={
          isSelectionMode
            ? {
                type: "checkbox",
                ...groupRowSelection,
              }
            : undefined
        }
      />
    </Form>
  );
};

export default VariantSelectionAdmin;
