import axios from "axios";

const fake_token: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkxM2ExYjgzLWNjOTQtNDI1Yi04NTQyLTBiOWMzMDQxYTExOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InBodWNAYWRtaW4uY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJTdG9yZUlkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwiZXhwIjoxNzQ5NzU2NjMxLCJpc3MiOiJUaXBUcmlwSXNzdWVyIiwiYXVkIjoiVGlwVHJpcEF1ZGllbmNlIn0.phLuO_LqRr5SW08wdUbylN5Mx9rNOaWIhwnylNp64io";

const BASE_URL: string = "/api";
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${fake_token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosClient;
