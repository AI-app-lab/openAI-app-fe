import React, { useState, useEffect } from "react";

import styles from "./index.module.scss";

type Props = {
  children: React.ReactNode;
};

const Modal = ({ children }: Props) => {
  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
};

export default Modal;
