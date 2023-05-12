import React from "react";
import styles from "./index.module.scss";
type Props = {
  children?: React.ReactNode;
};

const NavBar = ({ children }: Props) => {
  return <div className={styles.navBarWrapper}>{children}</div>;
};

export default NavBar;
