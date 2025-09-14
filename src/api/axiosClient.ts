import axios from "axios";
import { store } from "../store/store";
import { callRefreshTokenApi } from "../services/authService";
import { logout, setTokens } from "../store/slices/auth/authSlice";

const BASE_URL: string = "/api";
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    storeId: sessionStorage.getItem("storeId"),
  },
  timeout: 10000,
  withCredentials: true,
});

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}
let failedQueue: QueueItem[] = [];
let isRefreshing = false;

const processQueue = (
  error: Error | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom: QueueItem) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const storeId = sessionStorage.getItem("storeId");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (storeId) {
      config.headers.storeId = storeId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      isRefreshing = true;
      try {
        const response = await callRefreshTokenApi();
        const newAccessToken = response.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          store.dispatch(setTokens({ accessToken: newAccessToken }));
        }
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        processQueue(refreshError as Error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
