import React from "react";
import styles from "./index.module.scss";
type Props = {
  children?: React.ReactNode;
  className?: string;
};

const NavBar = ({ children, className = "" }: Props) => {
  return <div className={`${styles.navBarWrapper} ${className}`}>{children}</div>;
};

export default NavBar;
