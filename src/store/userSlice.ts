import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface UserInitState {
  token: string;
}

export interface UserState {
  config: UserInitState;
}
export interface VerifyEmailDto {
  email: string;
}
export interface SignUpDto {
  email: string;
  password: string;
  verificationCode: number;
}

const initialState: UserInitState = {
  token: "",
};

export const verifyEmail = createAsyncThunk("users/verifyEmail", async ({ email }: VerifyEmailDto, { dispatch }) => {
  const resp = axios.post;
});

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    handleLogin: (state, action) => {},
  },
});
export const {} = userSlice.actions;
export default userSlice.reducer;
