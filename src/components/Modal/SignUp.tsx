import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.scss";
import { CpntsCtrlState, openModal } from "../../store/cpntsCtrlSlice";
import { ConfigState } from "../../store/configSlice";
import { locations } from "../../localization";
import Button from "../Button/Button";
type Props = {};

const SignUpModal = (props: Props) => {
  const dispatch: any = useDispatch();
  const { location } = useSelector((state: ConfigState) => state.config);
  return (
    <div onClick={() => dispatch(openModal("close"))} className={styles.modalWrapper}>
      <div onClick={(e) => e.stopPropagation()} className={styles.signUpModal}>
        <h2> {locations[location].loginTitle}</h2>
        <form>
          <label>
            <input placeholder="请输入邮箱" type="email" />
          </label>
          <label>
            <div className={styles.captchaGroup}>
              <input placeholder="验证码" type="text" />
              <Button className={styles.sendBtn}>发送</Button>
            </div>
          </label>
          <label>
            <input placeholder="请输入密码" type="email" />
          </label>
          <Button className={styles.btn} w={70} h={50}>
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
