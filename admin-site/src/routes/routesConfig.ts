// src/routes/routesConfig.ts
import React, { lazy } from "react";

const PromotionListPage = lazy(
  () => import("../pages/promotion/PromotionList")
);

interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.FC>;
  exact?: boolean;
}

const routes: RouteConfig[] = [
  { path: "/promotions", component: PromotionListPage },
];

export default routes;
