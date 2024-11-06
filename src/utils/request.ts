import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import { ResultEnum } from "@/enums/ResultEnum";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import qs from "qs";
import { ElNotification, ElMessage } from "element-plus";

// Create axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params), // Use qs for query parameter serialization
});

// Request interceptor
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = token; // Add token to header if available
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response data and errors
const handleResponseData = (response: AxiosResponse) => {
  const { code, data, msg, status } = response.data;

  // If response is a binary type, return the response object as is
  if (
    response.config.responseType === "blob" ||
    response.config.responseType === "arraybuffer"
  ) {
    return response;
  }

  // Handle success and token invalid errors
  if (status.code === ResultEnum.SUCCESS) {
    return data;
  }

  if (status.code === ResultEnum.TOKEN_INVALID) {
    handleTokenInvalid();
  }

  ElMessage.error(msg || "System Error");
  return Promise.reject(new Error(msg || "Error"));
};

const handleError = (error: any) => {
  // General error handler
  const { response } = error;
  if (response?.data) {
    const { code, msg } = response.data;

    if (code === ResultEnum.TOKEN_INVALID) {
      handleTokenInvalid();
    } else {
      ElMessage.error(msg || "System Error");
    }
  }
  return Promise.reject(error.message);
};

const handleTokenInvalid = () => {
  ElNotification({
    title: "Notice",
    message: "Your session has expired, please log in again.",
    type: "info",
  });
  useUserStoreHook()
    .resetToken()
    .then(() => location.reload()); // Reset token and reload the page
};

// Response interceptor
service.interceptors.response.use(handleResponseData, handleError);

// Export axios instance
export default service;
