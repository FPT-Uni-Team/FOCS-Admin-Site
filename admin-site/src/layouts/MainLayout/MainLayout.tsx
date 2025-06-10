import React, { useState } from "react";
import { Button, Layout, theme } from "antd";
import ContentWrapper from "./ContentWrapper/ContentWrapper";
import styles from "./MainLayout.module.scss";
import SiderMenu from "./SiderMenu/SiderMenu";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const customTrigger = (
    <div className={styles.customTrigger}>
      <Button
        type="text"
        icon={collapsed ? <RightCircleOutlined /> : <LeftCircleOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className={styles.triggerButton}
      />
    </div>
  );
  return (
    <Layout className={styles.mainLayout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: colorBgContainer }}
        trigger={customTrigger}
      >
        <SiderMenu />
      </Sider>
      <Layout>
        <ContentWrapper />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
