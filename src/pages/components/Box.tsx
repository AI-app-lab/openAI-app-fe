import React, { LegacyRef, useEffect, useRef } from "react";
import styles from "../index.module.scss";
import SideBar from "./SideBar";
import ChatBox from "./ChatBox";
import { useSelector, useDispatch } from "react-redux";
const Box = () => {
  return (
    <div className={styles.box}>
      <SideBar />
      <ChatBox />
    </div>
  );
};

export default Box;
