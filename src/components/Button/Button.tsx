import React from "react";
import styles from "./index.module.scss";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
type Props = {
  children: any;
  w?: number;
  h?: number;
  onClick?: () => void;
  className?: string;
};

const Button = ({ children, w, h, onClick, className }: Props) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: w,
        height: h,
      }}
      className={`${styles.btn} ${className}`}>
      {children}
    </button>
  );
};
export default Button;
