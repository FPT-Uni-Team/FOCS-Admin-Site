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
const CouponListPage = lazy(() => import("../pages/coupon/CouponList"));
const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const CouponDetailPage = lazy(() => import("../pages/coupon/CouponDetail"));

export interface AppRoute {
  path: string;
  component?: LazyExoticComponent<() => JSX.Element>;
  label: string;
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
    label: "Promotions",
    icon: <UserOutlined />,
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
    path: "/coupons/:couponId",
    component: CouponDetailPage,
    label: "Coupon Detail",
    hidden: true,
  },
];

export default routes;
