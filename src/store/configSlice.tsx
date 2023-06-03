import { createSlice } from "@reduxjs/toolkit";

export interface ConfigInitState {
  location: "cn";
  theme: "light" | "dark";
}

export interface ConfigState {
  config: ConfigInitState;
}

const initialState: ConfigInitState = {
  location: "cn",
  theme: "light",
};
export const configSlice = createSlice({
  name: "config",
  initialState: initialState,
  reducers: {
    changeTheme(state, action) {
      localStorage.setItem("theme", action.payload);
      state.theme = action.payload;
    },
    getThemeFromLocal(state) {
      const theme = localStorage.getItem("theme");
      theme && (state.theme = theme as "light" | "dark");
    },
  },
});
export const { changeTheme, getThemeFromLocal } = configSlice.actions;
export default configSlice.reducer;
