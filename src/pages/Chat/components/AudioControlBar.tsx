import React, { useContext, useState, useEffect } from "react";
import { useCurrBotAudioURL, useActiveBotId, useCurrChatType } from "../../../hooks/useCon";
import { ChatBubbleContext } from "./ChatBubble";
import styles from "./../index.module.scss";
import IconButton from "../../../components/IconButon/IconButton";

import { FaPlay } from "react-icons/fa";

import { AudioInfoContext } from "./ChatWindow";
import { useDispatch, useSelector } from "react-redux";
import { ChatApiState, changeIdPlaying, clearAudioPlaying } from "../../../store/chatApiSlice";
import { err, info } from "../../../utils/alert";

type Props = {};

const AudioControlElem = () => {
  const currChatType = useCurrChatType();
  const [message, id] = useContext(ChatBubbleContext);

  const [urlPlaying, handlePause, _, currAudioSliceShouldPlay, isPlaying, isFinishWhole, audioSliceTTSRequest, _audio, setAudioQueue] = useContext(AudioInfoContext);
  const currBotId = useActiveBotId();
  const currBotAudioURL = useCurrBotAudioURL(id);

  const dispatch = useDispatch();
  const handlePlay = () => {
    console.log("handlePlay", id);

    const play = () => {
      _audio && _audio.pause();

      audioSliceTTSRequest("[#OVER#]", false);
      currAudioSliceShouldPlay.play();
      dispatch(changeIdPlaying(id));
      console.log("change to ", id);

      currAudioSliceShouldPlay.onerror = (e) => {
        audioSliceTTSRequest(message, false, id);

        info("正在请求中，稍等片刻");
      };
      currAudioSliceShouldPlay.onplay = () => {};

      currAudioSliceShouldPlay.onpause = () => {
        dispatch(clearAudioPlaying());
      };
    };

    currBotAudioURL && (currAudioSliceShouldPlay.src = currBotAudioURL);
    currBotAudioURL && play();
  };
  return (
    <div>
      {
        {
          oral: (
            <IconButton className={`${styles.playBtn}   ${id === currBotId ? styles.playBtnPlaying : ""}`} onClick={id === currBotId ? () => {} : handlePlay}>
              <FaPlay />
              <span>播放</span>
            </IconButton>
          ),
          text: <></>,
        }[currChatType]
      }
    </div>
  );
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
