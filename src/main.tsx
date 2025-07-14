import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "./styles/global.scss";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "./store/store";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
