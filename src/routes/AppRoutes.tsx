import { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import routes, { type AppRoute } from "./routesConfig";
import MainLayout from "../layouts/MainLayout/MainLayout";
import FallBack from "../components/common/Fallback/FallBack";
import { ProtectedRoute } from "../components/common/Route/ProtectedRoute";
import { StoreIdHandler } from "../components/common/Route/StoreIdHandler";
import NotFound from "../components/common/NotFound/NotFound";
const LoginPage = lazy(() => import("../pages/login/LoginPage"));

const appRoutes = routes;

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
      <Route
        path="/:storeId/login"
        element={
          <>
            <StoreIdHandler />
            <LoginPage />
          </>
        }
      />
      <Route
        path="/:storeId"
        element={
          <>
            <StoreIdHandler />
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          </>
        }
      >
        {renderRoutes(appRoutes)}
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
