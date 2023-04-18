import React, { WheelEvent, useEffect, useRef, useState } from "react";
import styles from "../index.module.scss";
import { useSelector } from "react-redux";
import ChatBubble from "./ChatBubble";
import { ShownMessage } from "../../store/chatApiSlice";

type Props = {
  messageList: Array<ShownMessage>;
};

const ChatWindow = ({ messageList }: Props) => {
  const { conversations, activeConversationId, currConversationId } = useSelector((state: any) => state.chatApi);
  const messagesEndRef = useRef<any>(null);
  const [isAutoEnd, setIsAutoEnd] = useState(true);

  useEffect(() => {
    const scroll = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
    isAutoEnd && messagesEndRef.current.scrollTo(0, scroll);
  }, [conversations[activeConversationId].conList]);
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const { deltaY } = e;
    messagesEndRef.current.scrollTop + 700 > messagesEndRef.current.scrollHeight && setIsAutoEnd(true);
    deltaY < 0 && setIsAutoEnd(false);
  };
  return (
    <div onWheel={(e) => handleWheel(e)} ref={messagesEndRef} className={styles.chatWindow}>
      {messageList && messageList.map(({ role, content }: ShownMessage, index: number) => <ChatBubble key={index} type={role} message={content} />)}
    </div>
  );
};

export default ChatWindow;
