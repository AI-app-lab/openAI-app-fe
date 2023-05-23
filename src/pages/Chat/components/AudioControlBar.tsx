import React, { useContext } from "react";
import { useCurrChatType } from "../../../hooks/useCon";
import { ChatBubbleContext } from "./ChatBubble";
import styles from "./../index.module.scss";
import IconButton from "../../../components/IconButon/IconButton";
import { BsFillSquareFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";

import { AudioInfoContext } from "./ChatWindow";
type Props = {};

const AudioControlElem = () => {
  const currChatType = useCurrChatType();
  const [audioURL, message] = useContext(ChatBubbleContext);
  const [urlPlaying, handlePause, handlePlay] = useContext(AudioInfoContext);
  const isPlaying = () => {
    return audioURL === urlPlaying;
  };
  return {
    oral: isPlaying() ? (
      <IconButton className={styles.stopBtn} onClick={() => handlePause()}>
        <BsFillSquareFill />
        <span>停止</span>
      </IconButton>
    ) : (
      <IconButton className={styles.playBtn} onClick={() => handlePlay(audioURL, message)}>
        <FaPlay />
        <span>播放</span>
      </IconButton>
    ),
    text: <></>,
  }[currChatType];
};

const AudioControlBar = (props: Props) => {
  const currChatType = useCurrChatType();
  const [audioURL, _] = useContext(ChatBubbleContext);
  if (currChatType !== "oral") return <></>;
  const FinalRender = () => {
    return audioURL ? <AudioControlElem /> : <div className={styles.inProgress}>"生成中"</div>;
  };

  return (
    <div className={styles.audioControlGroup}>
      <FinalRender />
    </div>
  );
};

export default AudioControlBar;
