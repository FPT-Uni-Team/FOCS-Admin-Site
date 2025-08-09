import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import MenuItemForm from "../../components/menuItem/menuItemForm/MenuItemForm";
import {
  ImageUploadContext,
  type ImageFile,
} from "../../context/ImageUploadContext";
import { useEffect, useState } from "react";
import type { VariantGroup } from "../../type/variant/variant";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createMenuItemStart,
  resetMenuItemCreate,
} from "../../store/slices/menuItem/menuItemCreateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { useNavigate } from "react-router-dom";
import type { MenuItemCreatePayload } from "../../type/menu/menu";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const MenuItemCreatePage = () => {
  const [form] = useForm();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [mainImages, setMainImages] = useState<boolean[]>([]);
  const dispatch = useAppDispatch();
  const { success, error } = useAppSelector((state) => state.menuItemCreate);
  const navigate = useNavigate();

  const handleModifyData = () => {
    const allFormValues = form.getFieldsValue();
    return {
      data: {
        name: allFormValues.name,
        description: allFormValues.description,
        base_price: allFormValues.base_price,
        is_available: allFormValues.is_available,
        store_id: "550E8400-E29B-41D4-A716-446655440000",
        category_ids: allFormValues.category_ids,
        variant_groups: (allFormValues.variant_groups as VariantGroup[])?.map(
          (group) => ({
            id: group.id,
            is_required: group.is_required,
            min_select: group.min_select,
            max_select: group.max_select,
            variants: group.variants.map((item) => ({
              id: item.id,
              is_available: item.is_available,
              prep_per_time: item.prep_per_time,
              quantity_per_time: item.quantity_per_time,
            })),
          })
        ),
      },
      images: {
        images,
        mainImages,
      },
    };
  };
  const handleSubMit = () => {
    dispatch(resetMenuItemCreate());
    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyData();
        dispatch(createMenuItemStart(payloadData as MenuItemCreatePayload));
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (success) {
      showNotification("success", "Create menu item success!");
      dispatch(resetMenuItemCreate());
      navigate(`/${localStorage.getItem("storeId")}/menu-items`);
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetMenuItemCreate());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Menu Items",
          link: `/${localStorage.getItem("storeId")}/menu-items`,
        },
        { name: "New Menu Item" },
      ])
    );
  }, [dispatch]);
  return (
    <>
      <TitleLine title="New Menu Item" onCreate={handleSubMit} />
      <ImageUploadContext.Provider
        value={{ images, setImages, mainImages, setMainImages }}
      >
        <MenuItemForm form={form} />
      </ImageUploadContext.Provider>
    </>
  );
};

export default MenuItemCreatePage;
