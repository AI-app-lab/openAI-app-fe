import { type } from "os";
import React, { useContext } from "react";
import MarkDown from "./MarkDown";
import { useCurrChatType } from "../../../hooks/useCon";
import styles from "./../index.module.scss";
import { ChatBubbleContext } from "./ChatBubble";
import { AudioInfoContext } from "./ChatWindow";

import AudioControlBar from "./AudioControlBar";
import BubbleErrorBar from "./BubbleErrorBar";
type Props = {
  type: "err" | "system" | "user";
};

const BubbleType = ({ type }: Props) => {
  const [_, message] = useContext(ChatBubbleContext);
  const [urlPlaying, handlePause, __, currAudioSliceShouldPlay, isPlaying, isFinishWhole] = useContext(AudioInfoContext);
  const Bubble = {
    err: (
      <>
        <BubbleErrorBar />
        <MarkDown />
      </>
    ),
    system: (
      <>
        <AudioControlBar />
        <MarkDown />
      </>
    ),
    user: <>{message}</>,
  };
  return Bubble[type];
};

export default BubbleType;
