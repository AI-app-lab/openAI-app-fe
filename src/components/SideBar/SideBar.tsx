import React, { useEffect } from "react";
import styles from "./index.module.scss";
import Drawer from "@mui/material/Drawer";
import { Switch, Toolbar } from "@mui/material";
import ListItem from "../ListItem/ListItem";
import ListContainer from "../ListContainer/ListContainer";
import LogoutIcon from "@mui/icons-material/Logout";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { useDispatch, useSelector } from "react-redux";
import { ConfigState, changeTheme } from "../../store/configSlice";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

import LightModeSharpIcon from "@mui/icons-material/LightModeSharp";
type Props = {};

const groupTop = [
  {
    name: "应用",
    icon: <GridViewRoundedIcon />,
  },
  {
    name: "购买服务",
    icon: <ShoppingCartRoundedIcon />,
  },
];
const groupBottom = [
  {
    name: "退出登录",
    icon: <LogoutIcon />,
  },
];
const SideBar = (props: Props) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: ConfigState) => state.config);
  const mode = {
    dark: true,
    light: false,
  };
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    theme&&dispatch(changeTheme(theme));

    
  }, []);
  return (
    <div className={styles.sideBarWrapper}>
      <ListContainer className={styles.listContainer}>
        {groupTop.map(({ name, icon }) => {
          return (
            <ListItem className={styles.menuItemTop} key={name}>
              {icon}
            </ListItem>
          );
        })}
      </ListContainer>
      <ListContainer>
   
        <ListItem key="">
          <Switch
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
            defaultChecked={mode[theme]}
          />
        </ListItem>
      </ListContainer>
    </div>
  );
};

export default SideBar;
