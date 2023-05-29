import { type } from "os";
import React, { useContext, useEffect, useState } from "react";
import MarkDown from "./MarkDown";
import { useCurrChatType } from "../../../hooks/useCon";
import styles from "./../index.module.scss";
import { ChatBubbleContext } from "./ChatBubble";
import { AudioInfoContext } from "./ChatWindow";

import AudioControlBar from "./AudioControlBar";
import BubbleErrorBar from "./BubbleErrorBar";
type Props = {
  type: "err" | "system" | "user";
  showAll: boolean;
};

const BubbleType = ({ type, showAll }: Props) => {
  const [message] = useContext(ChatBubbleContext);
  const [urlPlaying, handlePause, __, currAudioSliceShouldPlay, isPlaying, isFinishWhole, ___, ____, _____] = useContext(AudioInfoContext);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    if (isShown) {
    }
  }, [isShown]);
  const Bubble = {
    err: (
      <>
        <MarkDown />
        <BubbleErrorBar />
      </>
    ),
    system: (
      <>
        <AudioControlBar />
        {
          <div onClick={() => setIsShown(!isShown)} style={{ filter: showAll ? "" : "blur(3px)" }}>
            <MarkDown />
          </div>
        }
      </>
    ),
    user: <>{message}</>,
  };
  return Bubble[type];
};

export default BubbleType;
