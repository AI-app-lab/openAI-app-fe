import React, { useEffect } from "react";
import NavBar from "../../../components/NavBar/NavBar";
import ListContainer from "../../../components/ListContainer/ListContainer";
import ListItem from "../../../components/ListItem/ListItem";
import Logo from "../../../components/Logo/Logo";
import Button from "../../../components/Button/Button";
import Link from "../../../components/Link/Link";
import styles from "../index.module.scss";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { log } from "console";
import { logout } from "../../../store/userSlice";

type Props = {};

const NavBarLanding = (props: Props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const action = location.state?.action;
    if (action === "LOGOUT") {
      dispatch(logout());
    }
  }, []);
  return (
    <NavBar className={styles.navBar}>
      <ListContainer>
        <ListItem>
          <Link to="/">
            <Logo className={styles.logo} />
          </Link>
        </ListItem>
      </ListContainer>
      <ListContainer fd="row">
        <ListItem className={`${styles.product} ${location.pathname === "/product" ? styles.selected : ""}`}>
          <Link to="product">产品</Link>
        </ListItem>
        <ListItem className={styles.contact}>
          <Link to="contact">联系我们</Link>
        </ListItem>
        <ListItem>
          <Link to="login">
            <Button className={styles.loginBtn} w={120} h={45}>
              登录
            </Button>
          </Link>
        </ListItem>
      </ListContainer>
    </NavBar>
  );
};

export default NavBarLanding;
