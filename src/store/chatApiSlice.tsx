import { createSlice, createAsyncThunk, original, Dispatch } from "@reduxjs/toolkit";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getFormattedDate } from "../utils/date";
import { GPTTokens } from "gpt-tokens";
interface ChatRequestDto {
  model: string;
  messages: Array<RequestMessage>;
}
export interface RequestDto extends ChatRequestDto {
  cardId: number;
}
export interface RequestMessage {
  role: "user" | "system";
  content: string;
}
export interface ShownMessage {
  time: string;
  role: "err" | "user" | "system";
  content: string;
}

export interface ChatApiSliceState {
  loading: string;
  model: string;
  currConversationId: number;
  conversations: Array<{
    time: string;
    topic: string;
    conList: Array<ShownMessage>;
  }>;
  validConversations: Array<Array<RequestMessage>>;
  activeConversationId: number;
  maxContextNum: number;
}

export interface ChatApiState {
  chatApi: ChatApiSliceState;
}
const ctrl = new AbortController();
const handleFetchEventSource = (chatRequestDto: ChatRequestDto, dispatch: Dispatch) => {
  return fetchEventSource("http://localhost:8080/openAI/chat/completions", {
    method: "POST",
    body: JSON.stringify(chatRequestDto),
    headers: {
      "Content-Type": "application/json",
    },
    signal: ctrl.signal,

    onmessage(msg) {
      const word = JSON.parse(msg.data).choices[0].delta.content;
      word && dispatch(receivedUpdate(word));
    },
    onerror(err) {
      throw err;
    },
  });
};
export const getBotMessages = createAsyncThunk("chatBox/getBotMessages", async ({ cardId, ...chatRequestDto }: RequestDto, { dispatch, rejectWithValue }) => {
  console.log("[Request] ", JSON.stringify(chatRequestDto.messages, null, 3));

  let tokens = getTokensCount(chatRequestDto);
  const before = tokens;

  //当使用的token数超过4000时，将messages中的前两条消息删除直到token数小于4000，如果messages中只有一条消息，那么删除这条消息并且报错
  tokens > 100 && console.log("Token到达阈值开始压缩....:", tokens);
  while (tokens > 100) {
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

  await handleFetchEventSource(chatRequestDto, dispatch);
});

const getTokensCount = (chatRequestDto: ChatRequestDto) => {
  const usageInfo = new GPTTokens(chatRequestDto as any);
  return usageInfo.usedTokens;
};

const initialState: ChatApiSliceState = {
  loading: "idle",
  model: "gpt-3.5-turbo",
  currConversationId: 0,
  conversations: [{ time: getFormattedDate(), topic: "New Conversation", conList: [{ time: getFormattedDate(), role: "system", content: "我是AI助手，请问有什么我可以帮您的吗？" }] }],
  validConversations: [[]],
  activeConversationId: 0,
  maxContextNum: 6, //default
};
export const chatApiSlice = createSlice({
  name: "chatApi",
  initialState: initialState,
  reducers: {
    getRecentConversations(state) {
      const recentConversations = localStorage.getItem("conversations");
      const recentValidConversations = localStorage.getItem("validConversations");
      if (recentConversations && recentValidConversations) {
        try {
          state.conversations = JSON.parse(recentConversations);
          state.validConversations = JSON.parse(recentValidConversations);
        } catch {
          console.log("Error parsing JSON string");
          state.conversations = initialState.conversations;
          state.validConversations = initialState.validConversations;
        }
      } else {
        state.conversations = initialState.conversations;
        state.validConversations = initialState.validConversations;
      }
    },
    sendUserMessage(state, action) {
      //send user message
      state.activeConversationId = state.currConversationId;
      state.conversations[state.activeConversationId].conList.push({ time: getFormattedDate(), role: "user", content: action.payload });
      state.validConversations[state.activeConversationId].push({ role: "user", content: action.payload });
      //receive system message placeholder
      state.conversations[state.activeConversationId].conList.push({ time: getFormattedDate(), role: "system", content: "" });
      state.validConversations[state.activeConversationId].push({ role: "system", content: "" });
      state.loading = "loading";
    },
    receivedUpdate(state, action) {
      const word = action.payload;
      const last = state.conversations[state.activeConversationId].conList.length - 1;
      const validLast = state.validConversations[state.activeConversationId].length - 1;
      state.conversations[state.activeConversationId].conList[last].content += word;
      state.validConversations[state.activeConversationId][validLast].content += word;
      localStorage.setItem("conversations", JSON.stringify(state.conversations));
      localStorage.setItem("validConversations", JSON.stringify(state.validConversations));
    },
    startNewConversation(state) {
      const last = state.conversations.length - 1;
      last >= 0 && state.conversations[last].conList.length && state.conversations.push({ time: getFormattedDate(), topic: "New Conversation", conList: [{ time: getFormattedDate(), role: "system", content: "我是AI助手，请问有什么我可以帮您的吗？" }] }) && state.validConversations.push([]) && (state.currConversationId = last + 1);

      console.log(last);
    },
    deleteConversation(state, action) {
      state.activeConversationId === action.payload && ctrl.abort();

      state.conversations = state.conversations.filter((_, index) => index !== action.payload);
      state.validConversations = state.validConversations.filter((_, index) => index !== action.payload);

      !state.conversations.length && (state.conversations = [{ time: getFormattedDate(), topic: "New Conversation", conList: [{ time: getFormattedDate(), role: "system", content: "我是AI助手，请问有什么我可以帮您的吗？" }] }]);
      !state.validConversations.length && (state.validConversations = [[]]);
      state.currConversationId = state.conversations.length - 1;
      localStorage.setItem("conversations", JSON.stringify(state.conversations));
      localStorage.setItem("validConversations", JSON.stringify(state.validConversations));
    },
    refreshValidConversations(state, action) {
      state.validConversations[state.activeConversationId] = action.payload;
      localStorage.setItem("validConversations", JSON.stringify(state.validConversations));
    },
    switchConversation(state, action) {
      state.currConversationId = action.payload;
    },
    modifyTopic(state, action) {
      state.conversations[state.currConversationId].topic = action.payload;
      localStorage.setItem("conversations", JSON.stringify(state.conversations));
    },
  },
  extraReducers(builder) {
    builder.addCase(getBotMessages.pending, (state) => {});
    builder.addCase(getBotMessages.fulfilled, (state) => {
      state.validConversations[state.activeConversationId].length > state.maxContextNum && (state.validConversations[state.activeConversationId] = state.validConversations[state.activeConversationId].splice(-1 * state.maxContextNum));
      localStorage.setItem("validConversations", JSON.stringify(state.validConversations));
      state.loading = "idle";
    });
    builder.addCase(getBotMessages.rejected, (state, action: any) => {
      console.log(action.payload?.message);

      ctrl.abort();
      const last = state.conversations[state.activeConversationId].conList.length - 1;

      state.validConversations[state.activeConversationId].pop();
      state.validConversations[state.activeConversationId].pop();
      const msg = state.conversations[state.activeConversationId].conList[last].content;
      state.conversations[state.activeConversationId].conList[last] = { time: getFormattedDate(), role: "err", content: msg + `(${action.payload?.message ? action.payload?.message : "error"})` };
      localStorage.setItem("conversations", JSON.stringify(state.conversations));
      localStorage.setItem("validConversations", JSON.stringify(state.validConversations));
      state.loading = "idle";
    });
  },
});
export const { modifyTopic, refreshValidConversations, receivedUpdate, sendUserMessage, getRecentConversations, deleteConversation, startNewConversation, switchConversation } = chatApiSlice.actions;
export default chatApiSlice.reducer;
