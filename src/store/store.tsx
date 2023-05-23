import { configureStore } from "@reduxjs/toolkit";
import chatApiSlice from "./chatApiSlice";
import configSlice from "./configSlice";
import userSlice from "./userSlice";
import cpntsSlice from "./cpntsSlice";
// import chatOralSlice from "./chatOralSlice";
export default configureStore({
  reducer: {
    chatApi: chatApiSlice,
    config: configSlice,
    user: userSlice,
    cpnts: cpntsSlice,
  },
});
// oral: chatOralSlice,
