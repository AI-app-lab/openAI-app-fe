import axios from "axios";
import { lsGet } from "../utils/localstorage";

const axiosInstance = axios.create({});

export const apiBaseUrl = "https://kitzone.cn";
axiosInstance.interceptors.request.use((config) => {
  const token = lsGet("userInfo").token;
  if (token) {
    config.headers.token = `${token}`;
  }

  return config;
});

export default axiosInstance;
