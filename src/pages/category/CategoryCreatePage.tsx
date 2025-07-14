import { useForm } from "antd/es/form/Form";
import CategoryForm from "../../components/category/CategoryForm";
import TitleLine from "../../components/common/Title/TitleLine";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createCategoryStart,
  resetCategoryCreate,
} from "../../store/slices/category/categoryCreateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { useNavigate } from "react-router-dom";
const CategoryPage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { success, error } = useAppSelector((state) => state.categoryCreate);
  const handleCreateCategory = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const allFormValues = form.getFieldsValue();
        const dataPayload = {
          name: allFormValues.name,
          description: allFormValues.description,
          sort_order: allFormValues.sort_order,
        };
        dispatch(createCategoryStart(dataPayload));
      })
      .catch(() => {});
  }, [dispatch, form]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Create promotion success!");
      dispatch(resetCategoryCreate());
      navigate("/categories");
    }
  }, [dispatch, navigate, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetCategoryCreate());
    }
  }, [dispatch, error]);

  return (
    <>
      <TitleLine title="New Category" onCreate={handleCreateCategory} />
      <CategoryForm form={form} mode="Create" />
    </>
  );
};

export default CategoryPage;
