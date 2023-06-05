import React, { useState } from "react";
import ListContainer from "../../../components/ListContainer/ListContainer";
import ListItem from "../../../components/ListItem/ListItem";
import styles from "../index.module.scss";
import Button from "../../../components/Button/Button";
import { pickRandomTopics } from "../../../utils/pickThreeRandomTopics";
import { useDispatch, useSelector } from "react-redux";
import { ChatApiSliceState, ChatApiState, ChatRequestDto, RequestMessage, getBotMessages, sendUserMessage } from "../../../store/chatApiSlice";
import { useToken } from "../../../hooks/useToken";
import { useCurrValidCon } from "../../../hooks/useCon";
import { sleep } from "./InputRange";
type Props = {};

const TopicList = (props: Props) => {
  const [topics, setTopics] = useState<string[]>(pickRandomTopics(5));
  const dispatch: Function = useDispatch();
  const token = useToken();
  const { model, maxContextNum } = useSelector((state: ChatApiState) => state.chatApi);
  const currValidCon = useCurrValidCon();
  const handleSelect = async (topic: string) => {
    const content = `Let's talk about ${topic}`;
    dispatch(sendUserMessage(content));
    const messages: Array<RequestMessage> = [
      ...(currValidCon as any),
      {
        role: "user",
        content: content,
      },
    ].slice(-1 * maxContextNum);
    const requestDto: ChatRequestDto = {
      token: token || "",
      model: model,
      type: "voice",
      messages: messages,
      temperature: 0.7,
    };
    await sleep(1);
    dispatch(getBotMessages(requestDto));
    console.log("select");
  };
  return (
    <ListContainer className={styles.topicListContainer}>
      <ListItem className={styles.title}>寻找一个新的讨论话题？</ListItem>
      {topics.map((topic, index) => (
        <ListItem onClick={() => handleSelect(topic)} className={styles.topicItem} key={topic}>
          {`${index + 1}  ${topic}`}
        </ListItem>
      ))}
      <ListItem>
        <Button
          className={styles.changeBtn}
          w={100}
          h={40}
          onClick={() => {
            const newTopics = pickRandomTopics(5);
            setTopics(newTopics);
          }}>
          换一批
        </Button>
      </ListItem>
    </ListContainer>
  );
};

export default TopicList;
