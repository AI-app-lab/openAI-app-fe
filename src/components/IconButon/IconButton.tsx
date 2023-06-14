import React from "react";
import styles from "./index.module.scss";

type Props = {
  children: JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  allow?: boolean;
};

const IconButton = ({ allow = true, onClick, children, className = "" }: Props) => {
  return (
    <div onClick={allow ? onClick : () => {}} className={`${styles.iconButton} ${className} ${allow ? "" : styles.disabled}`}>
      {children}
    </div>
  );
};

export default IconButton;
