import React from "react";
import styles from "./index.module.scss";

type Props = {
  children: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const IconButton = ({ onClick, children }: Props) => {
  return (
    <div onClick={onClick} className={styles.iconButton}>
      {children}
    </div>
  );
};

export default IconButton;
