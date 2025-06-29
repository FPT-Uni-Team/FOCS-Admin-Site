import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import type { PromotionListParams } from "../../type/promotion/promotion";
import { fetchMenuItemsStart } from "../../store/slices/menuItem/menuItemSlice";
import MenuItemList from "../../components/menuItem/menuItemList/MenuItemList";

const MenuItemPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchData = async (params: PromotionListParams) => {
    dispatch(fetchMenuItemsStart(params));
  };
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
