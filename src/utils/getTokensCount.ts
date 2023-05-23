import { GPTTokens } from "gpt-tokens";
import { RequestMessage } from "../store/chatApiSlice";
interface ChatRequestDtoForTokenCount {
  model: string;
  messages: Array<RequestMessage>;
}
export const getTokensCount = (chatRequestDto: ChatRequestDtoForTokenCount) => {
  const usageInfo = new GPTTokens(chatRequestDto as any);
  return usageInfo.usedTokens;
};
