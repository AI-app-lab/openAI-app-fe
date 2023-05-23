import React from "react";
import { useSelector } from "react-redux";
import { ChatApiState } from "../store/chatApiSlice";

export const useCurrCon = () => {
  const { conversations, currConversationId, currChatType } = useSelector((state: ChatApiState) => state.chatApi);
  return conversations[currChatType][currConversationId[currChatType]];
};

export const useCurrConId = () => {
  const { currConversationId, currChatType } = useSelector((state: ChatApiState) => state.chatApi);
  return currConversationId[currChatType];
};
export const useCurrChatType = () => {
  const { currChatType } = useSelector((state: ChatApiState) => state.chatApi);
  return currChatType;
};
