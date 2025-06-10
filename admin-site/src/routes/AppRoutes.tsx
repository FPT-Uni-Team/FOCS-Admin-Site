import { Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import routes, { type AppRoute } from "./routesConfig";
import MainLayout from "../layouts/MainLayout/MainLayout";

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
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {renderRoutes(routes)}
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
