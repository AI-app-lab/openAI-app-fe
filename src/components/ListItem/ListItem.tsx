import React from "react";
import styles from "./index.module.scss";

type Props = {
  children?: React.ReactNode;
  key: number | string;
  className?: string;
};

const ListItem = ({ className = "", key, children }: Props) => {
  return (
    <div key={key} className={`${styles.listItem} ${className}`}>
      {children}
    </div>
  );
};

export default ListItem;
