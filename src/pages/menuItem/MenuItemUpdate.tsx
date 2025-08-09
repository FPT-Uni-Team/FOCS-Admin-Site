import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import MenuItemForm, {
  type MenuItemFormRef,
} from "../../components/menuItem/menuItemForm/MenuItemForm";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VariantGroup } from "../../type/variant/variant";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchMenuItemDetailStart } from "../../store/slices/menuItem/menuItemDetailSlice";
import { useNavigate, useParams } from "react-router-dom";
import type { ImageMetadata, MenuItem } from "../../type/menu/menu";
import menuItemService from "../../services/menuItemService";
import type { CategoryListDataType } from "../../type/category/category";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import {
  resetMenuItem,
  updateMenuItemStart,
} from "../../store/slices/menuItem/menuItemUpdateSlice";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const MenuItemUpdatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { menuItemId } = useParams<{ menuItemId: string }>();
  const { menuItem } = useAppSelector((state) => state.menuItemDetail);
  const { success, error } = useAppSelector((state) => state.menuItemUpdate);
  const menuItemFormRef = useRef<MenuItemFormRef>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [isLoadingVariant, setIsLoadingVariant] = useState(false);
  const navigate = useNavigate();
  const {
    updateImageMenuItem,
    menuItemAssignCategory,
    menuItemDeleteCategory,
    menuItemDeleteVariantGroup,
    menuItemDeleteVariant,
    menuItemGroups,
    createMenuItemGroupsVariant,
  } = menuItemService;

  const handleModifyData = () => {
    try {
      form.validateFields();
      const allFormValues = form.getFieldsValue();
      return {
        id: menuItemId,
        name: allFormValues.name,
        description: allFormValues.description,
        base_price: allFormValues.base_price,
        is_available: allFormValues.is_available,
        store_id: "550E8400-E29B-41D4-A716-446655440000",
      };
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubMit = () => {
    dispatch(resetMenuItem());
    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyData();
        dispatch(updateMenuItemStart(payloadData as MenuItem));
      })
      .catch(() => {});
  };

  const handleImageUploadAll = useCallback(
    async (files: File[], metadata: ImageMetadata[]) => {
      setIsUploadingImages(true);
      try {
        await updateImageMenuItem({
          menuItemId: menuItemId as string,
          files,
          metadata,
        });
      } catch {
        setIsUploadingImages(false);
      } finally {
        setIsUploadingImages(false);
      }
    },
    [menuItemId, updateImageMenuItem]
  );
  const handleSubmitModalCategory = useCallback(
    async (items: CategoryListDataType[], key: React.Key[]) => {
      setIsLoadingCategory(true);
      try {
        await menuItemAssignCategory({
          menuItemId: menuItemId as string,
          listCategory: key as string[],
        });
        const prev = menuItemFormRef.current?.getDataCategorySeleted();
        menuItemFormRef.current?.setDataCategorySeleted({
          keys: [...(prev?.keys || []), ...key],
          items: [...(prev?.items || []), ...items],
        });
        form.setFieldsValue({ category_ids: [...(prev?.keys || []), ...key] });
        form.validateFields(["category_ids"]);
      } catch {
        setIsLoadingCategory(false);
        showNotification("error", "Add new category failed!");
      } finally {
        setIsLoadingCategory(false);
      }
    },
    [form, menuItemAssignCategory, menuItemId]
  );

  const handleDeleteCategory = useCallback(
    async (menuItem: string[]) => {
      setIsLoadingCategory(true);
      try {
        await menuItemDeleteCategory({
          menu_item_id: menuItemId as string,
          cate_ids: menuItem as string[],
        });
        const prev = menuItemFormRef.current?.getDataCategorySeleted();
        const updatedKeys = (prev?.keys || []).filter(
          (key) => !menuItem.includes(key as string)
        );
        const updatedItems = (prev?.items || []).filter(
          (item) => !menuItem.includes(item.id)
        );
        menuItemFormRef.current?.setDataCategorySeleted({
          keys: updatedKeys,
          items: updatedItems,
        });
        form.setFieldsValue({ category_ids: updatedKeys });
        form.validateFields(["category_ids"]);
      } catch {
        setIsLoadingCategory(false);
        showNotification("error", "Delete new category failed!");
      } finally {
        setIsLoadingCategory(false);
      }
    },
    [form, menuItemDeleteCategory, menuItemId]
  );

  const onDeleteVariant = useCallback(
    async (groupId: string, variantId: string) => {
      setIsLoadingVariant(true);
      try {
        await menuItemDeleteVariant({
          variant_group_id: groupId as string,
          variant_ids: [variantId] as string[],
          menu_item_id: menuItemId as string,
        });
        const responseGroups = await menuItemGroups(menuItemId as string);
        menuItemFormRef.current?.setVariantGroupsData(responseGroups.data);
      } catch {
        setIsLoadingVariant(false);
        showNotification("error", "Delete variant failed!");
      } finally {
        setIsLoadingVariant(false);
      }
    },
    [menuItemDeleteVariant, menuItemGroups, menuItemId]
  );

  const onDeleteVariantGroup = useCallback(
    async (groupId: string) => {
      setIsLoadingVariant(true);
      try {
        await menuItemDeleteVariantGroup({
          menu_item_id: menuItemId as string,
          variant_group_id: [groupId] as string[],
        });
        const responseGroups = await menuItemGroups(menuItemId as string);
        menuItemFormRef.current?.setVariantGroupsData(responseGroups.data);
      } catch {
        setIsLoadingVariant(false);
        showNotification("error", "Delete variant failed!");
      } finally {
        setIsLoadingVariant(false);
      }
    },
    [menuItemDeleteVariantGroup, menuItemGroups, menuItemId]
  );

  const handleCreateVariant = useCallback(
    async (variantGroup: VariantGroup[]) => {
      setIsLoadingVariant(true);
      try {
        await createMenuItemGroupsVariant({
          menuItemId: menuItemId as string,
          data: variantGroup || [],
        });
        const responseGroups = await menuItemGroups(menuItemId as string);
        menuItemFormRef.current?.setVariantGroupsData(responseGroups.data);
      } catch {
        setIsLoadingVariant(false);
        showNotification("error", "Create variant failed!");
      } finally {
        setIsLoadingVariant(false);
      }
    },
    [createMenuItemGroupsVariant, menuItemGroups, menuItemId]
  );

  useEffect(() => {
    if (menuItemId) {
      dispatch(fetchMenuItemDetailStart(menuItemId));
    }
  }, [dispatch, menuItemId]);

  useEffect(() => {
    if (menuItemId) {
      dispatch(fetchMenuItemDetailStart(menuItemId));
    }
  }, [dispatch, menuItemId]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Update menu item success!");
      dispatch(resetMenuItem());
      navigate(`/menu-items/${menuItemId}`);
    }
  }, [dispatch, menuItemId, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetMenuItem());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Menu Items",
          link: `/${localStorage.getItem("storeId")}/menu-items`,
        },
        { name: menuItemId as string },
      ])
    );
  }, [dispatch, menuItemId]);

  return (
    <>
      <TitleLine
        title={menuItem?.name}
        status={menuItem?.is_available ? "Available" : "UnAvailable"}
        createButtonText="Update"
        onCreate={handleSubMit}
      />
      {menuItem && (
        <MenuItemForm
          loadingTableCategory={isLoadingCategory}
          form={form}
          mode="Update"
          initData={menuItem}
          ref={menuItemFormRef}
          onUploadAllImages={handleImageUploadAll}
          isUploadingImages={isUploadingImages}
          handleSubmitModalCategory={handleSubmitModalCategory}
          handleDeleteCategory={handleDeleteCategory}
          onDeleteVariant={onDeleteVariant}
          onDeleteVariantGroup={onDeleteVariantGroup}
          isLoadingVariant={isLoadingVariant}
          handleCreateVariant={handleCreateVariant}
        />
      )}
    </>
  );
};

export default MenuItemUpdatePage;
