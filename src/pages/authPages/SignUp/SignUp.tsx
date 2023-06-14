import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../index.module.scss";
import { ConfigState } from "../../../store/configSlice";
import { locations } from "../../../localization";
import Button from "../../../components/Button/Button";
import { setAuthLoading, signUp, UserPhoneVerifyDto, UserPostDto, UserState, verifyPhoneNum, VerifyType } from "../../../store/userSlice";
import Loading from "../../../components/Loading/Loading";
import { isEmail, isPhoneNumber } from "../../../utils/formValidation";
import { useNavigate } from "react-router-dom";
import { err } from "../../../utils/alert";
import AuthModal from "../../../components/AuthModal/AuthModal";
import Input from "../../../components/Input/Input";

import HashLoader from "../../../components/HashLoader/HashLoader";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
type Props = {};

const SignUp = (props: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return Promise.resolve("");
    }
    return Promise.resolve(await executeRecaptcha("SendVCode"));
  }, [executeRecaptcha]);
  const dispatch: Function = useDispatch();
  const { location } = useSelector((state: ConfigState) => state.config);
  const [userPostDto, setUserPostDto] = useState<UserPostDto>({ phoneNumber: "", password: "", verificationCode: "", username: "unset", invitedCode: "" });

  const { status, nextTryTime, userInfo } = useSelector((state: UserState) => state.user);
  const [sendBtnText, setSendBtnText] = useState<number | string>("发送");
  const navigate = useNavigate();
  useEffect(() => {
    userInfo && navigate("/apps");
    nextTryTime["SING_UP"] && countdown();
  }, [nextTryTime["SING_UP"], sendBtnText, userInfo]);

  const countdown = () => {
    const timer = setInterval(() => {
      const time = new Date().getTime();
      const count = Math.round((nextTryTime["SING_UP"] - time) / 1000);
      setSendBtnText(count);
      if (count <= 0) {
        clearInterval(timer);
        setSendBtnText("发送");
      }
    }, 1000);
  };
  const isFormatCorrect = (type = "sendVcode") => {
    if (!userPostDto.phoneNumber) {
      err("手机不能为空!");
      return false;
    }
    if (!isPhoneNumber(userPostDto.phoneNumber)) {
      err("手机格式不正确!");
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

  const handleSendVcode = async () => {
    //todo 验证手机格式
    if (!isFormatCorrect()) {
      return;
    }
    dispatch(setAuthLoading("loading"));
    handleReCaptchaVerify().then((token) => {
      console.log(token);

      dispatch(
        verifyPhoneNum({
          type: "SING_UP",
          phoneNumber: userPostDto.phoneNumber,
          reCapToken: token,
        })
      );
    });
  };
  const handleSignUp = () => {
    if (!isFormatCorrect("register")) {
      return;
    }

    dispatch(signUp(userPostDto));
  };
  return status.status === "loading" ? (
    <HashLoader />
  ) : (
    <AuthModal>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.suTitle}> {locations[location].loginTitle}</div>
        <input id="phone" value={userPostDto.phoneNumber} autoComplete="text" onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="请输入手机号" type="text" />

        <div className={styles.captchaGroup}>
          <Input value={userPostDto.verificationCode} type="text" id="captcha" name="captcha" autoComplete="off" onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, verificationCode: e.target.value }))} placeholder="验证码" />
          <Button allow={typeof sendBtnText === "string"} onClick={handleSendVcode} className={styles.sendBtn}>
            {sendBtnText}
          </Button>
        </div>
        <Input className={styles.pwd} id="password" autoComplete="current-password" value={userPostDto.password} onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, password: e.target.value }))} placeholder="请输入密码" type="password" />
        <Input className={styles.pwd} id="text" autoComplete="text" value={userPostDto.invitedCode} onChange={(e) => setUserPostDto((prev: UserPostDto) => ({ ...prev, invitedCode: e.target.value }))} placeholder="邀请码（选填）" type="text" />
        <Button onClick={handleSignUp} className={styles.btn} w={70} h={50}>
          {locations[location].singUp}
        </Button>
        <div onClick={() => navigate("/login")} className={styles.login}>
          {locations[location].hasAcc}
        </div>
      </form>
    </AuthModal>
  );
};

export default SignUp;
