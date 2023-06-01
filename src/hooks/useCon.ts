import React from "react";
import { useSelector } from "react-redux";
import { ChatApiState } from "../store/chatApiSlice";

export const useCurrCon = () => {
  const { conversations, currConversationId, currChatType } = useSelector((state: ChatApiState) => state.chatApi);
  return conversations[currChatType][currConversationId[currChatType]];
};
export const useActiveCon = () => {
  const { conversations, activeConversationId, currChatType } = useSelector((state: ChatApiState) => state.chatApi);
  return conversations[currChatType][activeConversationId[currChatType]];
};
export const useCurrConId = () => {
  const { currConversationId, currChatType } = useSelector((state: ChatApiState) => state.chatApi);
  return currConversationId[currChatType];
};
export const useCurrChatType = () => {
  const { currChatType } = useSelector((state: ChatApiState) => state.chatApi);
  return currChatType;
};
export const useCurrBotAudioURL = (id: number) => {
  const currCon = useCurrCon();
  const url = currCon.conList.find((con) => con.id === id && con.role === "system")?.audioURL;

  return url;
};
export const useActiveBotId = () => {
  const { audioIdPlaying } = useSelector((state: ChatApiState) => state.chatApi);

  return audioIdPlaying;
};
