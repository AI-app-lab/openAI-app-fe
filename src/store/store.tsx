import { configureStore } from "@reduxjs/toolkit";
import chatApiSlice from "./chatApiSlice";
import configSlice from "./configSlice";
import userSlice from "./userSlice";
import cpntsSlice from "./cpntsSlice";
import aiDrawApiSlice from "./aiDrawApiSlice";
import aiTranslateApiSlice from "./aiTranslateApiSlice";
import wechatPaySlice from "./wechatPaySlice";
// import chatOralSlice from "./chatOralSlice";
export default configureStore({
  reducer: {
    chatApi: chatApiSlice,
    config: configSlice,
    user: userSlice,
    cpnts: cpntsSlice,
    aiDraw: aiDrawApiSlice,
    aiTranslate: aiTranslateApiSlice,
    wechatPay: wechatPaySlice,
  },
});
// oral: chatOralSlice,
