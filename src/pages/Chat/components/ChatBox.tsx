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
const currAudioSliceShouldPlay = new Audio();
const ChatBox = ({ isChatSideBox, setIsChatSdBarOpen }: Props) => {
  const type = useContext(ChatTypeContext);
  const currCon = useCurrCon();
  const currConId = useCurrConId();
  const [urlPlaying, setUrlPlaying] = useState("");
  const handlePause = () => {
    currAudioSliceShouldPlay.pause();
    setUrlPlaying("");
  };
  return (
    <div className={styles.chatBox}>
      <ChatBoxHeader isChatSideBox={isChatSideBox} setIsChatSdBarOpen={setIsChatSdBarOpen} />
      <ChatWindow urlPlaying={urlPlaying} setUrlPlaying={setUrlPlaying} currAudioSliceShouldPlay={currAudioSliceShouldPlay} messageList={currCon.conList} conId={currConId} />
      <InputRange urlPlaying={urlPlaying} handlePause={handlePause} />
    </div>
  );
};

export default ChatBox;
