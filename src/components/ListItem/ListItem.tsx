import React from "react";
import styles from "./index.module.scss";
import { nanoid } from "nanoid";

type Props = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
};

const ListItem = ({ onClick, className = "", children }: Props) => {
  return (
    <div onClick={onClick} className={`${styles.listItem} ${className}`}>
      {children}
    </div>
  );
};

export default ListItem;
