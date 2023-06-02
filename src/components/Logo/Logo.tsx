import React from "react";
import styles from "./index.module.scss";

type Props = {
  className?: string;
};

const Logo = ({ className = "" }: Props) => {
  return <div className={`${styles.logo} ${className}`}>Kit Zone</div>;
};

export default Logo;
