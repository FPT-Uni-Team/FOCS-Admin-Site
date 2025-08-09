import React, { useState } from "react";
import { Button, Layout, theme } from "antd";
import ContentWrapper from "./ContentWrapper/ContentWrapper";
import styles from "./MainLayout.module.scss";
import SiderMenu from "./SiderMenu/SiderMenu";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import MenuUser from "../../components/auth/MenuUser/MenuUser";
import { BreadcrumbNav } from "../../components/common/Breadcumb/BreadcrumbNav";

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
        <Header
          style={{ background: colorBgContainer }}
          className={styles.customHeader}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BreadcrumbNav />
            <MenuUser />
          </div>
        </Header>
        <ContentWrapper />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
