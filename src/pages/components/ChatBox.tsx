import React from "react";
import styles from "../index.module.scss";
import ChatWindow from "./ChatWindow";
import InputRange from "./InputRange";
import ChatBoxHeader from "./ChatBoxHeader";
import { useSelector } from "react-redux";
type Props = {};

const ChatBox = (props: Props) => {
  const { conversations, currConversationId } = useSelector((state: any) => state.chatApi);
  return (
    <div className={styles.chatBox}>
      <ChatBoxHeader />
      <ChatWindow messageList={conversations[currConversationId]?.conList} />
      <InputRange />
    </div>
  );
};

export default ChatBox;
