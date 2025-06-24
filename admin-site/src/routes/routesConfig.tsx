import { UserOutlined } from "@ant-design/icons";
import {
  lazy,
  type JSX,
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
const CouponListPage = lazy(() => import("../pages/coupon/CouponList"));
const CouponCreatePage = lazy(() => import("../pages/coupon/CouponCreate"));
const CouponUpdatePage = lazy(() => import("../pages/coupon/CouponUpdate"));
const CouponAssignPage = lazy(() => import("../pages/coupon/CouponAssign"));
const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const CouponDetailPage = lazy(() => import("../pages/coupon/CouponDetail"));

export interface AppRoute {
  path: string;
  component?: LazyExoticComponent<() => JSX.Element>;
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
    icon: <UserOutlined />,
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
    icon: <UserOutlined />,
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
    path: "/coupons/assign",
    component: CouponAssignPage,
    label: "Assign Coupons to Promotion",
    hidden: true,
  },
];

export default routes;
