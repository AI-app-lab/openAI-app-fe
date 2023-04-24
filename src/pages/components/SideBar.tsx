import React, { useEffect } from "react";
import styles from "../index.module.scss";
import SessionCard from "./SessionCard";
import { useSelector, useDispatch } from "react-redux";
import { getRecentConversations, startNewConversation } from "../../store/chatApiSlice";
import Button from "../../components/Button/Button";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AddIcon from "@mui/icons-material/Add";

type Props = {};

const SideBar = (props: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRecentConversations());
  }, []);
  const { conversations } = useSelector((state: any) => state.chatApi);
  const { userInfo } = useSelector((state: any) => state.user);
  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBarHeader}>
        <div>
          <div>Chat Genius</div>

          <div>强大的AI助理</div>
        </div>
        <Button w={36} h={36} className={styles.addConversationBtn} onClick={() => dispatch(startNewConversation())}>
          <AddIcon />
        </Button>
      </div>
      <div className={styles.sessionCardBox}>
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
        <Button w={36} h={36} className={styles.settings}>
          ⚙
        </Button>
        {userInfo && (
          <div className={styles.userType}>
            <PersonOutlineIcon />
            {userInfo.username}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
