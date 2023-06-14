import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Drawer from "@mui/material/Drawer";
import { Switch as _Switch, Toolbar } from "@mui/material";
import ListItem from "../ListItem/ListItem";
import ListContainer from "../ListContainer/ListContainer";
import LogoutIcon from "@mui/icons-material/Logout";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { useDispatch, useSelector } from "react-redux";
import { ConfigState, changeTheme } from "../../store/configSlice";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import LightModeSharpIcon from "@mui/icons-material/LightModeSharp";
import { nanoid } from "nanoid";
import { Link, useLocation } from "react-router-dom";
import { Button } from "antd";
import { CpntsState, setIsSideBarOpen } from "../../store/cpntsSlice";
import { breakPoints } from "../../styles/global";

const groupTop = [
  {
    name: "应用",
    icon: <GridViewRoundedIcon />,
    route: "/apps",
  },
  {
    name: "购买服务",
    icon: <ShoppingCartRoundedIcon />,
    route: "shop",
  },
];

const SideBar = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { theme } = useSelector((state: ConfigState) => state.config);
  const { isSideBarOpen } = useSelector((state: CpntsState) => state.cpnts);
  const mode = {
    dark: true,
    light: false,
  };
  const Switch = (
    <_Switch
      onChange={(e) => {
        e.target.checked ? dispatch(changeTheme("dark")) : dispatch(changeTheme("light"));
      }}
      checkedIcon={
        <DarkModeIcon
          sx={{
            color: "black !important",
          }}
        />
      }
      icon={<LightModeSharpIcon />}
      size="medium"
      sx={{
        display: "flex !important",
        alignItems: "center !important",

        height: "36px",
        width: "63px",
        "& .MuiSwitch-switchBase": {
          display: "flex !important",
          alignItems: "center !important",
          width: "36px",

          height: "100%",

          backgroundColor: `${theme === "dark" ? "white" : "black"} !important`,
        },
        "& .MuiSwitch-track": {
          borderRadius: "20px",
          height: "20px",
        },
        "& .Mui-checked": {
          transform: "translateX(27px) !important",
          "& + .MuiSwitch-track": {
            backgroundColor: `${theme === "dark" ? "white" : "black"} !important`,
          },
        },
      }}
      checked={mode[theme]}
    />
  );

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    theme && dispatch(changeTheme(theme));
  }, []);
  return (
    <div
      onClick={() => {
        dispatch(setIsSideBarOpen(false));
      }}
      className={`${styles.sideBarWrapper} ${isSideBarOpen ? "" : styles.closed} `}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`${styles.sideBar} ${isSideBarOpen ? "" : styles.closed}`}>
        <ListContainer className={styles.listContainer}>
          {groupTop.map(({ route, name, icon }) => {
            return (
              <ListItem
                onClick={() => {
                  window.innerWidth < breakPoints.small && dispatch(setIsSideBarOpen(false));
                }}
                className={`${styles.menuItemTop} ${pathname === route ? styles.selected : ""}`}
                key={nanoid()}>
                <Link to={route} style={{ color: "inherit", width: "100%", height: "100%" }}>
                  {icon}
                </Link>
              </ListItem>
            );
          })}
        </ListContainer>
        <ListContainer>
          <ListItem>{Switch}</ListItem>
        </ListContainer>
      </div>
    </div>
  );
};

export default SideBar;
