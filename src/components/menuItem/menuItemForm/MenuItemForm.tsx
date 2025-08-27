import {
  Button,
  Col,
  Input,
  Row,
  Switch,
  Typography,
  type FormInstance,
} from "antd";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import styles from "./MenuItem.module.scss";
import clsx from "clsx";
import TableReuse from "../../common/Table/TableReuse";
import { columnsCategoryNoSort } from "../../common/Columns/Colums";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import ModalCategoryList from "../../common/modal/ModalCategoryList";
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { SelectedTableItems } from "../../promotion/promotionForm/PromotionForm";
import type { CategoryListDataType } from "../../../type/category/category";

import VariantManagement from "../../common/modal/ModalSelectVariantList";
import type { VariantGroup } from "../../../type/variant/variant";
import type {
  BackendImage,
  ImageMetadata,
  ImageUploaderGridRef,
  MenuItem,
} from "../../../type/menu/menu";
import ImageUploaderGrid from "../../common/Image/ImageUploaderGrid";
import ImageUpdateGrid from "../../common/Image/ImageUpdateGrid";
import type { ColumnsType } from "antd/es/table";

export interface MenuItemFormRef {
  getImageUploaderGridRef: () => ImageUploaderGridRef | null;
  getFormInstance: () => FormInstance;

  setDataCategorySeleted: (
    data: SelectedTableItems<CategoryListDataType>
  ) => void;

  getDataCategorySeleted: () => SelectedTableItems<CategoryListDataType>;
  setVariantGroupsData: (data: VariantGroup[]) => void;
}

export interface MenuItemFormProps {
  mode?: "Update" | "Create";
  form: FormInstance;
  initData?: MenuItem;
  onUploadAllImages?: (files: File[], metadata: ImageMetadata[]) => void;
  isUploadingImages?: boolean;
  handleSubmitModalCategory?: (
    data: CategoryListDataType[],
    key: React.Key[]
  ) => void;
  loadingTableCategory?: boolean;
  handleDeleteCategory?: (menuItem: string[]) => void;
  onDeleteVariantGroup?: (groupId: string) => void;
  onDeleteVariant?: (groupId: string, variantId: string) => void;
  isLoadingVariant?: boolean;
  handleCreateVariant?: (variantGroup: VariantGroup[]) => void;
}

const MenuItemForm = forwardRef<MenuItemFormRef, MenuItemFormProps>(
  (
    {
      mode = "Create",
      form,
      initData,
      onUploadAllImages,
      isUploadingImages,
      handleSubmitModalCategory,
      loadingTableCategory = false,
      handleDeleteCategory,
      onDeleteVariant,
      onDeleteVariantGroup,
      isLoadingVariant,
      handleCreateVariant,
    },
    ref
  ) => {
    const [showModalCategory, setShowModalCategory] = useState<boolean>(false);
    const [dataCategorySeleted, setDataCategorySeleted] = useState<
      SelectedTableItems<CategoryListDataType>
    >({
      keys: [],
      items: [],
    });
    const [dataImage, setDataImage] = useState<BackendImage[]>();
    const [variantGroupsDisplay, setVariantGroupsDisplay] = useState<
      VariantGroup[]
    >([]);
    const onSaveSelection = (variantGroup: VariantGroup[]) => {
      if (mode == "Update") {
        handleCreateVariant?.(variantGroup);
      } else {
        form.setFieldValue("variant_groups", variantGroup);
      }
    };
    const imageGridRef = useRef<ImageUploaderGridRef>(null);

    useImperativeHandle(ref, () => ({
      getImageUploaderGridRef: () => imageGridRef.current,
      getFormInstance: () => form,
      setDataCategorySeleted,
      getDataCategorySeleted: () => dataCategorySeleted,
      setVariantGroupsData: (data: VariantGroup[]) => {
        setVariantGroupsDisplay(data);
        form.setFieldsValue({ variant_groups: data });
      },
    }));

    const columnsWithDelete: ColumnsType<CategoryListDataType> = [
      ...columnsCategoryNoSort,
      ...(mode === "Update"
        ? [
            {
              dataIndex: "action",
              key: "action",
              width: 100,
              align: "center" as const,
              render: (_: unknown, record: CategoryListDataType) => (
                <DeleteOutlined
                  className={styles.deleteIcon}
                  onClick={() => handleDeleteCategory?.([record.id])}
                />
              ),
            },
          ]
        : []),
    ];

    useEffect(() => {
      if (initData && mode == "Update") {
        form.setFieldsValue({
          name: initData.name,
          description: initData.description,
          base_price: initData.base_price
            ?.toLocaleString("vi-VN")
            .replace("đ", ""),
          is_available: initData.is_available,
          category_ids: (initData.categories || []).map((item) => item.id),
          variant_groups: initData.variant_groups,
        });
        setDataCategorySeleted({
          keys: (initData.categories || []).map((item) => item.id),
          items: initData.categories || [],
        });
        setDataImage(initData.images as BackendImage[]);
        setVariantGroupsDisplay(initData.variant_groups || []);
      }
    }, [initData, form, mode]);

    return (
      <Row gutter={12}>
        <Col span={16}>
          <ContentInner>
            <Form
              form={form}
              layout="vertical"
              name="menuItemForm"
              colon={true}
            >
              <Row gutter={36}>
                <Col span={12}>
                  <Form.Item
                    label="Menu Item Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input menu item name!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter menu item name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={36}>
                <Col span={24}>
                  <Form.Item label="Description" name="description">
                    <TextArea
                      rows={4}
                      placeholder="Enter menu item description"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={36}>
                <Col span={12}>
                  <Form.Item
                    name="base_price"
                    label="Base price"
                    normalize={(value) => {
                      const rawValue = value
                        .replace(/\./g, "")
                        .replace(/[^0-9]/g, "");
                      const formatted = rawValue.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        "."
                      );
                      return formatted;
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Please input base price!",
                      },
                    ]}
                  >
                    <Input placeholder="From VND" addonBefore={<>VND</>} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <div className={clsx(styles.flexClass, styles.customSwitch)}>
                    <Form.Item
                      name="is_available"
                      valuePropName="checked"
                      style={{ marginBottom: 0 }}
                    >
                      <Switch />
                    </Form.Item>
                    <div>Active menu item</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="category_ids"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value || value.length <= 0) {
                            return Promise.reject("Please select category!");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Row>
                      <div
                        className={clsx(
                          styles.customTableSelect,
                          styles.marginItem
                        )}
                      >
                        <div className={styles.titleSelectCustom}>
                          <Typography.Title level={5}>
                            Select Category
                          </Typography.Title>
                          <Button
                            icon={<PlusOutlined />}
                            onClick={() => setShowModalCategory(true)}
                          >
                            Select
                          </Button>
                        </div>
                        {showModalCategory && (
                          <>
                            <ModalCategoryList
                              open={showModalCategory}
                              width={1000}
                              onCancel={() => setShowModalCategory(false)}
                              selectedData={dataCategorySeleted.items}
                              selectedDataKey={dataCategorySeleted.keys}
                              handleSubmitModal={(items, keys) => {
                                setShowModalCategory(false);
                                if (mode == "Update")
                                  handleSubmitModalCategory?.(items, keys);
                                else {
                                  setDataCategorySeleted({
                                    keys,
                                    items,
                                  });
                                  form.setFieldsValue({ category_ids: keys });
                                  form.validateFields(["category_ids"]);
                                }
                              }}
                              mode={mode}
                            />
                          </>
                        )}
                        <TableReuse
                          columns={columnsWithDelete}
                          dataSource={dataCategorySeleted.items}
                          rowKey="id"
                          pagination={false}
                          loading={loadingTableCategory}
                        />
                      </div>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="variant_groups"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value || value.length <= 0) {
                            return Promise.reject("Please select variant!");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Row>
                      <div
                        className={clsx(
                          styles.customTableSelect,
                          styles.marginItem
                        )}
                      >
                        <VariantManagement
                          isloading={isLoadingVariant}
                          onSaveSelection={onSaveSelection}
                          initData={variantGroupsDisplay}
                          onDeleteVariant={onDeleteVariant}
                          onDeleteVariantGroup={onDeleteVariantGroup}
                        />
                      </div>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </ContentInner>
        </Col>
        <Col span={8}>
          <div style={{ minHeight: "fit-content" }}>
            <ContentInner>
              {mode == "Create" ? (
                <ImageUploaderGrid />
              ) : (
                <ImageUpdateGrid
                  ref={imageGridRef}
                  initialImages={dataImage}
                  onUploadAllClick={onUploadAllImages}
                  isUploadingImages={isUploadingImages}
                />
              )}
            </ContentInner>
          </div>
        </Col>
      </Row>
    );
  }
);

export default MenuItemForm;
