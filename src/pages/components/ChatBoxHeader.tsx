import React, { useState } from "react";
import styles from "../index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import { locations } from "../../localization";
import { ConfigState } from "../../store/configSlice";
import Model from "../../components/Modal/Modal";
import { openModal } from "../../store/cpntsCtrlSlice";

import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
type Props = {};

const ChatBoxHeader = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { conversations, currConversationId } = useSelector((state: any) => state.chatApi);
  const { location } = useSelector((state: ConfigState) => state.config);
  return (
    <div className={styles.chatBoxHeader}>
      <div>
        <div className={styles.title}>New Conversation</div>

        <div className={styles.subTitle}>{conversations[currConversationId] ? conversations[currConversationId].length : 0} messages width ChatGPT</div>
      </div>

      <div className={styles.headerRight}>
        <Button w={70} h={30} className={styles.signUp} onClick={() => dispatch(openModal("signUp"))}>
          <AppRegistrationIcon />
          {locations[location].singUp}
        </Button>
      </div>
    </div>
  );
};

export default ChatBoxHeader;
