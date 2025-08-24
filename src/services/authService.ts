import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";

export const login = async (data: { phone: string; password: string }) => {
  return axiosClient.post(endpoints.auth.login(), data);
};

export const callRefreshTokenApi = async () => {
  return axiosClient.post(
    endpoints.auth.refresh(),
    {},
    { withCredentials: true }
  );
};
