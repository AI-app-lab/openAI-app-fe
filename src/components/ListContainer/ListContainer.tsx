import React from "react";
import styles from "./index.module.scss";

type Props = {
  children: React.ReactNode;
  className?: string;
  fd?: "row" | "row-reverse" | "column" | "column-reverse";
  style?: React.CSSProperties;
  innerRef?: React.RefObject<HTMLDivElement>;
};
const ListContainer = ({ innerRef, style, fd = "column", className = "", children }: Props) => {
  return (
    <div ref={innerRef} style={{ flexDirection: fd, ...style }} className={`${styles.listContainer} ${className}`}>
      {children}
    </div>
  );
};

export default ListContainer;
