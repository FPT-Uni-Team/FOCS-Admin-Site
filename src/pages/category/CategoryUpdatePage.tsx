import { useForm } from "antd/es/form/Form";
import CategoryForm from "../../components/category/CategoryForm";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { fetchCategoryDetailStart } from "../../store/slices/category/categoryDetailSlice";
import {
  resetCategoryUpdate,
  updateCategoryStart,
} from "../../store/slices/category/categoryUpdateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";
const CategoryUpdatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.categoryDetail);
  const { categoryId } = useParams();
  const { success, error } = useAppSelector((state) => state.categoryUpdate);

  const handleCreateCategory = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        const allFormValues = form.getFieldsValue();
        const dataPayload = {
          id: categoryId,
          name: allFormValues.name,
          description: allFormValues.description,
          sort_order: allFormValues.sort_order,
        };
        dispatch(updateCategoryStart(dataPayload));
      })
      .catch(() => {});
  }, [categoryId, dispatch, form]);

  useEffect(() => {
    if (success) {
      showNotification("success", "Update category success!");
      dispatch(resetCategoryUpdate());
      navigate(`/categories/${categoryId}`);
    }
  }, [dispatch, navigate, categoryId, success]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetCategoryUpdate());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(fetchCategoryDetailStart(categoryId || ""));
  }, [dispatch, categoryId]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Categories",
          link: `/${localStorage.getItem("storeId")}/categories`,
        },
        { name: categoryId as string },
      ])
    );
  }, [categoryId, dispatch]);
  return (
    <>
      <TitleLine
        title={category.name}
        status={category.is_active ? "Available" : "UnAvailable"}
        onCreate={handleCreateCategory}
        createButtonText="Update"
      />
      <CategoryForm form={form} mode="Update" initData={category} />
    </>
  );
};

export default CategoryUpdatePage;
