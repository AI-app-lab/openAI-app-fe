import React, { useContext, useEffect, useState } from "react";
import styles from "../index.module.scss";
import ChatWindow from "./ChatWindow";
import InputRange from "./InputRange";
import ChatBoxHeader from "./ChatBoxHeader";
import { ChatTypeContext } from "../Chat";
import { useCurrCon, useCurrConId } from "../../../hooks/useCon";
import { useDispatch } from "react-redux";
import { clearAudioPlaying } from "../../../store/chatApiSlice";

type Props = {
  isChatSideBox: boolean;
  setIsChatSdBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const currAudioSliceShouldPlay = new Audio();

const ChatBox = ({ isChatSideBox, setIsChatSdBarOpen }: Props) => {
  const type = useContext(ChatTypeContext);
  const dispatch = useDispatch();
  const currCon = useCurrCon();
  const currConId = useCurrConId();
  const [urlPlaying, setUrlPlaying] = useState("");
  const handleAudioStop = (_audio?: HTMLAudioElement) => {
    _audio && _audio.pause();
    currAudioSliceShouldPlay.pause();
    dispatch(clearAudioPlaying());
    setUrlPlaying("");
  };
  return (
    <div className={styles.chatBox}>
      <ChatBoxHeader isChatSideBox={isChatSideBox} setIsChatSdBarOpen={setIsChatSdBarOpen} />
      <ChatWindow handleAudioStop={handleAudioStop} urlPlaying={urlPlaying} setUrlPlaying={setUrlPlaying} currAudioSliceShouldPlay={currAudioSliceShouldPlay} messageList={currCon.conList} conId={currConId} />
      <InputRange urlPlaying={urlPlaying} handlePause={handleAudioStop} />
    </div>
  );
};

export default ChatBox;
