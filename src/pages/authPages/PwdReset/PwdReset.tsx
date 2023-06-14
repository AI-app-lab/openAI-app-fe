import React, { useState, useEffect, useCallback } from "react";
import AuthModal from "../../../components/AuthModal/AuthModal";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import styles from "../index.module.scss";
import { resetPwd, setAuthLoading, verifyPhoneNum } from "../../../store/userSlice";
import { useDispatch } from "react-redux";
import { usePhoneVCountDown } from "../../../hooks/usePhoneVCountDown";
import { isEmpty, isPhoneNumber } from "../../../utils/formValidation";
import { err, success } from "../../../utils/alert";
import { useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import HashLoader from "../../../components/HashLoader/HashLoader";

type Props = {};

const PwdReset = (props: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return Promise.resolve("");
    }
    return Promise.resolve(await executeRecaptcha("SendVCode"));
  }, [executeRecaptcha]);
  const { sendBtnText, status } = usePhoneVCountDown("RESET_PWD");

  const dispatch: Function = useDispatch();
  const [resetPwdDto, setResetPwdDto] = useState<{ phoneNumber: string; verificationCode: string; password: string; repeatedPwd: string }>({ phoneNumber: "", verificationCode: "", password: "", repeatedPwd: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: "PHONE" | "V_CODE" | "PWD" | "REPEATED_PWD") => {
    const actionDict = {
      PHONE: () => setResetPwdDto((prev) => ({ ...prev, phoneNumber: e.target.value })),
      V_CODE: () => setResetPwdDto((prev) => ({ ...prev, verificationCode: e.target.value })),
      PWD: () => setResetPwdDto((prev) => ({ ...prev, password: e.target.value })),
      REPEATED_PWD: () => setResetPwdDto((prev) => ({ ...prev, repeatedPwd: e.target.value })),
    };
    actionDict[type]();
  };
  const navigate = useNavigate();
  useEffect(() => {
    status.sCode === 200 && navigate("/login", { replace: true, state: { action: "RESET_PWD" } });
  }, [status.sCode]);
  const handleSendVCode = () => {
    if (!isPhoneNumber(resetPwdDto.phoneNumber)) {
      err("手机号格式不正确!");
      return;
    }
    handleReCaptchaVerify().then((reCapToken) => {
      dispatch(verifyPhoneNum({ type: "RESET_PWD", phoneNumber: resetPwdDto.phoneNumber, reCapToken }));
    });
  };
  const handleSubmit = () => {
    if (!isPhoneNumber(resetPwdDto.phoneNumber)) {
      err("手机号格式不正确!");
      return;
    }
    if (isEmpty([resetPwdDto.verificationCode, resetPwdDto.password])) {
      err("验证码或密码不能为空!");
      return;
    }
    if (resetPwdDto.password !== resetPwdDto.repeatedPwd) {
      err("两次密码不一致!");
      return;
    }
    dispatch(setAuthLoading("loading"));
    dispatch(resetPwd({ phoneNumber: resetPwdDto.phoneNumber, password: resetPwdDto.password, verificationCode: resetPwdDto.verificationCode, reCapToken: "" }));
  };

  return status.status === "loading" ? (
    <HashLoader />
  ) : (
    <AuthModal>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.suTitle}>密码重置</div>
        <Input autoComplete="tel" value={resetPwdDto.phoneNumber} onChange={(e) => handleChange(e, "PHONE")} placeholder="手机号" type="tel" />
        <div className={styles.captchaGroup}>
          <Input autoComplete="off" value={resetPwdDto.verificationCode} onChange={(e) => handleChange(e, "V_CODE")} placeholder="验证码" />
          <Button allow={typeof sendBtnText === "string"} onClick={handleSendVCode} className={styles.sendBtn}>
            {sendBtnText}
          </Button>
        </div>
        <Input autoComplete="new-password" value={resetPwdDto.password} onChange={(e) => handleChange(e, "PWD")} className={styles.pwd} placeholder="新密码" type="password" />
        <Input autoComplete="new-password" value={resetPwdDto.repeatedPwd} onChange={(e) => handleChange(e, "REPEATED_PWD")} className={styles.pwd} placeholder="确认密码" type="password" />
        <Button onClick={handleSubmit} className={styles.btn} w={70} h={50}>
          提交
        </Button>
        <div className={styles.noAccAndResetPwd}>
          <span onClick={() => navigate("/login")}> 已有账号？立即登录</span>
          <span onClick={() => navigate("/sign-up")}>没有账号？</span>
        </div>
      </form>
    </AuthModal>
  );
};

export default PwdReset;
