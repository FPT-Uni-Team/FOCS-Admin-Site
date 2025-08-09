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
