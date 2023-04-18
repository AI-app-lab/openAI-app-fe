import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.scss";
import { CpntsCtrlState, openModal } from "../../store/cpntsCtrlSlice";
import { ConfigState } from "../../store/configSlice";
import { locations } from "../../localization";
import Button from "../Button/Button";

type Props = {};

const LoginModal = (props: Props) => {
  const dispatch: any = useDispatch();
  const { location } = useSelector((state: ConfigState) => state.config);
  const [method, setMethod] = useState<"pwd" | "sms">("pwd");
  const methods = {
    pwd: { clsSms: `${styles.loginMethod}`, clsPwd: `${styles.loginMethod}  ${styles.pwdLg}`, requestMethod: () => null, placeHolderL1: "请输入邮箱", placeHolderL2: "请输入密码" },
    sms: { clsSms: `${styles.loginMethod} ${styles.smsLg}`, clsPwd: `${styles.loginMethod}`, requestMethod: () => null, placeHolderL1: "请输入邮箱", placeHolderL2: "请输入验证码" },
  };
  return (
    <div onClick={() => dispatch(openModal("close"))} className={styles.modalWrapper}>
      <div onClick={(e) => e.stopPropagation()} className={styles.lgModal}>
        <header>
          <div className={styles.toggle}>
            <span onClick={() => setMethod("pwd")} className={methods[method].clsPwd}>
              密码登录
            </span>
            <span onClick={() => setMethod("sms")} className={methods[method].clsSms}>
              邮箱验证
            </span>
          </div>
        </header>
        <form>
          <label>
            <input placeholder={methods[method].placeHolderL1} type="tel" />
          </label>
          <label>
            {method === "sms" ? (
              <div className={styles.lgCaptchaGroup}>
                <input placeholder="验证码" type="text" />
                <Button className={styles.sendBtn}>发送</Button>
              </div>
            ) : (
              <input placeholder={methods[method].placeHolderL2} type="password" />
            )}
          </label>
        </form>

        <div className={styles.noAccAndResetPwd}>
          <span>没有账号？</span>
          <span>忘记密码</span>
        </div>

        <Button className={styles.btn} w={70} h={50}>
          {locations[location].lgConfirm}
        </Button>
      </div>
    </div>
  );
};

export default LoginModal;
