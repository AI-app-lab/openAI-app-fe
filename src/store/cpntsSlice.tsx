import { createSlice } from "@reduxjs/toolkit";

export interface CpntsSliceState {
  isSideBarOpen: boolean;
  sideBarType: "fullscreen" | "default";
}

export interface CpntsState {
  cpnts: CpntsSliceState;
}

const initialState: CpntsSliceState = {
  isSideBarOpen: true,
  sideBarType: "default",
};
export const cpntsSlice = createSlice({
  name: "cpnts",
  initialState: initialState,
  reducers: {
    setIsSideBarOpen(state, action) {
      console.log(action.payload);

      state.isSideBarOpen = action.payload;
    },
    setSideBarType(state, action: { payload: "fullscreen" | "default" }) {
      state.sideBarType = action.payload;
    },
  },
});
export const { setIsSideBarOpen, setSideBarType } = cpntsSlice.actions;
export default cpntsSlice.reducer;
