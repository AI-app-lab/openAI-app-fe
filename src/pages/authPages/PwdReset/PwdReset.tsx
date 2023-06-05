import React, { useState, useEffect } from "react";
import Modal from "../../../components/Modal/Modal";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import styles from "../index.module.scss";
import { UserState, resetPwd, verifyEmail } from "../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSendEmailCountDown } from "../../../hooks/useSendEmailCountDown";
import { isEmail, isEmpty } from "../../../utils/formValidation";
import { err } from "../../../utils/alert";
import { useNavigate } from "react-router-dom";

type Props = {};

const PwdReset = (props: Props) => {
  const { sendBtnText, status } = useSendEmailCountDown("resetPwd");

  const dispatch: Function = useDispatch();
  const [resetPwdDto, setResetPwdDto] = useState<{ email: string; verificationCode: string; password: string }>({ email: "", verificationCode: "", password: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: "email" | "vCode" | "pwd") => {
    const actionDict = {
      email: () => setResetPwdDto((prev) => ({ ...prev, email: e.target.value })),
      vCode: () => setResetPwdDto((prev) => ({ ...prev, verificationCode: e.target.value })),
      pwd: () => setResetPwdDto((prev) => ({ ...prev, password: e.target.value })),
    };
    actionDict[type]();
  };
  const navigate = useNavigate();
  useEffect(() => {
    status.sCode === 200 && navigate("/login");
  }, [status.sCode]);
  const handleSendVCode = () => {
    if (!isEmail(resetPwdDto.email)) {
      err("邮箱格式不正确!");
      return;
    }

    dispatch(verifyEmail({ type: "resetPwd", email: resetPwdDto.email }));
  };
  const handleSubmit = () => {
    if (!isEmail(resetPwdDto.email)) {
      err("邮箱格式不正确!");
      return;
    }
    if (isEmpty([resetPwdDto.verificationCode, resetPwdDto.password])) {
      err("验证码或密码不能为空!");
      return;
    }
    dispatch(resetPwd({ email: resetPwdDto.email, newPassword: resetPwdDto.password, verificationCode: resetPwdDto.verificationCode }));
  };

  return (
    <Modal>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.suTitle}>密码重置</div>
        <Input autoComplete="email" value={resetPwdDto.email} onChange={(e) => handleChange(e, "email")} placeholder="邮箱" type="email" />
        <div className={styles.captchaGroup}>
          <Input autoComplete="off" value={resetPwdDto.verificationCode} onChange={(e) => handleChange(e, "vCode")} placeholder="验证码" />{" "}
          <Button allow={typeof sendBtnText === "string" && status.status !== "loading"} onClick={handleSendVCode} className={styles.sendBtn}>
            {sendBtnText}
          </Button>
        </div>
        <Input autoComplete="new-password" value={resetPwdDto.password} onChange={(e) => handleChange(e, "pwd")} className={styles.pwd} placeholder="新密码" type="password" />
        <Button onClick={handleSubmit} className={styles.btn} w={70} h={50}>
          提交
        </Button>
      </form>
    </Modal>
  );
};

export default PwdReset;
