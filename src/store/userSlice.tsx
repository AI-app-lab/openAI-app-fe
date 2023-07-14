import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { enqueueSnackbar } from "notistack";

import { err, info, success } from "../utils/alert";
import axiosInstance, { apiBaseUrl } from "../config/axiosConfig";
import { lsSet } from "../utils/localstorage";
import { encodedPhoneNum, sha256 } from "../utils/encode";

export type VerifyType = "SING_UP" | "RESET_PWD";
export interface UserPhoneVerifyDto {
  phoneNumber: string;
  reCapToken: string;
}

export interface UserPostDto {
  phoneNumber: string;
  username: string;
  password: string;
  verificationCode: string;
  inviteCode?: string;
}

export interface PwdResetDto {
  phoneNumber: string;
  reCapToken: string;
  password: string;
  verificationCode: string;
}
export interface UserLoginPostDto {
  reCapToken: string;
  phoneNumber: string;
  password: string;
}
export interface Services {
  expiredTime1: string; //AI助理
  expiredTime2: string; //口语
  expiredTime3: string; //图片
  expiredTime4: string; //翻译
}
export interface UserInfo extends Services {
  telephone: string;
  token: string;
  phoneNumber: string;
  authority: string;
  username: string;
  inviteCode: string;
}
export interface OrderCheckResponseDto extends Services {
  token: string;
  message: string;
}

export interface UserState {
  user: UserInitialState;
}

const orderCheckUrl = import.meta.env.VITE_ORDER_CHECK_URL;
const pwdResetUrl = import.meta.env.VITE_PWD_RESET_URL;
const pwdResetVerificationUrl = import.meta.env.VITE_PWD_RESET_VERIFICATION_URL;
const signUpVerificationUrl = import.meta.env.VITE_SIGN_UP_VERIFICATION_URL;
const signUpUrl = import.meta.env.VITE_SIGN_UP_URL;
const phoneNumberLoginUrl = import.meta.env.VITE_PHONE_NUMBER_LOGIN_URL;
const nameChangeUrl = import.meta.env.VITE_NAME_CHANGE_URL;
export const checkOrder = createAsyncThunk("wechatPay/check", async (_, { rejectWithValue }) => {
  const url = apiBaseUrl + orderCheckUrl;
  try {
    const response: AxiosResponse<OrderCheckResponseDto | unknown> = await axiosInstance.get(url);

    return { status: response.status, data: response.data };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});
export const resetPwd = createAsyncThunk("users/resetPwd", async (pwdResetDto: PwdResetDto, { dispatch, rejectWithValue }) => {
  const url = apiBaseUrl + pwdResetUrl;
  try {
    const _pwdResetDto = { ...pwdResetDto, password: await sha256(pwdResetDto.password) };

    const response = await axios.put(url, _pwdResetDto);

    return { status: response.status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});

export const verifyPhoneNum = createAsyncThunk(
  "users/verifyPhoneNum",
  async (
    {
      type = "SING_UP",
      ...userPhoneVerifyDto
    }: {
      type: VerifyType;
      phoneNumber: string;
      reCapToken: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    const url: Record<VerifyType, string> = {
      SING_UP: apiBaseUrl + signUpVerificationUrl,
      RESET_PWD: apiBaseUrl + pwdResetVerificationUrl,
    };
    try {
      const response = await axios.get(url[type], { params: userPhoneVerifyDto });
      console.log(response.data);

      info(response.data);
      return { data: type, status: response.status };
    } catch (err) {
      if (isAxiosError(err)) {
        const errCode = err.response?.status;
        return rejectWithValue(errCode);
      }
    }
  }
);

export const signUp = createAsyncThunk("users/signUp", async (userPostDto: UserPostDto, { rejectWithValue }) => {
  try {
    const _userPostDto = { ...userPostDto, password: await sha256(userPostDto.password) };
    const response: AxiosResponse<UserInfo, UserPostDto> = await axios.post(apiBaseUrl + signUpUrl, _userPostDto);

    const { data, status } = response;
    return { data, status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});
export const changeName = createAsyncThunk("users/changeName", async (username: string, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<UserInfo, UserPostDto> = await axiosInstance.put(apiBaseUrl + nameChangeUrl, { username });

    const { data, status } = response;
    return { data, status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});
export const login = createAsyncThunk("users/login", async (userLoginPostDto: UserLoginPostDto, { rejectWithValue }) => {
  try {
    const _userLoginPostDto = { ...userLoginPostDto, password: await sha256(userLoginPostDto.password) };
    const response = await axios.post(apiBaseUrl + phoneNumberLoginUrl, _userLoginPostDto);
    const { data, status } = response as AxiosResponse<UserInfo>;

    return { data, status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;

      return rejectWithValue(errCode);
    }
  }
});

export interface Status {
  status: "idle" | "loading";
  sCode: any;
  message: any;
}
export type PhoneVRange = VerifyType | "LOGIN";
export type NextTryTime = Record<PhoneVRange, number>;
export interface UserInitialState {
  userInfo: UserInfo | null;
  vCode: number | null;
  nextTryTime: NextTryTime;
  status: Status;
  currentModal: "close" | "login" | "signUp";
}
export interface UserState {
  user: { userInfo: UserInfo | null; vCode: number | null; nextTryTime: NextTryTime; status: Status; currentModal: "close" | "login" | "signUp" };
}

const initialState: UserInitialState = {
  userInfo: null,
  vCode: null,
  nextTryTime: {
    LOGIN: 0,
    SING_UP: 0,
    RESET_PWD: 0,
  },
  status: { status: "idle", sCode: null, message: null },
  currentModal: "close",
};
export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    openModal: (state, action) => {
      state.currentModal = action.payload;
    },
    destroyStatus: (
      state,
      action: {
        payload: "idle" | "loading";
      }
    ) => {
      state.status = { status: "idle", sCode: null, message: null };
    },
    saveUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    setAuthLoading: (
      state,
      action: {
        payload: "idle" | "loading";
      }
    ) => {
      state.status = { status: action.payload, sCode: null, message: null };
    },
    logout: (state) => {
      state.userInfo = null;

      localStorage.clear();
    },
    clearStatus: (state) => {
      state.status = { status: "idle", sCode: "", message: "" };
    },
  },

  extraReducers: (builder) => {
    builder.addCase(checkOrder.fulfilled, (state, action) => {
      if (!action.payload) return;
      console.log(action.payload);

      switch (action.payload.status) {
        case 200:
          const { expiredTime1, expiredTime2, expiredTime3, expiredTime4, token } = action.payload.data as OrderCheckResponseDto;
          state.userInfo = { ...state.userInfo, expiredTime1, expiredTime2, expiredTime3, expiredTime4, token } as UserInfo;
          lsSet("userInfo", state.userInfo);
          success("状态已更新");
          state.status = { status: "idle", message: "状态已更新", sCode: action.payload.status };
          break;
      }
    });
    builder.addCase(checkOrder.rejected, (state, action) => {
      console.log(action.payload);

      switch (action.payload) {
        case 401:
          err("登录失效，请重新登录");
          break;
        case 429:
          err("请求太频繁");
          break;
        case 500:
          err("服务器错误");
          break;
        case 304:
          err("暂无变化");
          break;
        default:
          err("网络错误");
      }
    });

    builder.addCase(resetPwd.fulfilled, (state, action) => {
      state.status = { status: "idle", message: "重置成功", sCode: action.payload?.status };
      success("重置成功");
    });
    builder.addCase(resetPwd.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(resetPwd.rejected, (state, action) => {
      switch (action.payload) {
        case 401:
          err("验证码无效");
          state.status = { status: "idle", message: "验证码无效", sCode: action.error.code };
          break;
        case 404:
          err("邮箱不存在");
          state.status = { status: "idle", message: "邮箱不存在", sCode: action.error.code };
          break;
        case 500:
          err("服务器暂时无法提供服务，请稍后再试");
          state.status = { status: "idle", message: "服务器暂时无法提供服务，请稍后再试", sCode: action.error.code };
          break;

        case 400:
          err("重置密码失败");
          state.status = { status: "idle", message: "重置密码失败", sCode: action.error.code };
          break;
        default:
          err("网络错误");
          state.status = { status: "idle", message: "网络错误", sCode: action.error.code };
      }
    });

    builder.addCase(verifyPhoneNum.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      const type = action.payload.data;
      type && (state.nextTryTime[type] = new Date().getTime() + 60 * 1000);
      state.status = { status: "idle", message: "发送成功", sCode: null };
      success("发送成功");
    });
    builder.addCase(verifyPhoneNum.pending, (state, action) => {
      state.nextTryTime["SING_UP"] = 0;
      state.nextTryTime["RESET_PWD"] = 0;

      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(verifyPhoneNum.rejected, (state, action) => {
      let message = "";

      switch (action.payload) {
        case 409:
          message = "手机号已存在";
          break;
        case 429:
          message = "发送太频繁";
          break;
        case 400:
          message = "发送失败";
          break;
        case 500:
          message = "服务器错误";
          break;
        default:
          message = "网络错误";
          break;
      }

      err(message);
      state.status = { status: "idle", message: message, sCode: action.error.code };
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      const userInfo = { ...state.userInfo, ...action.payload.data, phoneNumber: encodedPhoneNum(action.payload.data.phoneNumber) };
      state.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      state.status = { status: "idle", message: "注册成功", sCode: null };
      success("注册成功");
    });
    builder.addCase(signUp.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
      console.log(action.payload);
    });
    builder.addCase(signUp.rejected, (state, action) => {
      let errMsg = "";
      switch (action.payload) {
        case 400:
          errMsg = "验证未成功，请重试！";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
          break;
        default:
          errMsg = "未知错误！";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
      }
      err(errMsg);
    });
    builder.addCase(login.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      const userInfo = { ...action.payload.data, phoneNumber: encodedPhoneNum(action.payload.data.phoneNumber) };
      state.userInfo = userInfo;
      lsSet("userInfo", userInfo);
      state.status = { status: "idle", message: action.payload, sCode: action.payload?.status };
      success("登录成功");
    });
    builder.addCase(login.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(login.rejected, (state, action) => {
      let errMsg = "";
      switch (action.payload) {
        case 400:
          errMsg = "用户名或密码错误！";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
          break;
        case 401:
          errMsg = "用户名或密码错误！";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
          break;
        case 404:
          errMsg = "用户不存在！";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
          break;
        case 500:
          errMsg = "未知错误！";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
          break;
        default:
          errMsg = "网络错误！";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
      }
      err(errMsg);
    });
  },
});
export const { setAuthLoading, openModal, destroyStatus, saveUserInfo, logout, clearStatus } = userSlice.actions;
export default userSlice.reducer;
