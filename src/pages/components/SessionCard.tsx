import React, { useState } from "react";
import styles from "../index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { deleteConversation, switchConversation } from "../../store/chatApiSlice";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import QuestionAnswerSharpIcon from "@mui/icons-material/QuestionAnswerSharp";
type Props = {
  cardId: number;
  title: string;
};

const SessionCard = ({ cardId, title }: Props) => {
  const [isHidden, setIsHidden] = useState(true);
  const { currConversationId, conversations } = useSelector((state: any) => state.chatApi);
  const dispatch = useDispatch();
  const handleCardDel = () => {
    dispatch(deleteConversation(cardId));
  };
  return (
    <div onClick={() => dispatch(switchConversation(cardId))} onMouseEnter={() => setIsHidden(false)} onMouseLeave={() => setIsHidden(true)} className={cardId === currConversationId ? styles.sessionCardSelected : styles.sessionCard}>
      <div className={styles.cardTop}>
        <div className={styles.topLeft}>
          <QuestionAnswerSharpIcon />
          <div className={styles.cardTitle}>{title}</div>
        </div>
        <div onClick={handleCardDel} hidden={isHidden} className={styles.closeBtn}>
          <HighlightOffIcon />
        </div>
      </div>
      <div className={styles.cardBottom}>
        <div>{conversations[cardId].conList.length} 条对话</div>

        <div>2023/4/10 01:16:22</div>
      </div>
    </div>
  );
};

export default SessionCard;
