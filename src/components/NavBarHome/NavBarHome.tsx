import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import ListContainer from "../ListContainer/ListContainer";
import ListItem from "../ListItem/ListItem";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";

import { useDispatch, useSelector } from "react-redux";

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import IconButton from "../IconButon/IconButton";
import NavBar from "../NavBar/NavBar";
import Logo from "../Logo/Logo";
import Menu from "../Menu/Menu";
import MenuItem from "../Menu/MenuItem";
import { useNavigate } from "react-router-dom";
import { CpntsState, setIsSideBarOpen } from "../../store/cpntsSlice";
import { useUserInfo } from "../../hooks/useUserInfo";
import Link from "../Link/Link";
import Avatar from "../Avatar/Avatar";
import { info } from "../../utils/alert";

type Props = {};

const NavBarHome = () => {
  const { isSideBarOpen } = useSelector((state: CpntsState) => state.cpnts);

  const userInfo = useUserInfo();
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current?.contains(e.target as any)) return;
      setOpen(false);
    };

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userInfo]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <NavBar>
        <ListContainer className={styles.listContainer} fd="row">
          {
            <ListItem onClick={() => dispatch(setIsSideBarOpen(!isSideBarOpen))} className={styles.sdBarCallBtn}>
              {isSideBarOpen ? (
                <IconButton>
                  <AiOutlineMenuFold size={20} />
                </IconButton>
              ) : (
                <IconButton>
                  <AiOutlineMenuUnfold size={20} />
                </IconButton>
              )}
            </ListItem>
          }
          <ListItem className={styles.logoContainer} onClick={() => navigate("/apps")}>
            <Logo />
          </ListItem>
        </ListContainer>

        <ListContainer innerRef={menuRef} className={styles.listContainer} fd="row">
          <Menu open={open} className={styles.menu}>
            <MenuItem btn={false}>
              <ListContainer className={styles.menuItemFirst} fd="column">
                <ListItem btn={false} className={styles.name}>
                  {userInfo?.username}
                </ListItem>
                <ListItem btn={false} className={styles.email}>
                  {userInfo?.phoneNumber}
                </ListItem>
              </ListContainer>
            </MenuItem>
            <MenuItem onClick={() => setOpen(!open)}>
              <Link to="shop">资费</Link>
            </MenuItem>
            <MenuItem onClick={() => setOpen(!open)}>
              <Link to="account">账户管理</Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/", { replace: true, state: { action: "LOGOUT" } });
                info("已退出登录");
              }}>
              登出
            </MenuItem>
          </Menu>
          <ListItem onClick={() => setOpen(!open)}>
            <Avatar style={{ marginRight: "20px" }} type="user" />
          </ListItem>
          <ListItem>
            <IconButton onClick={() => setOpen(!open)} children={<KeyboardArrowDownSharpIcon />} />
          </ListItem>
        </ListContainer>
      </NavBar>
    </>
  );
};

export default NavBarHome;
