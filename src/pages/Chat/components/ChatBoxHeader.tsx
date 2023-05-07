import React, { useState, useRef, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import styles from "../index.module.scss";
import ModeIcon from "@mui/icons-material/Mode";
import { AiOutlineMenu } from "react-icons/ai";
import { UserState, openModal } from "../../../store/userSlice";
import { ChatApiState, modifyTopic } from "../../../store/chatApiSlice";
import IconButton from "../../../components/IconButon/IconButton";

type Props = {
  isChatSideBox: boolean;
  setIsChatSdBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatBoxHeader = ({ isChatSideBox, setIsChatSdBarOpen }: Props) => {
  const dispatch = useDispatch();
  const { conversations, currConversationId } = useSelector((state: ChatApiState) => state.chatApi);

  const [isEdit, setIsEdit] = useState(false);
  const spanRef = useRef<any>(null);
  useEffect(() => {
    if (isEdit && spanRef.current) {
      spanRef.current.focus();
    }
  }, [isEdit, currConversationId]);
  return (
    <div className={styles.headerContainer}>
      <div>
        <div className={styles.headerTop}>
          <span
            className={styles.editBtn}
            onClick={() => {
              setIsEdit(true);
            }}>
            <ModeIcon />
          </span>
          {isEdit ? (
            <input
              className={styles.editInput}
              type="text"
              defaultValue={conversations[currConversationId].topic}
              onBlur={(e) => {
                setIsEdit(false);
                dispatch(modifyTopic(e.currentTarget.value));
              }}
              ref={spanRef}
            />
          ) : (
            <input disabled className={styles.title} value={conversations[currConversationId].topic} />
          )}
        </div>
        <div className={styles.subTitle}>{conversations[currConversationId] ? conversations[currConversationId].conList.length : 0} messages width ChatGPT</div>
      </div>
      <IconButton>
        <AiOutlineMenu onClick={() => setIsChatSdBarOpen(!isChatSideBox)} size={20} className={styles.sdBarCaller} />
      </IconButton>
    </div>
  );
};

export default ChatBoxHeader;
