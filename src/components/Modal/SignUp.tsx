import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.scss";
import { ConfigState } from "../../store/configSlice";
import { locations } from "../../localization";
import Button from "../Button/Button";
import { destroyStatus, openModal, signUp, UserPostDto, UserState, verifyEmail } from "../../store/userSlice";
import Loading from "../Loading/Loading";
import { isEmail } from "../../utils/formValidation";

type Props = {};

const SignUpModal = (props: Props) => {
  const dispatch: any = useDispatch();
  const { location } = useSelector((state: ConfigState) => state.config);
  const [userPostDto, setUserPostDto] = useState<UserPostDto>({ email: "", password: "", verificationCode: "", username: "unset" });
  const [error, setError] = useState<string>("");
  const { status, nextTryTime } = useSelector((state: UserState) => state.user);
  const [sendBtnText, setSendBtnText] = useState<number | string>("发送");

  useEffect(() => {
    nextTryTime["signup"] && countdown();
    setError(status.message);

    const timeoutId = setTimeout(() => {
      setError("");
      dispatch(destroyStatus());
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [nextTryTime["signup"], sendBtnText, status.message]);

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
      setError("邮箱不能为空!");
      return false;
    }
    if (!isEmail(userPostDto.email)) {
      setError("邮箱格式不正确!");
      return false;
    }
    if (!userPostDto.verificationCode && type === "register") {
      setError("验证码不能为空!");
      return false;
    }
    if (!userPostDto.password && type === "register") {
      setError("密码不能为空!");
      return false;
    }
    console.log(5);

    return true;
  };

  const handleSendVcode = () => {
    //todo 验证邮箱格式
    if (!isFormatCorrect()) {
      setTimeout(() => {
        setError("");
      }, 3000);
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
    <div onMouseDown={() => dispatch(openModal("close"))} className={styles.modalWrapper}>
      <div onMouseDown={(e) => e.stopPropagation()} className={styles.signUpModal}>
        <h2> {locations[location].loginTitle}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            <input id="email" value={userPostDto.email} autoComplete="text" onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, email: e.target.value }))} placeholder="请输入邮箱" type="text" />
          </label>
          <label>
            <div className={styles.captchaGroup}>
              <input type="text" id="captcha" name="captcha" autoComplete="off" onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, verificationCode: e.target.value }))} placeholder="验证码" />
              <Button allow={typeof sendBtnText === "string"} onClick={handleSendVcode} className={styles.sendBtn}>
                {sendBtnText}
              </Button>
            </div>
          </label>
          <label>
            <input id="password" autoComplete="current-password" value={userPostDto.password} onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, password: e.target.value }))} placeholder="请输入密码" type="password" />
          </label>
          <div className={`${styles.skeleton} ${error && styles.errAlert}`}>{error}</div>
          <Button onClick={handleSignUp} className={styles.btn} w={70} h={50}>
            {locations[location].singUp}
          </Button>
          <div onClick={() => dispatch(openModal("login"))} className={styles.login}>
            {locations[location].hasAcc}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
