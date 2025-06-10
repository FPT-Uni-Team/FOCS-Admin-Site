import React from "react";
import { Layout } from "antd";
import styles from "./ContentWrapper.module.scss";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const ContentWrapper: React.FC = () => {
  return (
    <Content className={styles.contentWrapper}>
      <div className={styles.contentInner}>
        <Outlet />
      </div>
    </Content>
  );
};

export default ContentWrapper;
