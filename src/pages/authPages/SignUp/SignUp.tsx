import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../index.module.scss";
import { ConfigState } from "../../../store/configSlice";
import { locations } from "../../../localization";
import Button from "../../../components/Button/Button";
import { destroyStatus, openModal, signUp, UserPostDto, UserState, verifyEmail } from "../../../store/userSlice";
import Loading from "../../../components/Loading/Loading";
import { isEmail } from "../../../utils/formValidation";
import { useNavigate } from "react-router-dom";
import { err } from "../../../utils/alert";
import Modal from "../../../components/Modal/Modal";
import Input from "../../../components/Input/Input";

type Props = {};

const SignUp = (props: Props) => {
  const dispatch: any = useDispatch();
  const { location } = useSelector((state: ConfigState) => state.config);
  const [userPostDto, setUserPostDto] = useState<UserPostDto>({ email: "", password: "", verificationCode: "", username: "unset" });

  const { status, nextTryTime, userInfo } = useSelector((state: UserState) => state.user);
  const [sendBtnText, setSendBtnText] = useState<number | string>("发送");
  const navigate = useNavigate();
  useEffect(() => {
    userInfo && navigate("/apps");
    nextTryTime["signup"] && countdown();
  }, [nextTryTime["signup"], sendBtnText, userInfo]);

  const countdown = () => {
    const timer = setInterval(() => {
      const time = new Date().getTime();
      const count = Math.round((nextTryTime["signup"] - time) / 1000);
      setSendBtnText(count);
      if (count <= 0) {
        clearInterval(timer);
        setSendBtnText("发送");
      }
    }, 1000);
  };
  const isFormatCorrect = (type = "sendVcode") => {
    if (!userPostDto.email) {
      err("邮箱不能为空!");
      return false;
    }
    if (!isEmail(userPostDto.email)) {
      err("邮箱格式不正确!");
      return false;
    }
    if (!userPostDto.verificationCode && type === "register") {
      err("验证码不能为空!");
      return false;
    }
    if (!userPostDto.password && type === "register") {
      err("密码不能为空!");
      return false;
    }

    return true;
  };

  const handleSendVcode = () => {
    //todo 验证邮箱格式
    if (!isFormatCorrect()) {
      return;
    }

    dispatch(verifyEmail({ email: userPostDto.email }));
  };
  const handleSignUp = () => {
    if (!isFormatCorrect("register")) {
      return;
    }
    dispatch(signUp(userPostDto));
  };
  return status.status === "loading" ? (
    <div className={styles.modalWrapper}>
      <Loading />
    </div>
  ) : (
    <Modal>
      <div className={styles.suTitle}> {locations[location].loginTitle}</div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input id="email" value={userPostDto.email} autoComplete="text" onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, email: e.target.value }))} placeholder="请输入邮箱" type="text" />

        <div className={styles.captchaGroup}>
          <Input type="text" id="captcha" name="captcha" autoComplete="off" onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, verificationCode: e.target.value }))} placeholder="验证码" />
          <Button allow={typeof sendBtnText === "string"} onClick={handleSendVcode} className={styles.sendBtn}>
            {sendBtnText}
          </Button>
        </div>
        <Input className={styles.pwd} id="password" autoComplete="current-password" value={userPostDto.password} onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, password: e.target.value }))} placeholder="请输入密码" type="password" />
        <Button onClick={handleSignUp} className={styles.btn} w={70} h={50}>
          {locations[location].singUp}
        </Button>
        <div onClick={() => navigate("/login")} className={styles.login}>
          {locations[location].hasAcc}
        </div>
      </form>
    </Modal>
  );
};

export default SignUp;
