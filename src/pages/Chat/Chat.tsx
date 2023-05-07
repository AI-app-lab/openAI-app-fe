import React, { useState } from "react";
import styles from "./index.module.scss";
import SideBar from "./components/SideBar";
import ChatBox from "./components/ChatBox";

const Chat = () => {
  const [isChatSideBox, setIsChatSdBarOpen] = useState<boolean>(false);
  return (
    <div className={styles.box}>
      <SideBar isChatSideBox={isChatSideBox} setIsChatSdBarOpen={setIsChatSdBarOpen} />
      <ChatBox isChatSideBox={isChatSideBox} setIsChatSdBarOpen={setIsChatSdBarOpen} />
    </div>
  );
};

export default Chat;
