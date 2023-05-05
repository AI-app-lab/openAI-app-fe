import React, { LegacyRef, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import SideBar from "./components/SideBar";
import ChatBox from "./components/ChatBox";
import { useSelector, useDispatch } from "react-redux";
const Chat = () => {
  return (
    <div className={styles.box}>
      <SideBar />
      <ChatBox />
    </div>
  );
};

export default Chat;
