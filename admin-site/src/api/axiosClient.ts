import axios from "axios";

const fake_token: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkxM2ExYjgzLWNjOTQtNDI1Yi04NTQyLTBiOWMzMDQxYTExOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InBodWNAYWRtaW4uY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3NDk5MDk0NTAsImlzcyI6IlRpcFRyaXBJc3N1ZXIiLCJhdWQiOiJUaXBUcmlwQXVkaWVuY2UifQ.rZMyg8MGzlMB1u8eegFvMeiwUra0khXr_3lZsilhFC4";

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
