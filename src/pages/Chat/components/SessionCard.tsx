import React, { useState } from "react";
import styles from "../index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { ChatApiState, deleteConversation, switchConversation } from "../../../store/chatApiSlice";
import QuestionAnswerSharpIcon from "@mui/icons-material/QuestionAnswerSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
type Props = {
  cardId: number;
  title: string;
};

const SessionCard = ({ cardId, title }: Props) => {
  const { currConversationId, conversations } = useSelector((state: ChatApiState) => state.chatApi);
  const dispatch = useDispatch();
  const handleCardDel = (e: any) => {
    e.stopPropagation();
    dispatch(deleteConversation(cardId));
  };
  return (
    <div onClick={() => dispatch(switchConversation(cardId))} className={cardId === currConversationId ? styles.sessionCardSelected : styles.sessionCard}>
      <div className={styles.cardTop}>
        <div className={styles.topLeft}>
          <QuestionAnswerSharpIcon />
          <div className={styles.cardTitle}>{title}</div>
        </div>

        <DeleteForeverIcon onClick={handleCardDel} className={styles.closeBtn} />
      </div>
      <div className={styles.cardBottom}>
        <div>{conversations[cardId].conList.length} 条对话</div>
        <div>{conversations[cardId].time}</div>
      </div>
    </div>
  );
};

export default SessionCard;
