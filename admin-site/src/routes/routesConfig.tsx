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
const CouponListPage = lazy(() => import("../pages/coupon/CouponList"));

export interface AppRoute {
  path: string;
  component?: LazyExoticComponent<() => JSX.Element>;
  label: string;
  icon?: ReactNode;
  hidden?: boolean;
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  {
    path: "/promotions",
    component: PromotionListPage,
    label: "Promotions",
    icon: <UserOutlined />,
    children: [
      {
        path: "/promotions/promotions1",
        component: PromotionListPage,
        label: "Promotions1",
        icon: <UserOutlined />,
      },
      {
        path: "/promotions/promotions2",
        component: CouponListPage,
        label: "Promotions2",
        icon: <UserOutlined />,
      },
    ],
  },
];

export default routes;
