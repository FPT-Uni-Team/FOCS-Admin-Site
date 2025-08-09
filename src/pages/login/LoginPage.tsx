import { loginRequest } from "../../store/slices/auth/authSlice";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import { useForm } from "antd/es/form/Form";
import { useAppDispatch } from "../../hooks/redux";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAuth();
  const [form] = useForm();
  const navigate = useNavigate();
  const handleSubmit = () => {
    const values = form.getFieldsValue();
    const { email, password } = values;
    dispatch(loginRequest({ email, password }));
  };
  console.log(localStorage.getItem("storeId"));
  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${localStorage.getItem("storeId")}/promotions`);
    }
  }, [isAuthenticated, navigate]);
  return (
    <LoginForm
      form={form}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginPage;
