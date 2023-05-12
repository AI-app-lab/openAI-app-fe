import React, { useRef, useEffect } from "react";
import styles from "./index.module.scss";
import ListContainer from "../ListContainer/ListContainer";

type Props = {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  open?: boolean;
  innerRef?: React.RefObject<HTMLDivElement>;
};

const Menu = ({ innerRef, open = false, style = undefined, children, className = "" }: Props) => {
  if (open === false) {
    return <></>;
  }
  return (
    <ListContainer innerRef={innerRef} style={style} className={`${styles.menuWrapper} ${className}`}>
      {children}
    </ListContainer>
  );
};

export default Menu;
