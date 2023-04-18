import React from "react";
import styles from "./index.module.scss";

import { useSelector } from "react-redux";

import { CpntsCtrlState } from "../../store/cpntsCtrlSlice";
import LoginModal from "./LoginModal";
import SignUp from "./SignUp";
type Props = {};

const Modal = (props: Props) => {
  const { currentModal } = useSelector((state: CpntsCtrlState) => state.cpntsCtrl);

  const modals = {
    login: <LoginModal />,
    signUp: <SignUp />,
    close: <></>,
  };

  return modals[currentModal];
};

export default Modal;
