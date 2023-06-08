import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { enqueueSnackbar } from "notistack";

import { err, success } from "../utils/alert";
import { apiBaseUrl } from "../config/axiosConfig";

type EmailVerifyType = "signup" | "resetPwd";
export interface UserEmailVerifyDto {
  email: string;
  type?: EmailVerifyType;
}

export interface UserPostDto {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
}
export interface PwdResetDto {
  email: string;
  newPassword: string;
  verificationCode: string;
}
export interface UserLoginPostDto {
  email: string;
  password?: string;
  verificationCode?: string;
}

export interface UserInfo {
  token: string;
  email: string;
  authority: string;
  username: string;
  id: number;
  timeSet: string;
  expireTime1: string; //AI助理
  expireTime2: string; //口语
  expireTime3: string; //图片
  expireTime4: string; //翻译
}

export interface UserState {
  user: UserInitialState;
}
export const resetPwd = createAsyncThunk("users/resetPwd", async (pwdResetDto: PwdResetDto, { dispatch, rejectWithValue }) => {
  const url = apiBaseUrl + ":9999/user/set/password";
  try {
    const response = await axios.post(url, pwdResetDto);

    return { status: response.status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});

export const verifyEmail = createAsyncThunk("users/verifyEmail", async ({ type = "signup", ...userEmailVerifyDto }: UserEmailVerifyDto, { dispatch, rejectWithValue }) => {
  const url = {
    signup: apiBaseUrl + ":9999/signup/verification",
    resetPwd: apiBaseUrl + ":9999/user/reset/password",
  };
  try {
    const response = await axios.post(url[type], userEmailVerifyDto);

    return { data: type, status: response.status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});

export const signUp = createAsyncThunk("users/signUp", async ({ username, email, password, verificationCode }: UserPostDto, { rejectWithValue }) => {
  try {
    const response = await axios.post(apiBaseUrl + ":9999/signup/registration", { username, email, password, verificationCode });

    const { data, status } = response as AxiosResponse<UserInfo>;
    return { data, status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});

export const login = createAsyncThunk("users/login", async ({ email, password }: UserLoginPostDto, { rejectWithValue }) => {
  try {
    const response = await axios.post(apiBaseUrl + ":9999/user/login/email", { email, password });
    const { data, status } = response as AxiosResponse<UserInfo>;

    return { data, status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;

      return rejectWithValue(errCode);
    }
  }
});

export const getLoginVCode = createAsyncThunk("users/getLoginVCode", async (email: string, { rejectWithValue }) => {
  try {
    const response = await axios.post(apiBaseUrl + ":9999/user/login/email/sendcode", { email });
    const { data } = response as AxiosResponse<any>;
    return { data };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;

      return rejectWithValue(errCode);
    }
  }
});
export const loginWithVCode = createAsyncThunk("users/loginWithVCode", async (vCodeLoginDto: { email: string; verificationCode: string }, { rejectWithValue }) => {
  try {
    const response = await axios.post(apiBaseUrl + ":9999/user/login/email/verifycode", vCodeLoginDto);
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
export type EmailSendType = "signup" | "resetPwd" | "login";
export type NextTryTime = Record<EmailSendType, number>;
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
    login: 0,
    signup: 0,
    resetPwd: 0,
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
    destroyStatus: (state) => {
      state.status = { status: "idle", sCode: null, message: null };
    },
    saveUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;

      localStorage.clear();
    },
  },

  extraReducers: (builder) => {
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

    builder.addCase(loginWithVCode.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.userInfo = action.payload.data;
      localStorage.setItem("userInfo", JSON.stringify(action.payload.data));
      state.status = { status: "idle", message: "登录成功", sCode: action.payload?.status };
      success("登录成功");
    });
    builder.addCase(loginWithVCode.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(loginWithVCode.rejected, (state, action) => {
      let errMsg = "";
      switch (action.payload) {
        case 404:
          errMsg = "邮箱不存在";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
          break;
        case 500:
          errMsg = "服务器暂时无法提供服务，请稍后再试";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
          break;
        case 401:
          errMsg = "验证码无效";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
          break;
        case 400:
          errMsg = "邮箱格式有误";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
          break;
        default:
          errMsg = "网络错误";
          state.status = { status: "idle", message: errMsg, sCode: action.error.code };
      }
      err(errMsg);
    });
    builder.addCase(getLoginVCode.fulfilled, (state, action) => {
      state.nextTryTime["login"] = new Date().getTime() + 60 * 1000;

      state.status = { status: "idle", message: "发送成功", sCode: 200 };
      success("发送成功");
    });
    builder.addCase(getLoginVCode.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(getLoginVCode.rejected, (state, action) => {
      let errMsg = "";
      switch (action.payload) {
        case 404:
          errMsg = "邮箱不存在";
          break;
        case 500:
          errMsg = "服务器暂时无法提供服务，请稍后再试";
          break;
        case 429:
          errMsg = "发送太频繁！";
          break;
        case 400:
          errMsg = "邮箱或密码格式有误";
          break;
        default:
          errMsg = "网络错误！";
      }
      state.status = { status: "idle", message: errMsg, sCode: action.error.code };
    });

    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      const type = action.payload?.data;
      console.log(type);

      type && (state.nextTryTime[type] = new Date().getTime() + 60 * 1000);
      state.status = { status: "idle", message: "发送成功", sCode: null };
      success("发送成功");
    });
    builder.addCase(verifyEmail.pending, (state, action) => {
      state.nextTryTime["signup"] = 0;
      state.nextTryTime["resetPwd"] = 0;

      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      console.log(action.payload);

      switch (action.payload) {
        case 409:
          err("邮箱已存在");
          state.status = { status: "idle", message: "邮箱已存在", sCode: action.error.code };
          break;
        case 429:
          err("发送太频繁");
          state.status = { status: "idle", message: "发送太频繁", sCode: action.error.code };
        case 400:
          err("发送失败");
          state.status = { status: "idle", message: "发送失败", sCode: action.error.code };
          break;
        case 500:
          err("服务器错误");
          state.status = { status: "idle", message: "服务器错误", sCode: action.error.code };
          break;
        default:
          err("网络错误");
          state.status = { status: "idle", message: "网络错误", sCode: action.error.code };
          break;
      }
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.userInfo = action.payload.data;
      localStorage.setItem("userInfo", JSON.stringify(action.payload.data));
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
      state.userInfo = action.payload?.data as UserInfo;
      localStorage.setItem("userInfo", JSON.stringify(action.payload?.data));
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
      enqueueSnackbar(errMsg, {
        variant: "error",
      });
    });
  },
});
export const { openModal, destroyStatus, saveUserInfo, logout } = userSlice.actions;
export default userSlice.reducer;
