import { createSlice, createAsyncThunk, original, Dispatch } from "@reduxjs/toolkit";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getFormattedDate } from "../utils/date";
import { lsSet } from "../utils/localstorage";
import { getTokensCount } from "../utils/getTokensCount";

import { err } from "../utils/alert";
import { clear } from "console";
import { Prompts } from "../utils/prompt";

export type ChatRequestType = "voice" | "chat";
export type Role = "err" | "user" | "system";
export interface ChatRequestDto {
  model: string;
  type: ChatRequestType;
  messages: Array<RequestMessage>;
}

export interface RequestMessage {
  role: "user" | "system";
  content: string;
}

export interface ShownMessage {
  id: number;
  time: string;
  role: Role;
  content: string;
  audioURL: string;
}

export interface Conversation {
  time: string;
  topic: string;
  conList: Array<ShownMessage>;
}
type ChatType = "text" | "oral";
export interface ChatApiSliceState {
  loading: string;
  model: string;
  currChatType: ChatType;
  conversations: Record<ChatType, Array<Conversation>>;
  currConversationId: Record<ChatType, number>;
  validConversations: Record<ChatType, Array<Conversation> | [[]]>;
  activeConversationId: Record<ChatType, number>;
  maxContextNum: number;
  audioMsg: string;
  queue: Array<string>;
  msgQueue: Array<string>;
  lastMsg: string;
  audioIdPlaying: number;
}

export interface ChatApiState {
  chatApi: ChatApiSliceState;
}
export let ctrl = new AbortController();

const handleFetchEventSource = (chatRequestDto: ChatRequestDto, dispatch: Dispatch) => {
  ctrl = new AbortController();

  return new Promise<void>((resolve, reject) => {
    let timer = setTimeout(() => {
      ctrl.abort();
      reject(new Error("Timeout"));
    }, 5000);
    let msgChunk = "";

    fetchEventSource("http://43.139.143.5:9898/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify({ ...chatRequestDto, stream: true }),
      headers: {
        "Content-Type": "application/json",
      },
      signal: ctrl.signal,
      onmessage(msg) {
        clearTimeout(timer);
        if (msg.data === "[DONE]") {
          if (msgChunk.length) {
            dispatch(pushToMsgQueue(msgChunk));

            msgChunk = "";
          }
          dispatch(pushToMsgQueue("[#OVER#]"));
          ctrl.abort();
          resolve();
          return;
        }
        timer = setTimeout(() => {
          ctrl.abort();
          reject(new Error("Timeout"));
        }, 5000);

        const word = JSON.parse(msg.data).choices[0].delta.content;
        word && dispatch(receivedUpdate(word));
        word && (msgChunk += word);
        //if msgChunk is a complete sentence, push it to the queue
        if (msgChunk.endsWith(".") || msgChunk.endsWith("!") || msgChunk.endsWith("?")) {
          msgChunk.length > 250 && dispatch(pushToMsgQueue(msgChunk)) && (msgChunk = "");
        }
      },
      onerror(err) {
        console.log("Error:", err);
        reject(err);
      },
    });
  });
};
export const getBotMessages = createAsyncThunk("chatBox/getBotMessages", async (chatRequestDto: ChatRequestDto, { dispatch, rejectWithValue }) => {
  console.log("[Request] ", JSON.stringify(chatRequestDto.messages, null, 3));
  const { type, ...rest } = chatRequestDto;
  let tokens = getTokensCount(rest);
  const before = tokens;

  //当使用的token数超过4000时，将messages中的前两条消息删除直到token数小于4000，如果messages中只有一条消息，那么删除这条消息并且报错
  tokens > 100 && console.log("Token到达阈值开始压缩....:", tokens);
  while (tokens > 4000) {
    if (chatRequestDto.messages.length <= 1) {
      console.log("压缩失败");
      return rejectWithValue({ message: "你的信息太长了" });
    }
    chatRequestDto.messages.shift();
    tokens = getTokensCount(chatRequestDto);
  }
  const after = tokens;

  if (before != after) {
    console.log("Token到达阈值:", before);
    console.log("[压缩前]:", before);
    console.log("[压缩后]:", after);
  } else {
    console.log("Tokens(当前):", tokens);
  }

  try {
    chatRequestDto.messages = [
      {
        role: "system",
        content: Prompts.englishTeacherAndImprover,
      },
      ...chatRequestDto.messages,
    ];
    console.log("[Request] ", JSON.stringify(chatRequestDto.messages, null, 3));

    await handleFetchEventSource(chatRequestDto, dispatch);
  } catch (err) {
    console.log("Error:", err);
    dispatch(pushToMsgQueue("[#OVER#]"));
    return rejectWithValue({ message: "" });
  }
});

const localStorageConversations = {
  text: "conversations",
  oral: "oralConversations",
};
const localStorageValidConversations = {
  text: "validConversations",
  oral: "oralValidConversations",
};
const initialState: ChatApiSliceState = {
  loading: "idle",
  model: "gpt-3.5-turbo",
  currChatType: "text",
  conversations: {
    text: [{ time: getFormattedDate(), topic: "New Conversation", conList: [] }],
    oral: [{ time: getFormattedDate(), topic: "New Conversation", conList: [] }],
  },
  currConversationId: {
    text: 0,
    oral: 0,
  },
  validConversations: {
    text: [[]],
    oral: [[]],
  },
  activeConversationId: {
    text: 0,
    oral: 0,
  },
  maxContextNum: 6, //default
  audioMsg: "",
  queue: [],
  msgQueue: [],
  lastMsg: "",
  audioIdPlaying: -1,
};
export const chatApiSlice = createSlice({
  name: "chatApi",
  initialState: initialState,
  reducers: {
    setLastMsg(state, action: { payload: string }) {
      state.lastMsg = action.payload;
    },
    getRecentConversations(state) {
      const type = state.currChatType;

      const recentConversations = localStorage.getItem(localStorageConversations[type]);
      const recentValidConversations = localStorage.getItem(localStorageValidConversations[type]);
      if (recentConversations && recentValidConversations) {
        try {
          state.conversations[type] = JSON.parse(recentConversations);
          state.validConversations[type] = JSON.parse(recentValidConversations);
        } catch {
          console.log("Error parsing JSON string");
          state.conversations[type] = initialState.conversations[type];
          state.validConversations[type] = initialState.validConversations[type];
        }
      } else {
        state.conversations[type] = initialState.conversations[type];
        state.validConversations[type] = initialState.validConversations[type];
      }
    },
    sendUserMessage(
      state,
      action: {
        payload: string;
      }
    ) {
      //send user message
      const type = state.currChatType;
      const msg = action.payload;
      state.activeConversationId[type] = state.currConversationId[type];

      const newCon = (character: Role) => {
        let id = state.conversations[type][state.activeConversationId[type]].conList.length;
        const _msg = character === "system" ? "" : msg;
        const _id = character === "system" ? (id - 1) / 2 : id;
        return { time: getFormattedDate(), role: character, content: _msg, id: _id, audioURL: "" };
      };
      state.conversations[type][state.activeConversationId[type]].conList.push(newCon("user"));

      (state.validConversations[type][state.activeConversationId[type]] as any).push({ role: "user", content: msg });
      //receive system message placeholder
      state.conversations[type][state.activeConversationId[type]].conList.push(newCon("system"));
      (state.validConversations[type][state.activeConversationId[type]] as any).push({ role: "system", content: "" });
      state.loading = "loading";
    },
    receivedUpdate(
      state,
      action: {
        payload: string;
      }
    ) {
      const word = action.payload;
      const type = state.currChatType;
      const last = state.conversations[type][state.activeConversationId[type]].conList.length - 1;
      const validLast = (state.validConversations[type][state.activeConversationId[type]] as any).length - 1;
      state.conversations[type][state.activeConversationId[type]].conList[last].content += word;
      (state.validConversations as any)[type][state.activeConversationId[type]][validLast].content += word;
      lsSet(localStorageConversations[type], state.conversations[type]);
      lsSet(localStorageValidConversations[type], state.validConversations[type]);
    },
    startNewConversation(state) {
      const type = state.currChatType;
      const last = state.conversations[type].length - 1;
      last >= 0 && state.conversations[type][last].conList.length && state.conversations[type].push({ time: getFormattedDate(), topic: "New Conversation", conList: [] }) && (state.validConversations as any)[type].push([]) && (state.currConversationId[type] = last + 1);
    },
    deleteConversation(
      state,
      action: {
        payload: number;
      }
    ) {
      const id = action.payload;
      const type = state.currChatType;
      state.activeConversationId[type] === id && ctrl.abort();

      state.conversations[type] = state.conversations[type].filter((_, index) => index !== id);
      state.validConversations[type] = (state.validConversations[type] as any).filter((_: any, index: any) => index !== action.payload);

      !state.conversations[type].length && (state.conversations[type] = [{ time: getFormattedDate(), topic: "New Conversation", conList: [] }]);
      !state.validConversations[type].length && (state.validConversations[type] = [[]]);
      state.currConversationId[type] = state.conversations[type].length - 1;
      lsSet(localStorageConversations[type], state.conversations[type]);
      lsSet(localStorageValidConversations[type], state.validConversations[type]);
    },
    refreshValidConversations(state, action) {
      const type = state.currChatType;
      (state.validConversations as any)[type][state.activeConversationId[type]] = action.payload;
      lsSet(localStorageValidConversations[type], state.validConversations[type]);
    },
    switchConversation(state, action: { payload: number }) {
      const type = state.currChatType;
      const id = action.payload;
      state.currConversationId[type] = id;
    },
    modifyTopic(state, action: { payload: string }) {
      const type = state.currChatType;
      const topic = action.payload;
      state.conversations[type][state.currConversationId[type]].topic = topic;
      lsSet(localStorageConversations[type], state.conversations[type]);
    },
    setCurrChatType(state, action: { payload: ChatType }) {
      state.currChatType = action.payload;
    },
    clearAudioMsg(state) {
      state.audioMsg = "";
    },

    pushToMsgQueue(state, action: { payload: string }) {
      state.msgQueue.push(action.payload);
    },
    clearMsgQueue(state) {
      state.msgQueue = [];
    },
    shiftMsgQueue(state) {
      state.msgQueue.shift();
    },
    updateAudioUrl(
      state,
      action: {
        payload: {
          wholeAudioUrl: string;
          id: number;
        };
      }
    ) {
      const { wholeAudioUrl, id } = action.payload;

      const type = state.currChatType;

      let activeCon;

      if (id !== -1) {
        state.conversations[type][state.activeConversationId[type]].conList.forEach((item) => {
          if (item.id === id && item.role === "system") {
            console.log("捕获id");

            item.audioURL = wholeAudioUrl;
          }
        });
        state.audioIdPlaying = id;
        activeCon = state.conversations[type][state.activeConversationId[type]].conList[id];
      } else {
        const last = state.conversations[type][state.activeConversationId[type]].conList.length - 1;
        activeCon = state.conversations[type][state.activeConversationId[type]].conList[last];
        state.audioIdPlaying = activeCon.id;
        activeCon.audioURL = wholeAudioUrl;
      }

      lsSet(localStorageConversations[type], state.conversations[type]);
    },
    startAudioPlaying(state) {
      const type = state.currChatType;
      const last = state.conversations[type][state.activeConversationId[type]].conList.length - 1;
      state.audioIdPlaying = state.conversations[type][state.activeConversationId[type]].conList[last].id;
    },
    clearAudioPlaying(state) {
      state.audioIdPlaying = -1;
    },
    changeIdPlaying(state, action: { payload: number }) {
      state.audioIdPlaying = action.payload;
    },
    abortGenerating(state) {
      ctrl.abort();
      state.loading = "idle";
    },
  },
  extraReducers(builder) {
    builder.addCase(getBotMessages.pending, (state) => {});
    builder.addCase(getBotMessages.fulfilled, (state) => {
      const type = state.currChatType;
      (state.validConversations as any)[type][state.activeConversationId[type]].length > state.maxContextNum && (state.validConversations[type][state.activeConversationId[type]] = (state.validConversations as any)[type][state.activeConversationId[type]].splice(-1 * state.maxContextNum));

      lsSet(localStorageValidConversations[type], state.validConversations[type]);
      state.loading = "idle";
      const currConversation = (state.validConversations as any)[type][state.activeConversationId[type]];
      const lastBotMsg = currConversation.length - 1;

      state.currChatType === "oral" && (state.audioMsg = currConversation[lastBotMsg].content);

      // console.log(currConversation[lastBotMsg].content);
    });
    builder.addCase(getBotMessages.rejected, (state, action: any) => {
      state.loading !== "idle" && err("请求错误");

      ctrl.abort();
      const type = state.currChatType;
      const last = state.conversations[type][state.activeConversationId[type]].conList.length - 1;

      (state.validConversations as any)[type][state.activeConversationId[type]].pop();
      (state.validConversations as any)[type][state.activeConversationId[type]].pop();
      const msg = state.conversations[type][state.activeConversationId[type]].conList[last].content;
      state.conversations[type][state.activeConversationId[type]].conList[last] = { time: getFormattedDate(), role: "err", content: msg + `[${action.payload?.message ? action.payload?.message : "出错了"}]`, id: -1, audioURL: "" };
      lsSet(localStorageConversations[type], state.conversations[type]);
      lsSet(localStorageValidConversations[type], state.validConversations[type]);
      state.loading = "idle";
    });
  },
});
export const { modifyTopic, refreshValidConversations, receivedUpdate, sendUserMessage, getRecentConversations, deleteConversation, startNewConversation, switchConversation, setCurrChatType, clearAudioMsg, pushToMsgQueue, shiftMsgQueue, setLastMsg, updateAudioUrl, clearMsgQueue, clearAudioPlaying, startAudioPlaying, changeIdPlaying, abortGenerating } = chatApiSlice.actions;
export default chatApiSlice.reducer;
