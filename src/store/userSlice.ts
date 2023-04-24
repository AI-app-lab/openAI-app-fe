import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
  password: string;
}

export interface UserInfo {
  token: string;
  email: string;
  authority: string;
  username: string;
  id: number;
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
  const response = axios.post("http://43.139.143.5:9999/user/login/email", { email, password }).catch((err) => {
    return rejectWithValue(err.response.status);
  });
  return response;
});

export interface Status {
  status: "idle" | "loading" | "failed";
  sCode: any;
  message: any;
}
export interface UserInitialState {
  userInfo: UserInfo | null;
  vCode: number | null;
  nextTryTime: number;
  status: Status;
  currentModal: "close" | "login" | "signUp";
}
export interface UserState {
  user: { userInfo: UserInfo | null; vCode: number | null; nextTryTime: number; status: Status; currentModal: "close" | "login" | "signUp" };
}
const initialState: UserInitialState = {
  userInfo: null,
  vCode: null,
  nextTryTime: 0,
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
  },
  extraReducers: (builder) => {
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      state.nextTryTime = new Date().getTime() + 60 * 1000;
      state.status = { status: "idle", message: "发送成功", sCode: null };
    });
    builder.addCase(verifyEmail.pending, (state, action) => {
      state.nextTryTime = 0;
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
      state.userInfo = action.payload.data;
      state.status = { status: "idle", message: action.payload.data, sCode: action.payload.status };
    });
    builder.addCase(login.pending, (state, action) => {
      state.status = { status: "loading", message: null, sCode: null };
    });
    builder.addCase(login.rejected, (state, action) => {
      switch (action.payload) {
        case 400:
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
export const { openModal, destroyStatus } = userSlice.actions;
export default userSlice.reducer;
