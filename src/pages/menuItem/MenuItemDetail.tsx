import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import {
  ImageUploadContext,
  type ImageFile,
} from "../../context/ImageUploadContext";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchMenuItemDetailStart } from "../../store/slices/menuItem/menuItemDetailSlice";
import { useNavigate, useParams } from "react-router-dom";
import { checkActive, checkShowEdit } from "../../helper/checkStatus";
import MenuItemDetailForm from "../../components/menuItem/menuItemDetail/MenuItemDetailForm";
import { changeStatusMenuItemStart } from "../../store/action/menuItemAction";
import { Modal } from "antd";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import {
  deleteMenuItemStart,
  clearDeleteMenuItemState,
} from "../../store/slices/menuItem/menuItemDeleteSlice";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const MenuItemDetailPage = () => {
  const [form] = useForm();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [mainImages, setMainImages] = useState<boolean[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { menuItem } = useAppSelector((state) => state.menuItemDetail);
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useAppSelector((state) => state.menuItemDelete);

  const fetchChangeStatusMenuItem = async (
    category: string,
    menuItemId: string
  ) => {
    dispatch(changeStatusMenuItemStart({ category, menuItemId }));
  };

  const handleDeleteMenuItem = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchMenuItemDetailStart(menuItemId || ""));
  }, [dispatch, menuItemId]);

  useEffect(() => {
    if (deleteSuccess) {
      showNotification("success", "Delete menu item success!");
      navigate("/menu-items");
      dispatch(clearDeleteMenuItemState());
    }
  }, [deleteSuccess, navigate, dispatch]);

  useEffect(() => {
    if (deleteError) {
      showNotification("error", deleteError);
      dispatch(clearDeleteMenuItemState());
    }
  }, [deleteError, dispatch]);

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
        title={menuItem.name}
        status={menuItem.is_available ? "Available" : "UnAvailable"}
        isActive={checkActive(
          menuItem.is_available ? "Available" : "UnAvailable"
        )}
        contentModal="this menu item"
        onAction={fetchChangeStatusMenuItem}
        onEdit={() => {
          navigate(`/menu-items/update/${menuItemId}`);
        }}
        onDelete={handleDeleteMenuItem}
        hasMoreAction
        promotionId={menuItemId}
        isShowEdit={checkShowEdit(
          menuItem.is_available ? "Available" : "UnAvailable"
        )}
        deleteLoading={deleteLoading}
      />
      <ImageUploadContext.Provider
        value={{ images, setImages, mainImages, setMainImages }}
      >
        <MenuItemDetailForm form={form} menuItemDetail={menuItem} />
      </ImageUploadContext.Provider>

      <Modal
        title="Delete Menu Item"
        open={isDeleteModalOpen}
        onOk={() => {
          setIsDeleteModalOpen(false);
          dispatch(deleteMenuItemStart({ menuItemId: menuItemId || "" }));
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this menu item? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

export default MenuItemDetailPage;
