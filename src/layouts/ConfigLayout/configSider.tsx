import type { MenuProps } from "antd";
import routes, { type AppRoute } from "../../routes/routesConfig";

export const convertToAntdMenuItems = (
  routesData: AppRoute[] = routes
): MenuProps["items"] =>
  routesData
    .filter((route) => !route.hidden)
    .map((route) => ({
      key: route.path,
      icon: route.icon,
      label: route.label,
      children: route.children
        ? convertToAntdMenuItems(route.children)
        : undefined,
    }));
