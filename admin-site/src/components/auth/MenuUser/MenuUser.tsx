import { Menu, Dropdown } from "antd";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { logout } from "../../../store/slices/auth/authSlice";
import { parseJwt } from "../../../helper/parseJWT";
import styles from "./MenuUser.module.scss";

const MenuUser = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  if (!accessToken) return null;

  const userInfo = parseJwt(accessToken);
  const name = userInfo?.name || "User";

  const menu = (
    <Menu>
      <Menu.Item key="username" disabled>
        👤 {name}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={() => dispatch(logout())}>
        🚪 Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      placement="bottomRight"
      className={styles.customDropdown}
      trigger={["click"]}
    >
      {name}
    </Dropdown>
  );
};

export default MenuUser;
