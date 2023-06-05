import React, { useEffect, useState, createContext } from "react";
import styles from "./index.module.scss";
import SideBar from "./components/SideBar";
import ChatBox from "./components/ChatBox";

import { useDispatch } from "react-redux";
import { setIsSideBarOpen } from "../../store/cpntsSlice";
import { getRecentConversations, setCurrChatType } from "../../store/chatApiSlice";

type Props = {
  type?: "text" | "oral";
};
export const ChatTypeContext = createContext("text");
const Chat = ({ type = "text" }: Props) => {
  const [isChatSideBox, setIsChatSdBarOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsSideBarOpen(false));
    type == "oral" ? dispatch(setCurrChatType("oral")) : dispatch(setCurrChatType("text"));
    dispatch(getRecentConversations());
  });
  return (
    <ChatTypeContext.Provider value={type}>
      <div className={styles.box}>
        <SideBar type={type} isChatSideBox={isChatSideBox} setIsChatSdBarOpen={setIsChatSdBarOpen} />
        <ChatBox isChatSideBox={isChatSideBox} setIsChatSdBarOpen={setIsChatSdBarOpen} />
      </div>
    </ChatTypeContext.Provider>
  );
};

export default Chat;
