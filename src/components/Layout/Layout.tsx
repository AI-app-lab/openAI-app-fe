import React, { ReactNode, useEffect, useState } from "react";
import styles from "./index.module.scss";
import "../../styles/global.scss";
import SideBar from "../SideBar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { ConfigState } from "../../store/configSlice";

import { Outlet } from "react-router-dom";

import NavBarHome from "../NavBarHome/NavBarHome";
import { CpntsState, setIsSideBarOpen } from "../../store/cpntsSlice";
import { saveUserInfo } from "../../store/userSlice";
import { lsGet } from "../../utils/localstorage";
type Props = {};

const Layout = ({}: Props) => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const { theme } = useSelector((state: ConfigState) => state.config);
  const { isSideBarOpen } = useSelector((state: CpntsState) => state.cpnts);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      window.innerWidth < 768 && dispatch(setIsSideBarOpen(false));
    };
    handleResize();

    window.onresize = handleResize;

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      <NavBarHome />
      {/* <Snackbar
        sx={{
          zIndex: 9999,
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={true}
        message="I love snacks"
      /> */}
      <div className={`${styles.container} `}>
        <SideBar />
        <div className={`${styles.main} ${isSideBarOpen ? "" : styles.noMarginLeft}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
