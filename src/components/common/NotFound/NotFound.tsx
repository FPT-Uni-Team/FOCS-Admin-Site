import { Result } from "antd";

function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn tìm không tồn tại."
    />
  );
}

export default NotFound;
