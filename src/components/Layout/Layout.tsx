import React, { ReactNode } from "react";
import styles from "./index.module.scss";
import "../../styles/global.scss";
import SideBar from "../SideBar/SideBar";
import NavBar from "../NavBar/NavBar";
import { useSelector } from "react-redux";
import { ConfigState } from "../../store/configSlice";
import Modal from "../Modal/Modal";
import { Snackbar } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import { GuardRounded } from "../../router";
type Props = {};

const Layout = ({}: Props) => {
  const { theme } = useSelector((state: ConfigState) => state.config);
  return (
    <div className={theme}>
      <Modal />
      <NavBar />
      {/* <Snackbar
        sx={{
          zIndex: 9999,
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={true}
        message="I love snacks"
      /> */}
      <div className={`${styles.container}`}>
        <SideBar />
        <div className={`${styles.main}`}>
          <GuardRounded />
        </div>
      </div>
    </div>
  );
};

export default Layout;
