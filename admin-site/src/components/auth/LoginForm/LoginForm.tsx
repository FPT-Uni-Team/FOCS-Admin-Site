import React from "react";
import { Form, Input, Button, Alert, Card, type FormInstance } from "antd";
import styles from "./LoginForm.module.scss";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

interface LoginFormProps {
  loading: boolean;
  error: string | null;
  form?: FormInstance;
  onSubmit: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loading,
  error,
  onSubmit,
  form,
}) => {
  return (
    <div className={styles.loginFormContainer}>
      <Card title="Chào mừng trở lại" className={styles.loginCard}>
        <Form layout="vertical" onFinish={onSubmit} form={form}>
          <div className={styles.formFields}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={loading}
              className={styles.loginButton}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
