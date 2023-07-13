import React, { useEffect, useRef, useState } from "react";
import styles from "../index.module.scss";
import Button from "../../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { ChatApiState, ChatRequestDto, ChatRequestType, RequestMessage, getBotMessages, sendUserMessage } from "../../../store/chatApiSlice";

import SendSharpIcon from "@mui/icons-material/SendSharp";
import OralInputRange from "../../OralChat/components/OralInputRange";
import IconButton from "../../../components/IconButon/IconButton";
import { useToken } from "../../../hooks/useToken";

type Props = {
  handlePause: () => void;
  beforeRecordingFn: () => void;
  isPlaying: boolean;
};
export const sleep = (t: number) => new Promise((p) => setTimeout(p, t));
const InputRange = ({ isPlaying, beforeRecordingFn, handlePause }: Props) => {
  const [userMessage, setUserMessage] = useState<string>("");
  const dispatch: Function = useDispatch();
  const { loading, currConversationId, validConversations, currChatType, model, maxContextNum } = useSelector((state: ChatApiState) => state.chatApi);

  const textAreaRef = useRef<any>(null);
  const token = useToken();

  async function handleClick(type: ChatRequestType = "chat") {
    type === "voice" && handlePause();
    if (loading === "loading") {
      return;
    }
    if (!userMessage) {
      return;
    }
    type === "chat" && (textAreaRef.current.style.height = "36px");
    dispatch(sendUserMessage(userMessage));

    const messages: Array<RequestMessage> = [
      ...(validConversations[currChatType][currConversationId[currChatType]] as any),
      {
        role: "user",
        content: userMessage,
      } as RequestMessage,
    ].slice(-1 * maxContextNum); //context

    const requestDto: ChatRequestDto = {
      token: token || "",
      model: model,
      type: type,
      messages: messages,
      temperature: 0.7,
    };

    setUserMessage("");
    await sleep(1);
    dispatch(getBotMessages(requestDto));
  }

  const textAreaTypeText = (
    <div className={styles["inputRangeContainer"]}>
      <textarea
        ref={textAreaRef}
        onInput={(e) => {
          e.currentTarget.style.height = "36px";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (!e.shiftKey && e.key == "Enter") {
            e.preventDefault();
            handleClick();
          }
        }}
        value={userMessage}
        onChange={(e) => {
          setUserMessage(e.target.value);
        }}
        className={styles.inputRange}
      />
      <div className={styles.buttonWrapper}>
        <IconButton onClick={() => handleClick()} className={`${styles.sendBtn} ${loading === "loading" ? styles.btnLoading : ""}`}>
          <SendSharpIcon />
        </IconButton>
      </div>
    </div>
  );
  const textAreaTypeOral = (
    <div className={styles["inputRangeContainerOral"]}>
      <OralInputRange
        isPlaying={isPlaying}
        beforeRecordingFn={beforeRecordingFn}
        handlePause={handlePause}
        textAreaRef={textAreaRef}
        handleClick={() => {
          handleClick("voice");
        }}
        msg={userMessage}
        setMsg={setUserMessage}
      />
    </div>
  );

  const inputRange: Record<string, JSX.Element> = {
    text: textAreaTypeText,
    oral: textAreaTypeOral,
  };

  return inputRange[currChatType];
};
export default InputRange;
