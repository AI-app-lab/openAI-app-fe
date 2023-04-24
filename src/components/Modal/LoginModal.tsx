import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.scss";

import { ConfigState } from "../../store/configSlice";
import { locations } from "../../localization";
import Button from "../Button/Button";
import { UserLoginPostDto, UserState, destroyStatus, login, openModal } from "../../store/userSlice";
import AlertBubble from "../AlertBubble/AlertBubble";
import Loading from "../Loading/Loading";
import { isEmail } from "../../utils/formValidation";

type Props = {};

const LoginModal = (props: Props) => {
  const dispatch: any = useDispatch();
  const { location } = useSelector((state: ConfigState) => state.config);
  const { status } = useSelector((state: UserState) => state.user);

  useEffect(() => {
    status.status === "failed" && setError(status.message);
    const timeoutId = setTimeout(() => {
      setError("");
      dispatch(destroyStatus());
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [status.status]);

  const [error, setError] = useState<string>("");

  const [method, setMethod] = useState<"pwd" | "sms">("pwd");
  const methods = {
    pwd: { clsSms: `${styles.loginMethod}`, clsPwd: `${styles.loginMethod}  ${styles.pwdLg}`, placeHolderL1: "请输入邮箱", placeHolderL2: "请输入密码" },
    sms: { clsSms: `${styles.loginMethod} ${styles.smsLg}`, clsPwd: `${styles.loginMethod}`, placeHolderL1: "请输入邮箱", placeHolderL2: "请输入验证码" },
  };
  const alert = {};

  const [userLoginPostDto, setUserLoginPostDto] = useState<UserLoginPostDto>({ email: "", password: "" });

  const handleSubmit = () => {
    if (userLoginPostDto.email === "") {
      setError("邮箱不能为空!");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else if (!isEmail(userLoginPostDto.email)) {
      setError("邮箱格式不正确!");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else if (userLoginPostDto.password === "") {
      setError("密码不能为空!");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      dispatch(login(userLoginPostDto));
    }
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
                setError("");
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
                <input autoComplete="text" placeholder="验证码" type="text" />
                <Button className={styles.sendBtn}>发送</Button>
              </div>
            </label>
          ) : (
            <label>
              <input value={userLoginPostDto.password} autoComplete="curr-password" onChange={(e) => setUserLoginPostDto((prev: UserLoginPostDto) => ({ ...prev, password: e.target.value }))} placeholder={methods[method].placeHolderL2} type="password" />
            </label>
          )}
        </form>
        <div className={`${styles.skeleton} ${error && styles.errAlert}`}>{error}</div>

        <Button type="submit" onClick={handleSubmit} className={styles.btn} w={70} h={50}>
          {locations[location].lgConfirm}
        </Button>
        <div className={styles.noAccAndResetPwd}>
          <span onClick={() => dispatch(openModal("signUp"))}>没有账号？</span>
          <span>忘记密码</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
