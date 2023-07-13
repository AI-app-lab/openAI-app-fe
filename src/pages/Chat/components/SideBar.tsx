import React, { useEffect } from "react";
import styles from "../index.module.scss";
import SessionCard from "./SessionCard";
import { useSelector, useDispatch } from "react-redux";
import { ChatApiState, startNewConversation } from "../../../store/chatApiSlice";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  isChatSideBox: boolean;
  setIsChatSdBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: "text" | "oral";
};

const SideBar = ({ type = "text", isChatSideBox, setIsChatSdBarOpen }: Props) => {
  const title = {
    text: "AI助理",
    oral: "口语陪练",
  };
  const dispatch = useDispatch();
  const { conversations, currChatType } = useSelector((state: ChatApiState) => state.chatApi);

  return (
    <div className={`${styles.sideBar} ${isChatSideBox ? styles.open : ""}`}>
      <div className={styles.sideBarHeader}>
        <div>
          <div>Kit Zone</div>

          <div>{title[type]}</div>
        </div>
      </div>
      <div onClick={() => setIsChatSdBarOpen(false)} className={styles.sessionCardBox}>
        <div className={styles.sessionCardContainer}>
          {conversations[currChatType] &&
            conversations[currChatType]
              .map((_: any, index: number) => {
                return <SessionCard key={index} cardId={index} title={conversations[currChatType][index].topic} />;
              })
              .reverse()}
        </div>
      </div>
      <div className={styles.sideBarFooter}>
        <div className={styles.settings}>⚙</div>

        <AddIcon className={styles.addConversationBtn} onClick={() => dispatch(startNewConversation())} />
      </div>
    </div>
  );
};

export default SideBar;
