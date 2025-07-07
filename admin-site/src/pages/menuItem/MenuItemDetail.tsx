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

const MenuItemDetailPage = () => {
  const [form] = useForm();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [mainImages, setMainImages] = useState<boolean[]>([]);
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { menuItem } = useAppSelector((state) => state.menuItemDetail);

  const fetchChangeStatusMenuItem = () => {};

  useEffect(() => {
    dispatch(fetchMenuItemDetailStart(menuItemId || ""));
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
        hasMoreAction
        promotionId={menuItemId}
        isShowEdit={checkShowEdit(
          menuItem.is_available ? "Available" : "UnAvailable"
        )}
      />
      <ImageUploadContext.Provider
        value={{ images, setImages, mainImages, setMainImages }}
      >
        <MenuItemDetailForm form={form} menuItemDetail={menuItem} />
      </ImageUploadContext.Provider>
    </>
  );
};

export default MenuItemDetailPage;
