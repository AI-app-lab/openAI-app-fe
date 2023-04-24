import React from "react";
import styles from "./index.module.scss";

import { useSelector } from "react-redux";

import LoginModal from "./LoginModal";
import SignUp from "./SignUp";
import { UserState } from "../../store/userSlice";
type Props = {};

const Modal = (props: Props) => {
  const { currentModal } = useSelector((state: UserState) => state.user);

  const modals = {
    login: <LoginModal />,
    signUp: <SignUp />,
    close: <></>,
  };

  return modals[currentModal];
};

export default Modal;
