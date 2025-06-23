import { Avatar, Dropdown, type MenuProps } from "antd";
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

  const items: MenuProps["items"] = [
    {
      key: "username",
      label: <>👤 {name}</>,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "🚪 Logout",
      onClick: () => dispatch(logout()),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      className={styles.customDropdown}
      trigger={["click"]}
    >
      <Avatar shape="circle">{name}</Avatar>
    </Dropdown>
  );
};

export default MenuUser;
