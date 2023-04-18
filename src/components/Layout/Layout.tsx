import React, { ReactNode } from "react";
import styles from "./index.module.scss";
import "../../styles/global.scss";
type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return <div className={`${styles.layout} dark`}>{children}</div>;
};

export default Layout;
