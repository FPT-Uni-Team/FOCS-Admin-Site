import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import MenuItemList from "../../components/menuItem/menuItemList/MenuItemList";
import { useAppDispatch } from "../../hooks/redux";
import { fetchMenuItemsStart } from "../../store/slices/menuItem/menuItemSlice";
import type { MenuItemListParams } from "../../type/menuItem/menuItem";

const MenuItemListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchData = async (params: MenuItemListParams) => {
    await dispatch(fetchMenuItemsStart(params));
  };
  return (
    <>
      <TitleLine
        title="Menu Items List"
        onCreate={() => {
          navigate("/menu-items/create");
        }}
      />
      <MenuItemList fetchData={fetchData} />
    </>
  );
};

export default MenuItemListPage; 