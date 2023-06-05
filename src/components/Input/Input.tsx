import React from "react";
import styles from "./index.module.scss";

type Props = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  autoComplete?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  mt?: number;
  id?: string;
  name?: string;
  style?: React.CSSProperties;
};
const Input = ({ style, onChange, name, mt = 0, id, className = "", value = "", autoComplete = "", placeholder = "", type = "text" }: Props) => {
  return (
    <input
      name={name}
      id={id}
      style={{
        marginTop: `${mt}px`,
        ...style,
      }}
      className={`${styles.input} ${className}`}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder={placeholder}
      type={type}
    />
  );
};

export default Input;
