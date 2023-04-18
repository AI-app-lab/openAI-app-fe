import { createSlice } from "@reduxjs/toolkit";

export interface configInitState {
  location: "cn";
}

export interface ConfigState {
  config: configInitState;
}

const initialState: configInitState = {
  location: "cn",
};
export const configSlice = createSlice({
  name: "config",
  initialState: initialState,
  reducers: {},
});
export const {} = configSlice.actions;
export default configSlice.reducer;
