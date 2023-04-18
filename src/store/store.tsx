import { configureStore } from "@reduxjs/toolkit";
import chatApiSlice from "./chatApiSlice";
import configSlice from "./configSlice";
import userSlice from "./userSlice";
import cpntsCtrlSlice from "./cpntsCtrlSlice";

export default configureStore({
  reducer: {
    chatApi: chatApiSlice,
    config: configSlice,
    user: userSlice,
    cpntsCtrl: cpntsCtrlSlice,
  },
});
