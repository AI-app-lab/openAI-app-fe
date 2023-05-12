import React from "react";
import NavBar from "../../../components/NavBar/NavBar";
import ListContainer from "../../../components/ListContainer/ListContainer";
import ListItem from "../../../components/ListItem/ListItem";
import Logo from "../../../components/Logo/Logo";
import Button from "../../../components/Button/Button";
import Link from "../../../components/Link/Link";
import styles from "../index.module.scss";

type Props = {};

const NavBarLanding = (props: Props) => {
  return (
    <NavBar>
      <ListContainer>
        <ListItem>
          <Logo />
        </ListItem>
      </ListContainer>
      <ListContainer>
        <ListItem>
          <Link to="login">
            <Button className={styles.loginBtn} w={80} h={36}>
              登录
            </Button>
          </Link>
        </ListItem>
      </ListContainer>
    </NavBar>
  );
};

export default NavBarLanding;
