import React, { useContext, useEffect, useState } from "react";
import styles from "../index.module.scss";
import ChatWindow from "./ChatWindow";
import InputRange from "./InputRange";
import ChatBoxHeader from "./ChatBoxHeader";
import { ChatTypeContext } from "../Chat";
import { useCurrCon, useCurrConId } from "../../../hooks/useCon";

type Props = {
  isChatSideBox: boolean;
  setIsChatSdBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const audioShouldPlay = new Audio();
const ChatBox = ({ isChatSideBox, setIsChatSdBarOpen }: Props) => {
  const type = useContext(ChatTypeContext);
  const currCon = useCurrCon();
  const currConId = useCurrConId();
  const [urlPlaying, setUrlPlaying] = useState("");
  const handlePause = () => {
    audioShouldPlay.pause();
    setUrlPlaying("");
  };
  return (
    <div className={styles.chatBox}>
      <ChatBoxHeader isChatSideBox={isChatSideBox} setIsChatSdBarOpen={setIsChatSdBarOpen} />
      <ChatWindow urlPlaying={urlPlaying} setUrlPlaying={setUrlPlaying} audioShouldPlay={audioShouldPlay} audioBlobList={currCon.audioArr} messageList={currCon.conList} conId={currConId} />
      <InputRange urlPlaying={urlPlaying} handlePause={handlePause} />
    </div>
  );
};

export default ChatBox;
