import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import { fetchMenuItemsStart } from "../../store/slices/menuItem/menuItemSlice";
import MenuItemList from "../../components/menuItem/menuItemList/MenuItemList";
import type { ListPageParams } from "../../type/common/common";
import { useCallback } from "react";

const MenuItemPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchData = useCallback(
    async (params: ListPageParams) => {
      dispatch(fetchMenuItemsStart(params));
    },
    [dispatch]
  );
  return (
    <>
      <TitleLine
        title="Menu Item List"
        onCreate={() => {
          navigate("/menu-items/create");
        }}
      />
      <MenuItemList fetchData={fetchData} />
    </>
  );
};

export default MenuItemPage;
