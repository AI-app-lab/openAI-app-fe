import React from "react";
import styles from "./index.module.scss";
import { nanoid } from "nanoid";

type Props = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  btn?: boolean;
};

const MenuItem = ({ btn = true, onClick, className = "", children }: Props) => {
  return (
    <div onClick={onClick} className={`${styles.menuItem} ${className} ${btn ? styles.btn : ""}`}>
      {children}
    </div>
  );
};

export default MenuItem;
