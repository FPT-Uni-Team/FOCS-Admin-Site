import { Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import routes, { type AppRoute } from "./routesConfig";
import MainLayout from "../layouts/MainLayout/MainLayout";
import FallBack from "../components/common/Fallback/FallBack";

const loginRoute = routes.find((r) => r.isNotLayout);
const appRoutes = routes.filter((r) => !r.isNotLayout);

const renderRoutes = (routes: AppRoute[]) =>
  routes.map(({ path, component: Component, children }) => {
    if (children) {
      return (
        <Route key={path} path={path} element={<Outlet />}>
          {renderRoutes(children)}
        </Route>
      );
    }
    return (
      <Route
        key={path}
        path={path}
        element={Component ? <Component /> : <></>}
      />
    );
  });

const AppRoutes = () => (
  <Suspense fallback={<FallBack />}>
    <Routes>
      {loginRoute && (
        <Route
          path={loginRoute.path}
          element={loginRoute.component ? <loginRoute.component /> : <></>}
        />
      )}
      <Route path="/" element={<MainLayout />}>
        {renderRoutes(appRoutes)}
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
