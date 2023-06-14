import React, { createContext, useContext, useEffect, useState } from "react";
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
type ChatBoxContextType = {
  beforeRecordingFn: () => void;
  setBeforeRecordingFn: React.Dispatch<React.SetStateAction<() => void>>;
};

export const ChatBoxContext = createContext<ChatBoxContextType>({ beforeRecordingFn: () => {}, setBeforeRecordingFn: () => {} });
const ChatBox = ({ isChatSideBox, setIsChatSdBarOpen }: Props) => {
  const type = useContext(ChatTypeContext);
  const dispatch = useDispatch();
  const currCon = useCurrCon();
  const currConId = useCurrConId();
  const [urlPlaying, setUrlPlaying] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [beforeRecordingFn, setBeforeRecordingFn] = useState<() => void>(() => {});
  const handleAudioStop = (_audio?: HTMLAudioElement) => {
    _audio && _audio.pause();
    currAudioSliceShouldPlay.pause();
    dispatch(clearAudioPlaying());
    setUrlPlaying("");
  };

  return (
    <ChatBoxContext.Provider value={{ beforeRecordingFn, setBeforeRecordingFn }}>
      <div className={styles.chatBox}>
        <ChatBoxHeader isChatSideBox={isChatSideBox} setIsChatSdBarOpen={setIsChatSdBarOpen} />
        <ChatWindow setIsPlaying={setIsPlaying} isPlaying={isPlaying} setBeforeRecordingFn={setBeforeRecordingFn} handleAudioStop={handleAudioStop} urlPlaying={urlPlaying} setUrlPlaying={setUrlPlaying} currAudioSliceShouldPlay={currAudioSliceShouldPlay} messageList={currCon.conList} conId={currConId} />
        <InputRange isPlaying={isPlaying} beforeRecordingFn={beforeRecordingFn} handlePause={handleAudioStop} />
      </div>
    </ChatBoxContext.Provider>
  );
};

export default ChatBox;
