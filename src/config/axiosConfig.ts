import axios from "axios";
import { lsGet } from "../utils/localstorage";
import webConfig from "../global.config";
//配置中心
const axiosInstance = axios.create({
  timeout: 30 * 1000,
  responseType: "json",
  headers: {},
});

export const apiBaseUrl = "https://kitzone.cn";
axiosInstance.interceptors.request.use(
  (config) => {
    const token = lsGet("userInfo").token;
    const url = config.url || "";
    //不需要token的
    const whiteList = webConfig.whiteListApi;
    //如果有token并且不在白名单里面
    if (token && whiteList.indexOf(url) == -1) {
      config.headers.token = `${token}`;
    }

    //
    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (res) => {
    const status = res.data.code;
    if (status === 200) {
      return res;
    }

    return res;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
