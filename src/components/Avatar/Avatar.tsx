import React from "react";
import styles from "./index.module.scss";
import { useUserInfo } from "../../hooks/useUserInfo";

type Props = {
  style?: React.CSSProperties;
  className?: string;
  shape?: "circle" | "square";
  type: "user" | "system";
  size?: "mid" | "small";
};

const Avatar = ({ type, shape = "circle", size = "mid", style, className = "" }: Props) => {
  const userInfo = useUserInfo();
  const AvatarDict = {
    user: (
      <div style={style} className={`${styles.container} ${className} ${styles[size]} ${styles[shape]}`}>
        {userInfo?.username.slice(0, 1)}
      </div>
    ),
    system: (
      <div style={style} className={`${styles.container} ${styles.system} ${className} ${styles[size]} ${styles[shape]}`}>
        AI
      </div>
    ),
  };
  return AvatarDict[type];
};

export default Avatar;
