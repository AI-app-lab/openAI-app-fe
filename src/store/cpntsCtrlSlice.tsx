import { createSlice } from "@reduxjs/toolkit";

export interface ModalStatus {
  signUp: boolean;
  login: boolean;
}
export interface CpntsCtrlInitState {
  currentModal: "close" | "login" | "signUp";
  modalStatus: ModalStatus;
}

export interface CpntsCtrlState {
  cpntsCtrl: CpntsCtrlInitState;
}

const initialState: CpntsCtrlInitState = {
  currentModal: "close", //
  modalStatus: {
    signUp: false,
    login: false,
  },
};
export const cpntsCtrlSlice = createSlice({
  name: "cpntsCtrl",
  initialState: initialState,
  reducers: {
    activateSignUpModel: (state, action) => {},
    openModal: (state, action) => {
      state.currentModal = action.payload;
    },
  },
});
export const { openModal, activateSignUpModel } = cpntsCtrlSlice.actions;
export default cpntsCtrlSlice.reducer;
