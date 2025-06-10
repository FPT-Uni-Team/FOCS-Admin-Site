import React from "react";
import { Menu } from "antd";
import { convertToAntdMenuItems } from "../../ConfigLayout/configSider";
import { useLocation, useNavigate } from "react-router-dom";

const SiderMenu: React.FC = () => {
  const items = convertToAntdMenuItems();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={items}
    />
  );
};
export default SiderMenu;
