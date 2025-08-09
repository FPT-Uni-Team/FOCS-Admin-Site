import { useForm } from "antd/es/form/Form";
import CategoryForm from "../../components/category/CategoryForm";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { checkActive, checkShowEdit } from "../../helper/checkStatus";
import { useEffect, useState } from "react";
import { fetchCategoryDetailStart } from "../../store/slices/category/categoryDetailSlice";
import { changeCategoryStatusStart } from "../../store/slices/category/categoryChangeStatusSlice";
import { Modal } from "antd";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import {
  deleteCategoryStart,
  clearDeleteCategoryState,
} from "../../store/slices/category/categoryDeleteSlice";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";
const CategoryPage = () => {
  const [form] = useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.categoryDetail);
  const { categoryId } = useParams();
  const { success } = useAppSelector((state) => state.changeCategoryStatus);
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useAppSelector((state) => state.categoryDelete);

  const fetchChangeStatusCategory = (category: string, categoryId: string) => {
    dispatch(
      changeCategoryStatusStart(
        category == "active" ? "enable" : "disable",
        categoryId
      )
    );
  };

  const handleDeleteCategory = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchCategoryDetailStart(categoryId || ""));
  }, [dispatch, categoryId, success]);

  useEffect(() => {
    if (deleteSuccess) {
      showNotification("success", "Delete category success!");
      navigate("/categories");
      dispatch(clearDeleteCategoryState());
    }
  }, [deleteSuccess, navigate, dispatch]);

  useEffect(() => {
    if (deleteError) {
      showNotification("error", deleteError);
      dispatch(clearDeleteCategoryState());
    }
  }, [deleteError, dispatch]);

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
        isActive={checkActive(category.is_active ? "Available" : "UnAvailable")}
        contentModal="this category"
        onAction={fetchChangeStatusCategory}
        onEdit={() => {
          navigate(`/categories/update/${categoryId}`);
        }}
        onDelete={handleDeleteCategory}
        hasMoreAction
        promotionId={categoryId}
        isShowEdit={checkShowEdit(
          category.is_active ? "Available" : "UnAvailable"
        )}
        deleteLoading={deleteLoading}
      />
      <CategoryForm form={form} mode="Detail" initData={category} />

      <Modal
        title="Delete Category"
        open={isDeleteModalOpen}
        onOk={() => {
          setIsDeleteModalOpen(false);
          dispatch(deleteCategoryStart({ categoryId: categoryId || "" }));
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this category? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

export default CategoryPage;
