import React, { ReactNode, useEffect, useState } from "react";
import styles from "./index.module.scss";
import "../../styles/global.scss";
import SideBar from "../SideBar/SideBar";
import { useSelector } from "react-redux";
import { ConfigState } from "../../store/configSlice";

import { Outlet } from "react-router-dom";

import NavBarHome from "../NavBarHome/NavBarHome";
type Props = {};

const Layout = ({}: Props) => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const { theme } = useSelector((state: ConfigState) => state.config);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      window.innerWidth < 768 ? setIsSideBarOpen(false) : setIsSideBarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      <NavBarHome setIsSideBarOpen={setIsSideBarOpen} isSideBarOpen={isSideBarOpen} />
      {/* <Snackbar
        sx={{
          zIndex: 9999,
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={true}
        message="I love snacks"
      /> */}
      <div className={`${styles.container} `}>
        <SideBar setIsSideBarOpen={setIsSideBarOpen} isSideBarOpen={isSideBarOpen} />
        <div className={`${styles.main} ${isSideBarOpen ? "" : styles.noMarginLeft}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
