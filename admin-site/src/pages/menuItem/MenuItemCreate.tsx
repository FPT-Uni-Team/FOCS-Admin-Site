import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import MenuItemCreateForm from "../../components/menuItem/menuItemCreateForm/MenuItemCreateForm";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createMenuItemStart, resetCreateMenuItemState } from "../../store/slices/menuItem/menuItemCreateSlice";
import type { MenuItemCreatePayload } from "../../type/menuItem/menuItem";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../components/common/Notification/ToastCustom";

const MenuItemCreatePage = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { success, loading, error } = useAppSelector((state) => state.createMenuItem);
  const dispatch = useAppDispatch();

  const handleCreateMenuItem = () => {
    form
      .validateFields()
      .then(() => {
        const formValues = form.getFieldsValue();
        const payloadData: MenuItemCreatePayload = {
          name: formValues.name,
          description: formValues.description || "",
          images: formValues.images,
          base_price: formValues.base_price,
          category_ids: formValues.category_ids || [],
          is_available: formValues.is_available ?? true,
          store_id: "550e8400-e29b-41d4-a716-446655440000",
        };
        
        dispatch(createMenuItemStart(payloadData));
      })
      .catch(() => {
        showNotification("error", "Please check all required fields!");
      });
  };

  useEffect(() => {
    if (success) {
      showNotification("success", "Create menu item success!");
      navigate("/menu-items");
      dispatch(resetCreateMenuItemState());
    }
  }, [navigate, success, dispatch]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
    }
  }, [error]);

  return (
    <>
      <TitleLine
        title="Create New Menu Item"
        onCreate={handleCreateMenuItem}
        createButtonText={loading ? "Creating..." : "Create"}
        isDisableCreate={loading}
      />
      <MenuItemCreateForm form={form} />
    </>
  );
};

export default MenuItemCreatePage; 