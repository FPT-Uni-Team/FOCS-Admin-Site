import type { MenuListDataType } from "../../../type/menu/menu";
import CustomLink from "../Link/CustomLink";

export const columnsMenuItemNoSort = [
  {
    title: "Menu item name",
    dataIndex: "menuName",
    key: "name",

    render: (value: string, _record: MenuListDataType) => {
      return <CustomLink title={value} href="promotions" />;
    },
  },
  {
    title: "Menu Base Price",
    dataIndex: "menuBasePrice",
    key: "base_price",
  },
  {
    title: "Status",
    dataIndex: "isAvailable",
    key: "is_available",
  },
  {
    title: "Menu category",
    dataIndex: "menuCategoryId",
    key: "menu_category_id",
  },
];
