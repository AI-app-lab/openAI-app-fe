import React from "react";
import styles from "../index.module.scss";
import ChatWindow from "./ChatWindow";
import InputRange from "./InputRange";
import ChatBoxHeader from "./ChatBoxHeader";
import { useSelector } from "react-redux";
type Props = {
  isChatSideBox: boolean;
  setIsChatSdBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatBox = ({ isChatSideBox, setIsChatSdBarOpen }: Props) => {
  const { conversations, currConversationId } = useSelector((state: any) => state.chatApi);
  return (
    <div className={styles.chatBox}>
      <ChatBoxHeader isChatSideBox={isChatSideBox} setIsChatSdBarOpen={setIsChatSdBarOpen} />
      <ChatWindow messageList={conversations[currConversationId]?.conList} />
      <InputRange />
    </div>
  );
};

export default ChatBox;
