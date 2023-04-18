export const Prompts = {
  summarize: "简要总结一下你和用户的对话，用作后续的上下文提示 prompt，控制在 200 字以内",
  topic: "使用四到五个字直接返回这句话的简要主题，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回“闲聊”",
  compression: (summary: string) => "这是你和用户的历史聊天总结作为前情提要用作后续的上下文提示 prompt：" + summary + ". \n请继续一如既往的与用户互动。以下是用户的提问\n\n",
};
