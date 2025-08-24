import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import { fetchMenuItemsStart } from "../../store/slices/menuItem/menuItemSlice";
import MenuItemList from "../../components/menuItem/menuItemList/MenuItemList";
import type { ListPageParams } from "../../type/common/common";
import { useCallback, useEffect } from "react";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const MenuItemPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchData = useCallback(
    async (params: ListPageParams) => {
      dispatch(fetchMenuItemsStart(params));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);

  return (
    <>
      <TitleLine
        title="Menu Item List"
        onCreate={() => {
          navigate("create");
        }}
      />
      <MenuItemList fetchData={fetchData} />
    </>
  );
};

export default MenuItemPage;
