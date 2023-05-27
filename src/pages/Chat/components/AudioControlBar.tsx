import React, { useContext } from "react";
import { useCurrBotAudioURL, useActiveBotId, useCurrChatType } from "../../../hooks/useCon";
import { ChatBubbleContext } from "./ChatBubble";
import styles from "./../index.module.scss";
import IconButton from "../../../components/IconButon/IconButton";
import { BsFillSquareFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";

import { AudioInfoContext } from "./ChatWindow";

type Props = {};

const AudioControlElem = () => {
  const currChatType = useCurrChatType();
  const [message, id] = useContext(ChatBubbleContext);
  const [urlPlaying, handlePause, _, currAudioSliceShouldPlay, isPlaying, isFinishWhole, audioSliceTTSRequest] = useContext(AudioInfoContext);
  const currBotId = useActiveBotId();
  const currBotAudioURL = useCurrBotAudioURL(id);
  const handlePlay = () => {
    const play = () => {
      currAudioSliceShouldPlay.play();
      currAudioSliceShouldPlay.onerror = (e) => {
        audioSliceTTSRequest(message, false, id);

        alert("播放失败");
      };
    };
    currBotAudioURL && (currAudioSliceShouldPlay.src = currBotAudioURL);
    currBotAudioURL && play();
  };
  return {
    oral:
      id === currBotId ? (
        <IconButton className={styles.stopBtn} onClick={() => currAudioSliceShouldPlay.pause()}>
          <BsFillSquareFill />
          <span>停止</span>
        </IconButton>
      ) : (
        <IconButton className={styles.playBtn} onClick={handlePlay}>
          <FaPlay />
          <span>播放{id}</span>
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
