import React, { useContext } from "react";
import { useCurrBotAudioURL, useCurrBotId, useCurrChatType } from "../../../hooks/useCon";
import { ChatBubbleContext } from "./ChatBubble";
import styles from "./../index.module.scss";
import IconButton from "../../../components/IconButon/IconButton";
import { BsFillSquareFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";

import { AudioInfoContext } from "./ChatWindow";
import { err } from "../../../utils/alert";
type Props = {};

const AudioControlElem = () => {
  const currChatType = useCurrChatType();
  const [message, id] = useContext(ChatBubbleContext);
  const [urlPlaying, handlePause, _, currAudioSliceShouldPlay, isPlaying, isFinishWhole] = useContext(AudioInfoContext);
  const currBotId = useCurrBotId();
  const currBotAudioURL = useCurrBotAudioURL(id);
  return {
    oral:
      id === currBotId ? (
        <IconButton className={styles.stopBtn} onClick={() => currAudioSliceShouldPlay.pause()}>
          <BsFillSquareFill />
          <span>停止</span>
        </IconButton>
      ) : (
        <IconButton
          className={styles.playBtn}
          onClick={() => {
            currBotAudioURL && (currAudioSliceShouldPlay.src = currBotAudioURL) && currAudioSliceShouldPlay.play();
          }}>
          <FaPlay />
          <span>播放</span>
        </IconButton>
      ),
    text: <></>,
  }[currChatType];
};

const AudioControlBar = (props: Props) => {
  const currChatType = useCurrChatType();

  if (currChatType !== "oral") return <></>;
  const FinalRender = () => {
    return <AudioControlElem />;
  };

  return (
    <div className={styles.audioControlGroup}>
      <FinalRender />
    </div>
  );
};

export default AudioControlBar;
