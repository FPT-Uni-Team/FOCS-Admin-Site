import { useEffect } from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "./store/store";
import "antd/dist/reset.css";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  // Set default storeId if not exists
  useEffect(() => {
    const storeId = localStorage.getItem('storeId');
    if (!storeId) {
      const defaultStoreId = '550e8400-e29b-41d4-a716-446655440000';
      localStorage.setItem('storeId', defaultStoreId);
    }
  }, []);

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
}

export default App;
