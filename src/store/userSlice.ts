import { Action, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError, AxiosResponse, isAxiosError } from "axios";

export interface UserEmailVerifyDto {
  email: string;
}

export interface UserPostDto {
  username: string;
  email: string;
  password: string;
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
}

export interface UserState {
  user: UserInitialState;
}

export const verifyEmail = createAsyncThunk("users/verifyEmail", async (userEmailVerifyDto: UserEmailVerifyDto, { dispatch, rejectWithValue }) => {
  let errCode = "";
  // request to the server to verify the email
  const response = axios.post("http://43.139.143.5:9999/signup/verification", userEmailVerifyDto).catch((err) => {
    errCode = err.response.status;
    return rejectWithValue(errCode);
  });
  return response;
});

export const signUp = createAsyncThunk("users/signUp", async ({ username, email, password, verificationCode }: UserPostDto, { dispatch }) => {
  const response = await axios.post("http://43.139.143.5:9999/signup/registration", { username, email, password, verificationCode });
  console.log(response.data);
  dispatch(login(response.data));

  return response;
});

export const login = createAsyncThunk("users/login", async ({ email, password }: UserLoginPostDto, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://43.139.143.5:9999/user/login/email", { email, password });
    const { data, status } = response as AxiosResponse<UserInfo>;
    console.log(data);
    return { data, status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      console.log(errCode);
      return rejectWithValue(errCode);
    }
  }
});

export const getLoginVCode = createAsyncThunk("users/getLoginVCode", async (email: string, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://43.139.143.5:9999/user/login/email/sendcode", { email });
    const { data } = response as AxiosResponse<any>;
    return { data };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      console.log(errCode);
      return rejectWithValue(errCode);
    }
  }
});
export const loginWithVCode = createAsyncThunk("users/loginWithVCode", async (vCodeLoginDto: { email: string; verificationCode: string }, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://43.139.143.5:9999/user/login/email/verifycode", vCodeLoginDto);
    const { data, status } = response as AxiosResponse<{
      data: UserInfo;
      status: number;
    }>;
    return { data, status };
  } catch (err) {
    if (isAxiosError(err)) {
      const errCode = err.response?.status;
      return rejectWithValue(errCode);
    }
  }
});
export interface Status {
  status: "idle" | "loading" | "failed";
  sCode: any;
  message: any;
}
export type NextTryTime = Record<"login" | "signup", number>;
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
      localStorage.removeItem("userInfo");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginWithVCode.fulfilled, (state, action) => {
      const userInfo = action.payload?.data;
      console.log(userInfo);
      console.log(123);

      userInfo && (state.userInfo = userInfo.data) && localStorage.setItem("userInfo", JSON.stringify(userInfo));
      state.currentModal = "close";

      state.status = { status: "idle", message: "登录成功", sCode: action.payload?.status };
    });
    builder.addCase(loginWithVCode.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(loginWithVCode.rejected, (state, action) => {
      switch (action.payload) {
        case 404:
          state.status = { status: "failed", message: "邮箱不存在", sCode: action.error.code };
          break;
        case 500:
          state.status = { status: "failed", message: "未知错误", sCode: action.error.code };
          break;
        case 401:
          state.status = { status: "failed", message: "验证码无效", sCode: action.error.code };
          break;
        case 400:
          state.status = { status: "failed", message: "邮箱格式有误", sCode: action.error.code };
          break;
        default:
          state.status = { status: "failed", message: "网络错误", sCode: action.error.code };
      }
    });
    builder.addCase(getLoginVCode.fulfilled, (state, action) => {
      state.nextTryTime["login"] = new Date().getTime() + 60 * 1000;

      state.status = { status: "idle", message: "发送成功", sCode: 200 };
    });
    builder.addCase(getLoginVCode.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(getLoginVCode.rejected, (state, action) => {
      console.log(222222222222221);

      switch (action.payload) {
        case 404:
          state.status = { status: "failed", message: "邮箱不存在", sCode: action.error.code };
          console.log("邮箱不存在");
          break;
        case 500:
          state.status = { status: "failed", message: "未知错误！", sCode: action.error.code };
          console.log("未知错误");
          break;
        case 429:
          state.status = { status: "failed", message: "发送太频繁！", sCode: action.error.code };
          break;
        case 400:
          state.status = { status: "failed", message: "邮箱或密码格式有误！", sCode: action.error.code };
          console.log("邮箱或密码格式有误");
          break;
        default:
          state.status = { status: "failed", message: "网络错误！", sCode: action.error.code };
      }
    });

    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      state.nextTryTime["signup"] = new Date().getTime() + 60 * 1000;
      state.status = { status: "idle", message: "发送成功", sCode: null };
    });
    builder.addCase(verifyEmail.pending, (state, action) => {
      state.nextTryTime["signup"] = 0;
      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      console.log(action.payload);

      switch (action.payload) {
        case 409:
          state.status = { status: "failed", message: "邮箱已存在", sCode: action.error.code };
          break;
        case 400:
          state.status = { status: "failed", message: "发送失败", sCode: action.error.code };
          break;
        case 500:
          state.status = { status: "failed", message: "服务器错误", sCode: action.error.code };
        default:
          state.status = { status: "failed", message: "网络错误", sCode: action.error.code };
      }
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.status = { status: "idle", message: "注册成功", sCode: action.payload.status };
      console.log("注册成功");
    });
    builder.addCase(signUp.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
      console.log(action.payload);
    });
    builder.addCase(signUp.rejected, (state, action) => {
      switch (action.error.code) {
        case "ERR_BAD_REQUEST":
          state.status = { status: "failed", message: "验证未成功，请重试！", sCode: action.error.code };
          break;
        default:
          state.status = { status: "failed", message: "未知错误！", sCode: action.error.code };
      }
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.currentModal = "close";
      state.userInfo = action.payload?.data as UserInfo;
      console.log(action.payload);
      localStorage.setItem("userInfo", JSON.stringify(action.payload?.data));
      state.status = { status: "idle", message: action.payload, sCode: action.payload?.status };
    });
    builder.addCase(login.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(login.rejected, (state, action) => {
      switch (action.payload) {
        case 400:
          state.status = { status: "failed", message: "用户名或密码错误！", sCode: action.error.code };
          break;
        case 401:
          state.status = { status: "failed", message: "用户名或密码错误！", sCode: action.error.code };
          break;
        case 500:
          state.status = { status: "failed", message: "未知错误！", sCode: action.error.code };
          break;
        default:
          state.status = { status: "failed", message: "网络错误！", sCode: action.error.code };
      }
    });
  },
});
export const { openModal, destroyStatus, saveUserInfo, logout } = userSlice.actions;
export default userSlice.reducer;
