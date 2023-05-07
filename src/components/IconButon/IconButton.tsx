import React from "react";
import styles from "./index.module.scss";

type Props = {
  children: JSX.Element;
};

const IconButton = ({ children }: Props) => {
  return <div className={styles.iconButton}>{children}</div>;
};

export default IconButton;
