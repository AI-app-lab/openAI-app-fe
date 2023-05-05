import React from "react";
import styles from "./index.module.scss";

type Props = {
  children: React.ReactNode;
  className?: string;
  fd?: "row" | "row-reverse" | "column" | "column-reverse";
};

const ListContainer = ({ fd = "column", className = "", children }: Props) => {
  return (
    <div style={{ flexDirection: fd }} className={`${styles.listContainer} ${className}`}>
      {children}
    </div>
  );
};

export default ListContainer;
