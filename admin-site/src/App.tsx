import React from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "./store/store";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
