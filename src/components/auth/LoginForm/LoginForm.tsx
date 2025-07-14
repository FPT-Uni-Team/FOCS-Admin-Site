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
      <Card title="Welcome Back" className={styles.loginCard}>
        <Form layout="vertical" onFinish={onSubmit} form={form}>
          <div className={styles.formFields}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email address!" },
              ]}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                  message:
                    "Password must be at least 6 characters long, and include at least 1 lowercase letter, 1 uppercase letter, and 1 digit.",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
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
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
