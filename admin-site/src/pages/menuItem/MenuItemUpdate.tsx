import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import MenuItemForm from "../../components/menuItem/menuItemForm/MenuItemForm";
import {
  ImageUploadContext,
  type ImageFile,
} from "../../context/ImageUploadContext";
import { useEffect, useState } from "react";
// import { showNotification } from "../../components/common/Notification/ToastCustom";
import type { VariantGroup } from "../../type/variant/variant";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createMenuItemStart } from "../../store/slices/menuItem/menuItemCreateSlice";
import { fetchMenuItemDetailStart } from "../../store/slices/menuItem/menuItemDetailSlice";
import { useParams } from "react-router-dom";
// import type { MenuItemCreatePayload } from "../../type/menu/menu";

const MenuItemUpdatePage = () => {
  const [form] = useForm();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [mainImages, setMainImages] = useState<boolean[]>([]);
  const dispatch = useAppDispatch();
  const { menuItemId } = useParams();
  const { menuItem } = useAppSelector((state) => state.menuItemDetail);

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
            variant_ids: group.variants.map((item) => ({
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
    form
      .validateFields()
      .then(() => {
        const payloadData = handleModifyData();
        dispatch(createMenuItemStart(payloadData as any));
      })
      .catch(() => {});
  };
  useEffect(() => {
    dispatch(fetchMenuItemDetailStart(menuItemId || ""));
  }, [dispatch, menuItemId]);

  return (
    <>
      <TitleLine
        title={menuItem.name}
        status={menuItem.is_available ? "Available" : "UnAvailable"}
        createButtonText="Update"
        onCreate={handleSubMit}
      />
      <ImageUploadContext.Provider
        value={{ images, setImages, mainImages, setMainImages }}
      >
        <MenuItemForm form={form} mode="Update" initData={menuItem} />
      </ImageUploadContext.Provider>
    </>
  );
};

export default MenuItemUpdatePage;
