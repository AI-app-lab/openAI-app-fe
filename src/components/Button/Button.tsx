import React from "react";
import styles from "./index.module.scss";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
type Props = {
  children?: any;
  w?: number;
  h?: number;
  onClick?: any;
  className?: string;
  type?: "submit" | "button";
  allow?: boolean;
};

const Button = ({ allow = true, type, children, w, h, onClick, className }: Props) => {
  return (
    <button
      type={type}
      onClick={allow ? onClick : () => {}} // if allow is false, then onClick will not be called
      style={{
        width: w,
        height: h,
      }}
      className={`${styles.btn} ${className} ${allow ? "" : styles.btnLoading}`}>
      {children}
    </button>
  );
};
export default Button;
