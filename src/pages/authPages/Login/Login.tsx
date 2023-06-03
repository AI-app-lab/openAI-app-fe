import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../index.module.scss";

import { ConfigState } from "../../../store/configSlice";
import { locations } from "../../../localization";
import Button from "../../../components/Button/Button";
import { UserLoginPostDto, UserState, destroyStatus, getLoginVCode, login, loginWithVCode, openModal, saveUserInfo } from "../../../store/userSlice";
import Loading from "../../../components/Loading/Loading";
import { isEmail } from "../../../utils/formValidation";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { err } from "../../../utils/alert";

type Props = {};

const Login = (props: Props) => {
  const dispatch: any = useDispatch();
  const { location } = useSelector((state: ConfigState) => state.config);
  const { status, nextTryTime, userInfo } = useSelector((state: UserState) => state.user);
  const [sendBtnText, setSendBtnText] = useState<number | string>("发送");
  const navigate = useNavigate();
  useEffect(() => {
    //if user is logged in, redirect to /apps
    if (userInfo) {
      navigate("/apps");
      return;
    }
    //if not logged in, check if there is a userInfo in localStorage
    const _userInfo = localStorage.getItem("userInfo");
    //if there is, save it to redux store
    _userInfo && dispatch(saveUserInfo(JSON.parse(_userInfo)));
    // set the countdown timer
    nextTryTime["login"] && countdown();
  }, [nextTryTime["login"], userInfo]);

  const countdown = () => {
    const timer = setInterval(() => {
      const time = new Date().getTime();
      const count = Math.round((nextTryTime["login"] - time) / 1000);
      setSendBtnText(count);
      if (count <= 0) {
        clearInterval(timer);
        setSendBtnText("发送");
      }
    }, 1000);
    return true;
  };
  const [method, setMethod] = useState<"pwd" | "sms">("pwd");
  const methods = {
    pwd: { clsSms: `${styles.loginMethod}`, clsPwd: `${styles.loginMethod}  ${styles.pwdLg}`, placeHolderL1: "请输入邮箱", placeHolderL2: "请输入密码" },
    sms: { clsSms: `${styles.loginMethod} ${styles.smsLg}`, clsPwd: `${styles.loginMethod}`, placeHolderL1: "请输入邮箱", placeHolderL2: "请输入验证码" },
  };

  const [userLoginPostDto, setUserLoginPostDto] = useState<UserLoginPostDto>({ email: "", password: "", verificationCode: "" });

  const handleSubmitPwd = () => {
    if (userLoginPostDto.email === "") {
      err("邮箱不能为空!");
    } else if (!isEmail(userLoginPostDto.email)) {
      err("邮箱格式不正确!");
    } else if (userLoginPostDto.password === "") {
      err("密码不能为空!");
    } else {
      const { email, password } = userLoginPostDto;
      dispatch(login({ email, password }));
    }
  };
  const handleSubmitVCode = () => {
    if (userLoginPostDto.email === "") {
      err("邮箱不能为空!");
    } else if (!isEmail(userLoginPostDto.email)) {
      err("邮箱格式不正确!");
    } else if (userLoginPostDto.verificationCode === "") {
      err("验证码不能为空!");
    } else {
      const { email, verificationCode } = userLoginPostDto;

      dispatch(loginWithVCode({ email, verificationCode: verificationCode as string }));
    }
  };
  const handleSendVcode = () => {
    if (userLoginPostDto.email === "") {
      err("邮箱不能为空!");
    } else if (!isEmail(userLoginPostDto.email)) {
      err("邮箱格式不正确!");
    } else {
      dispatch(getLoginVCode(userLoginPostDto.email));
    }
  };
  const handleSubmit = {
    pwd: handleSubmitPwd,
    sms: handleSubmitVCode,
  };

  return status.status === "loading" ? (
    <div className={styles.modalWrapper}>
      <Loading />
    </div>
  ) : (
    <div onMouseDown={() => dispatch(openModal("close"))} className={styles.modalWrapper}>
      <div onMouseDown={(e) => e.stopPropagation()} className={styles.lgModal}>
        <header>
          <div className={styles.toggle}>
            <span onClick={() => setMethod("pwd")} className={methods[method].clsPwd}>
              密码登录
            </span>
            <span
              onClick={() => {
                setMethod("sms");
              }}
              className={methods[method].clsSms}>
              邮箱验证
            </span>
          </div>
        </header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}>
          <label>
            <input value={userLoginPostDto.email} autoComplete="email" onChange={(e) => setUserLoginPostDto((prev: UserLoginPostDto) => ({ ...prev, email: e.target.value }))} placeholder={methods[method].placeHolderL1} type="email" />
          </label>

          {method === "sms" ? (
            <label>
              <div className={styles.lgCaptchaGroup}>
                <input value={userLoginPostDto.verificationCode} onChange={(e) => setUserLoginPostDto((prev: UserLoginPostDto) => ({ ...prev, verificationCode: e.target.value }))} autoComplete="text" placeholder="验证码" type="text" />
                <Button allow={sendBtnText === "发送"} onClick={handleSendVcode} className={styles.sendBtn}>
                  {sendBtnText}
                </Button>
              </div>
            </label>
          ) : (
            <label>
              <input value={userLoginPostDto.password} autoComplete="curr-password" onChange={(e) => setUserLoginPostDto((prev: UserLoginPostDto) => ({ ...prev, password: e.target.value }))} placeholder={methods[method].placeHolderL2} type="password" />
            </label>
          )}
        </form>

        <Button type="submit" onClick={handleSubmit[method]} className={styles.btn} w={70} h={50}>
          {locations[location].lgConfirm}
        </Button>
        <div className={styles.noAccAndResetPwd}>
          <span onClick={() => navigate("/sign-up")}>没有账号？</span>
          <span>忘记密码</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
