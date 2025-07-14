import { useDispatch } from "react-redux";
import { logout } from "../store/slices/auth/authSlice";
import { useAppSelector } from "./redux";

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );
  const handleLogout = () => {
    dispatch(logout());
  };

  return { isAuthenticated, loading, error, logout: handleLogout };
};

export default useAuth;
