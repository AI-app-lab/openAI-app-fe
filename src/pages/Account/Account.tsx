import React from "react";
import { useUserInfo } from "../../hooks/useUserInfo";
import styles from "./index.module.scss";
import ListContainer from "../../components/ListContainer/ListContainer";
import ListItem from "../../components/ListItem/ListItem";

import { getFormattedDate } from "../../utils/date";
import Avatar from "../../components/Avatar/Avatar";
import Button from "../../components/Button/Button";
import { useDispatch } from "react-redux";
import { checkOrder } from "../../store/userSlice";

type Props = {};

const Account = (props: Props) => {
  const userInfo = useUserInfo();
  const dispatch: Function = useDispatch();
  const expiredTime = [
    { type: "AI助理", time: userInfo?.expiredTime1 },
    { type: "AI外教", time: userInfo?.expiredTime2 },
    { type: "AI绘图", time: userInfo?.expiredTime3 },
    { type: "AI翻译", time: userInfo?.expiredTime4 },
  ];
  const { header, main, label, labelValue, avatar, title, service, changeName, refreshTime, btn } = styles;
  return (
    <div className={styles.container}>
      <header className={header}>
        <div className={avatar}>
          <Avatar type="user" size="mid" />
          <span
            style={{
              marginLeft: "10px",
            }}>
            {" "}
            {`${userInfo?.username}`}
          </span>
        </div>
        <div className={title}>
          你好，<span>{userInfo?.username}</span>
        </div>
      </header>
      <main className={main}>
        <ListContainer className={styles.actionContainer}>
          <ListItem className={changeName}>
            <Button className={btn}>修改昵称</Button>
          </ListItem>
          <ListItem className={refreshTime}>
            <Button onClick={() => dispatch(checkOrder())} className={btn}>
              刷新时间
            </Button>
          </ListItem>
        </ListContainer>
        <ListContainer className={styles.infoContainer}>
          {expiredTime.map(({ type, time }, index) => {
            return (
              <ListItem className={service} key={type}>
                <span className={label}>{type}</span>
                <span className={labelValue}> {getFormattedDate(time)}</span>
              </ListItem>
            );
          })}
        </ListContainer>
      </main>
    </div>
  );
};

export default Account;
