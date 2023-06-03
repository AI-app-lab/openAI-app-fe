import React, { useState, useEffect } from "react";
import { useUserInfo } from "../../hooks/useUserInfo";
import styles from "./index.module.scss";
import ListContainer from "../../components/ListContainer/ListContainer";
import ListItem from "../../components/ListItem/ListItem";
import Button from "../../components/Button/Button";
import { getFormattedDate } from "../../utils/date";
import { useDispatch, useSelector } from "react-redux";
import { UserPostDto, UserState, resetPwd, verifyEmail } from "../../store/userSlice";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";

type Props = {};

const Account = (props: Props) => {
  const userInfo = useUserInfo();
  const { status, nextTryTime } = useSelector((state: UserState) => state.user);
  const [sendBtnText, setSendBtnText] = useState<number | string>("发送");
  const [isResetFormOpen, setIsResetFormOpen] = useState<boolean>(false);
  const [userPostDto, setUserPostDto] = useState<UserPostDto>({ email: userInfo?.email ? userInfo.email : "", password: "", verificationCode: "", username: "unset" });
  const [isPwdCanSet, setIsPwdCanSet] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const dispatch: Function = useDispatch();
  const countdown = () => {
    const timer = setInterval(() => {
      const time = new Date().getTime();
      const count = Math.round((nextTryTime["resetPwd"] - time) / 1000);
      setSendBtnText(count);
      if (count <= 0) {
        clearInterval(timer);
        setSendBtnText("发送");
      }
    }, 1000);
  };
  const expiredTime = [
    { type: "AI助手", time: userInfo?.expireTime1 },
    { type: "口语陪练", time: userInfo?.expireTime2 },
    { type: "AI绘图", time: userInfo?.expireTime3 },
    { type: "AI翻译", time: userInfo?.expireTime4 },
  ];
  useEffect(() => {
    nextTryTime["resetPwd"] && countdown();
  }, [nextTryTime["resetPwd"], sendBtnText]);

  return (
    <div className={styles.container}>
      <header>
        <h2>账户信息</h2>
      </header>

      <ListContainer className={styles.infoContainer}>
        <ListItem className={styles.email}>
          <span>邮箱</span>
          <span>{userInfo?.email}</span>
        </ListItem>
        <ListItem className={styles.username}>
          <span>用户名</span>
          <span>{userInfo?.username}</span>
        </ListItem>
        <ListItem className={styles.time}>
          <ListContainer className={styles.timeContainer}>
            <ListItem className={styles.timeTitle}>
              <span
                style={{
                  color: "#f1a746",
                }}>
                到期时间：
              </span>
            </ListItem>
            {expiredTime.map(({ type, time }, index) => {
              return (
                <ListItem className={styles.service} key={type}>
                  <span>{type}</span>
                  <span>{getFormattedDate(time)}</span>
                </ListItem>
              );
            })}
          </ListContainer>
        </ListItem>
        <ListContainer className={styles.pwdResetContainer}>
          <ListItem>
            <Button onClick={() => setIsResetFormOpen(!isResetFormOpen)} className={styles.pwdReset} w={100}>
              修改密码
              <KeyboardArrowDownSharpIcon />
            </Button>
          </ListItem>
          <ListContainer className={`${styles.pwdResetForm} ${isResetFormOpen ? "" : styles.hide}`}>
            <ListItem className={styles.vCodeGroup}>
              <input
                disabled={disabled}
                style={{
                  cursor: disabled ? "not-allowed" : "auto",
                }}
                onChange={(e) => {
                  setUserPostDto((prev) => ({
                    ...prev,
                    verificationCode: e.target.value,
                  }));
                  setDisabled(false);
                }}
                placeholder="验证码"></input>
              <Button
                className={styles.sendBtn}
                w={50}
                allow={typeof sendBtnText === "string" && status.status !== "loading"}
                onClick={() => {
                  dispatch(verifyEmail({ type: "resetPwd", email: userInfo?.email || "" }));

                  setDisabled(false);
                  setIsPwdCanSet(true);
                }}>
                {sendBtnText}
              </Button>
            </ListItem>
            <ListItem className={`${styles.newPwd} ${isPwdCanSet ? "" : styles.hide}`}>
              <input
                type="password"
                onChange={(e) => {
                  setUserPostDto((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
                disabled={disabled}
                placeholder="新密码"></input>
            </ListItem>
            <ListItem>
              <Button
                allow={!disabled}
                w={50}
                className={styles.confirmBtn}
                onClick={() => {
                  const { password, verificationCode } = userPostDto;
                  dispatch(resetPwd({ email: userInfo?.email || "", newPassword: password, verificationCode }));
                }}>
                确认
              </Button>
            </ListItem>
          </ListContainer>
        </ListContainer>
      </ListContainer>
    </div>
  );
};

export default Account;
