import React, { useContext } from "react";
import { ChatBubbleContext } from "./ChatBubble";
import { MdError } from "react-icons/md";

type Props = {};
const messages: Record<string, string> = {
  "[出错了]": "生成中断",
  "[你的信息太长了]": "你的信息太长了",
};
const BubbleErrorBar = (props: Props) => {
  const [message] = useContext(ChatBubbleContext);
  return (
    <>
      {Object.entries(messages).map(
        ([key, value]: Array<string>) =>
          message.endsWith(key) && (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                //color warning yellow
                color: "#f5a623",
                fontWeight: 600,
              }}>
              <MdError size={16} />
              <div
                style={{
                  marginLeft: 3,
                }}>
                {value}
              </div>
            </div>
          )
      )}
    </>
  );
};

export default BubbleErrorBar;
