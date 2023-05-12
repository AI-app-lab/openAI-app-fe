import React from "react";
import Grid from "@mui/material/Unstable_Grid2";

import styles from "./index.module.scss";
import Card from "./components/Card/Card";
import Link from "../../components/Link/Link";
import QuestionAnswerSharpIcon from "@mui/icons-material/QuestionAnswerSharp";
import TranslateIcon from "@mui/icons-material/Translate";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import DrawIcon from "@mui/icons-material/Draw";
import { nanoid } from "nanoid";
type Props = {};
const useColor = () => {
  return ["#f1a746", "#dc5ce5", "#7b41de", "#ec445b", "#2bb68e"][Math.floor(Math.random() * 5)];
};
type CardType = {
  title: string;
  content: string;
  media: JSX.Element;
  bg: string;
};
const Apps = (props: Props) => {
  const cards = [
    {
      title: "对话",
      content: "在这里，您可以与AI进行实时的文字对话，讨论各种主题，获取帮助或咨询。",
      media: <QuestionAnswerSharpIcon />,
      bg: useColor(),
      to: "chat",
    },
    {
      title: "口语",
      content: "通过语音输入，您可以与AI进行口语交流，提高您的发音和口语能力。",
      media: <HeadsetMicIcon />,
      bg: useColor(),
      to: "oral-chat",
    },
    {
      title: "作图",
      content: "AI将帮助您创建绘图和设计，让您的想法在视觉上呈现出来。",
      media: <DrawIcon />,
      bg: useColor(),
      to: "draw",
    },
    {
      title: "翻译",
      content: "利用AI翻译功能，快速准确地将文本翻译成多种语言。",
      media: <TranslateIcon />,
      bg: useColor(),
      to: "translate",
    },
  ];
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>我的应用</div>
      <div className={styles.container}>
        <Grid container rowSpacing={5}>
          {cards.map(({ to, title, content, media, bg }) => (
            <Grid key={nanoid()} xs={12} md={6}>
              <Link className={styles.cardLink} to={to}>
                <div className={styles.item}>
                  <Card bg={bg} title={title} content={content} media={media} />
                </div>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Apps;
