import { useForm } from "antd/es/form/Form";
import CategoryForm from "../../components/category/CategoryForm";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { checkActive, checkShowEdit } from "../../helper/checkStatus";
import { useEffect } from "react";
import { fetchCategoryDetailStart } from "../../store/slices/category/categoryDetailSlice";
import { changeCategoryStatusStart } from "../../store/slices/category/categoryChangeStatusSlice";
const CategoryPage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.categoryDetail);
  const { categoryId } = useParams();
  const { success } = useAppSelector((state) => state.changeCategoryStatus);

  const fetchChangeStatusCategory = (category: string, categoryId: string) => {
    dispatch(
      changeCategoryStatusStart(
        category == "active" ? "enable" : "disable",
        categoryId
      )
    );
  };

  useEffect(() => {
    dispatch(fetchCategoryDetailStart(categoryId || ""));
  }, [dispatch, categoryId, success]);
  return (
    <>
      <TitleLine
        title={category.name}
        status={category.is_active ? "Available" : "UnAvailable"}
        isActive={checkActive(category.is_active ? "Available" : "UnAvailable")}
        contentModal="this category"
        onAction={fetchChangeStatusCategory}
        onEdit={() => {
          navigate(`/categories/update/${categoryId}`);
        }}
        hasMoreAction
        promotionId={categoryId}
        isShowEdit={checkShowEdit(
          category.is_active ? "Available" : "UnAvailable"
        )}
      />
      <CategoryForm form={form} mode="Detail" initData={category} />
    </>
  );
};

export default CategoryPage;
