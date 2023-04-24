import React, { useState, useRef, useEffect } from "react";
import styles from "../index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import { locations } from "../../localization";
import { ConfigState } from "../../store/configSlice";
import ModeIcon from "@mui/icons-material/Mode";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { UserState, openModal } from "../../store/userSlice";
import { ChatApiState, modifyTopic } from "../../store/chatApiSlice";

type Props = {};

const ChatBoxHeader = (props: Props) => {
  const dispatch = useDispatch();
  const { conversations, currConversationId } = useSelector((state: ChatApiState) => state.chatApi);
  const { userInfo } = useSelector((state: UserState) => state.user);
  const { location } = useSelector((state: ConfigState) => state.config);
  const [isEdit, setIsEdit] = useState(false);
  const spanRef = useRef<any>(null);
  useEffect(() => {
    if (isEdit && spanRef.current) {
      spanRef.current.focus();
    }
  }, [isEdit, currConversationId]);
  return (
    <div className={styles.chatBoxHeader}>
      <div>
        <div>
          <span
            onClick={() => {
              setIsEdit(true);
            }}>
            <Button className={styles.editBtn} w={30} h={30}>
              <ModeIcon />
            </Button>
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
            <input readOnly className={styles.title} defaultValue={conversations[currConversationId].topic} />
          )}
        </div>
        <div className={styles.subTitle}>{conversations[currConversationId] ? conversations[currConversationId].conList.length : 0} messages width ChatGPT</div>
      </div>

      {!userInfo ? (
        <div className={styles.headerRight}>
          <Button w={70} h={30} className={styles.signUp} onClick={() => dispatch(openModal("signUp"))}>
            <AppRegistrationIcon />
            {locations[location].singUp}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ChatBoxHeader;
