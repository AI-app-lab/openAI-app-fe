import React, { useEffect } from "react";
import styles from "../index.module.scss";
import SessionCard from "./SessionCard";
import { useSelector, useDispatch } from "react-redux";
import { getRecentConversations, startNewConversation } from "../../../store/chatApiSlice";
import Button from "../../../components/Button/Button";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  isChatSideBox: boolean;
  setIsChatSdBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SideBar = ({ isChatSideBox, setIsChatSdBarOpen }: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRecentConversations());
  }, []);
  const { conversations } = useSelector((state: any) => state.chatApi);
  const { userInfo } = useSelector((state: any) => state.user);
  return (
    <div className={`${styles.sideBar} ${isChatSideBox ? styles.open : ""}`}>
      <div className={styles.sideBarHeader}>
        <div>
          <div>Kit Zone</div>

          <div>强大的AI助理</div>
        </div>
      </div>
      <div onClick={() => setIsChatSdBarOpen(false)} className={styles.sessionCardBox}>
        <div className={styles.sessionCardContainer}>
          {conversations &&
            conversations
              .map((_: never, index: number) => {
                return <SessionCard key={index} cardId={index} title={conversations[index].topic} />;
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
