import React from "react";
import styles from "./index.module.scss";

type Props = {
  children: JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
};

const IconButton = ({ onClick, children, className = "" }: Props) => {
  return (
    <div onClick={onClick} className={styles.iconButton + " " + className}>
      {children}
    </div>
  );
};

export default IconButton;
