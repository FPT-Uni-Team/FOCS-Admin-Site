// src/routes/AppRoutes.tsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./routesConfig";

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      {routes.map(({ path, component: Component }, idx) => (
        <Route key={idx} path={path} element={<Component />} />
      ))}
    </Routes>
  </Suspense>
);

export default AppRoutes;
