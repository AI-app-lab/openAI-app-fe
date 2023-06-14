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
  useEffect(() => {
    //if words are too long, make the textarea higher,but not higher than 200px,if words are too short,make the textarea lower,but not lower than 36px

    if (textAreaRef.current) {
      console.log(textAreaRef.current.scrollHeight);
      if (textAreaRef.current.scrollHeight <= 500) {
        textAreaRef.current.style.overflow = "hidden";
      } else {
        textAreaRef.current.style.overflow = "auto";
      }
      textAreaRef.current.style.height = "37px";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }, [userMessage]);

  async function handleClick(type: ChatRequestType = "chat") {
    type === "voice" && handlePause();
    if (loading === "loading") {
      return;
    }
    if (!userMessage) {
      return;
    }

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
        onKeyDown={(e) => {
          if (e.key == "Enter") {
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
