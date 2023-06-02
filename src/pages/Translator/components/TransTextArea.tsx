import React from "react";
import styles from "../index.module.scss";
type Props = {
  defaultValue?: string;
  type: "user" | "system";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const TransTextArea = ({ defaultValue, type, value, onChange }: Props) => {
  const dict = {
    user: "我是用户",
    system: "我是系统",
  };
  return <textarea readOnly={type === "system"} className={styles.textarea} onChange={onChange} defaultValue={defaultValue} value={value} />;
};

export default TransTextArea;
