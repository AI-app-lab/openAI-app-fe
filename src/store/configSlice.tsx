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
  theme: "dark",
};
export const configSlice = createSlice({
  name: "config",
  initialState: initialState,
  reducers: {
    changeTheme(state, action) {
      localStorage.setItem("theme", action.payload);
      state.theme = action.payload;
    },
    
  },
});
export const { changeTheme } = configSlice.actions;
export default configSlice.reducer;
