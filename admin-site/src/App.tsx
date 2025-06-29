import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAppSelector } from "./hooks/redux";
import { LoadingOutlined } from "@ant-design/icons";
import { notification, Spin } from "antd";
import { setNotificationApi } from "./components/common/Notification/ToastCustom";

function App() {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setNotificationApi(api);
  }, [api]);
  useEffect(() => {
    const storeId = localStorage.getItem("storeId");
    if (!storeId) {
      const defaultStoreId = "550e8400-e29b-41d4-a716-446655440000";
      localStorage.setItem("storeId", defaultStoreId);
    }
  }, []);
  const { count } = useAppSelector((state) => state.loadingGlobal);
  const globalLoading = count > 0;
  return (
    <Spin
      spinning={globalLoading}
      indicator={<LoadingOutlined spin />}
      size="large"
    >
      {contextHolder}
      <AppRoutes />
    </Spin>
  );
}

export default App;
