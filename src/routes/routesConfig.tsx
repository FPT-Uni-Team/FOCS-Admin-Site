import {
  AppstoreOutlined,
  BranchesOutlined,
  GiftOutlined,
  ProfileOutlined,
  TagOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import React, {
  lazy,
  type LazyExoticComponent,
  type ReactNode,
} from "react";

const PromotionListPage = lazy(
  () => import("../pages/promotion/PromotionList")
);
const PromotionDetailPage = lazy(
  () => import("../pages/promotion/PromotionDetail")
);
const PromotionCreatePage = lazy(
  () => import("../pages/promotion/PromotionCreate")
);
const PromotionUpdatePage = lazy(
  () => import("../pages/promotion/PromotionUpdate")
);
const CouponListPage = lazy(() => import("../pages/coupon/CouponList"));
const CouponCreatePage = lazy(() => import("../pages/coupon/CouponCreate"));
const CouponUpdatePage = lazy(() => import("../pages/coupon/CouponUpdate"));
const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const CouponDetailPage = lazy(() => import("../pages/coupon/CouponDetail"));
const MenuItemListPage = lazy(() => import("../pages/menuItem/MenuItemList"));
const CategoryListPage = lazy(
  () => import("../pages/category/CategoryListPage")
);
const MenuItemCreatePage = lazy(
  () => import("../pages/menuItem/MenuItemCreate")
);
const MenuItemDetailPage = lazy(
  () => import("../pages/menuItem/MenuItemDetail")
);
const MenuItemUpdatePage = lazy(
  () => import("../pages/menuItem/MenuItemUpdate")
);
const CategoryCreatePage = lazy(
  () => import("../pages/category/CategoryCreatePage")
);
const CategoryDetailPage = lazy(
  () => import("../pages/category/CategoryDetailPage")
);
const CategoryUpdatePage = lazy(
  () => import("../pages/category/CategoryUpdatePage")
);
const StaffListPage = lazy(() => import("../pages/staff/StaffListPage"));
const StaffCreatePage = lazy(() => import("../pages/staff/StaffCreatePage"));
const StaffDetailPage = lazy(() => import("../pages/staff/StaffDetailPage"));
const StaffUpdatePage = lazy(() => import("../pages/staff/StaffUpdatePage"));
const TableListPage = lazy(() => import("../pages/table/TableListPage"));
const TableDetailPage = lazy(() => import("../pages/table/TableDetailPage"));
const TableCreatePage = lazy(() => import("../pages/table/TableCreatePage"));
const TableUpdatePage = lazy(() => import("../pages/table/TableUpdatePage"));
const VariantGroupListPage = lazy(() => import("../pages/variant/VariantGroupListPage"));
const VariantGroupDetailPage = lazy(() => import("../pages/variant/VariantGroupDetailPage"));
const VariantGroupUpdatePage = lazy(() => import("../pages/variant/VariantGroupUpdatePage"));
const VariantGroupCreatePage = lazy(() => import("../pages/variant/VariantGroupCreatePage"));
const OrderListPage = lazy(() => import("../pages/order/OrderListPage"));

export interface AppRoute {
  path: string;
  component?: LazyExoticComponent<React.FC>;
  label?: string;
  icon?: ReactNode;
  hidden?: boolean;
  children?: AppRoute[];
  isNotLayout?: boolean;
}

export const routes: AppRoute[] = [
  {
    path: "/promotions",
    component: PromotionListPage,
    label: "Promotions",
    icon: <TagOutlined />,
  },
  {
    path: "/promotions/:promotionId",
    component: PromotionDetailPage,
    hidden: true,
  },
  {
    path: "/promotions/create",
    component: PromotionCreatePage,
    hidden: true,
  },
  {
    path: "/promotions/update/:promotionId",
    component: PromotionUpdatePage,
    hidden: true,
  },
  {
    path: "/login",
    component: LoginPage,
    label: "Login",
    hidden: true,
    isNotLayout: true,
  },
  {
    path: "/coupons",
    component: CouponListPage,
    label: "Coupons",
    icon: <GiftOutlined />,
  },
  {
    path: "/coupons/create",
    component: CouponCreatePage,
    label: "Create Coupon",
    hidden: true,
  },
  {
    path: "/coupons/:couponId",
    component: CouponDetailPage,
    label: "Coupon Detail",
    hidden: true,
  },
  {
    path: "/coupons/:couponId/edit",
    component: CouponUpdatePage,
    label: "Update Coupon",
    hidden: true,
  },
  {
    path: "/menu-items",
    component: MenuItemListPage,
    label: "Menu Item",
    icon: <ProfileOutlined />,
  },
  {
    path: "/menu-items/:menuItemId",
    component: MenuItemDetailPage,
    hidden: true,
  },
  {
    path: "/categories",
    component: CategoryListPage,
    label: "Category",
    icon: <AppstoreOutlined />,
  },
  {
    path: "/categories/create",
    component: CategoryCreatePage,
    label: "Category",
    hidden: true,
  },
  {
    path: "/categories/:categoryId",
    component: CategoryDetailPage,
    label: "Category",
    hidden: true,
  },
  {
    path: "/categories/update/:categoryId",
    component: CategoryUpdatePage,
    label: "Category",
    hidden: true,
  },
  {
    path: "/menu-items/create",
    component: MenuItemCreatePage,
    hidden: true,
  },
  {
    path: "/menu-items/update/:menuItemId",
    component: MenuItemUpdatePage,
    hidden: true,
  },
  {
    path: "/staffs",
    component: StaffListPage,
    label: "Staff",
    icon: <UserOutlined />,
  },
  {
    path: "/staffs/create",
    component: StaffCreatePage,
    hidden: true,
  },
  {
    path: "/staffs/:staffId",
    component: StaffDetailPage,
    hidden: true,
  },
  {
    path: "/staffs/update/:staffId",
    component: StaffUpdatePage,
    hidden: true,
  },
  {
    path: "/tables",
    component: TableListPage,
    label: "Tables",
    icon: <AppstoreOutlined />,
  },
  {
    path: "/tables/create",
    component: TableCreatePage,
    hidden: true,
  },
  {
    path: "/tables/:tableId",
    component: TableDetailPage,
    hidden: true,
  },
  {
    path: "/tables/update/:tableId",
    component: TableUpdatePage,
    hidden: true,
  },
  {
    path: "/variant-groups",
    component: VariantGroupListPage,
    label: "Variant Groups",
    icon: <BranchesOutlined />,
  },
  {
    path: "/variant-groups/create",
    component: VariantGroupCreatePage,
    hidden: true,
  },
  {
    path: "/variant-groups/:variantGroupId",
    component: VariantGroupDetailPage,
    hidden: true,
  },
  {
    path: "/variant-groups/:variantGroupId/update",
    component: VariantGroupUpdatePage,
    hidden: true,
  },
  {
    path: "/orders",
    component: OrderListPage,
    label: "Orders",
    icon: <ShoppingCartOutlined />,
  },
];

export default routes;
