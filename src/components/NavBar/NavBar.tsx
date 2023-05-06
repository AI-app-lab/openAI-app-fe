import React, { useEffect } from "react";
import styles from "./index.module.scss";
import ListContainer from "../ListContainer/ListContainer";
import ListItem from "../ListItem/ListItem";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";

import { useDispatch, useSelector } from "react-redux";
import { UserState, openModal } from "../../store/userSlice";
import { ConfigState } from "../../store/configSlice";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { locations } from "../../localization";
import Button from "../Button/Button";

type Props = {};

const NavBar = (props: Props) => {
  const { userInfo } = useSelector((state: UserState) => state.user);
  const { location } = useSelector((state: ConfigState) => state.config);

  const dispatch = useDispatch();
  return (
    <div className={styles.navBarWrapper}>
      <ListContainer className={styles.listContainer} fd="row">
        <ListItem key="" className={styles.logo}>Kit Zone</ListItem>
      </ListContainer>

      <ListContainer className={styles.listContainer} fd="row">
        {!userInfo ? (
          <ListItem key="">
            <div className={styles.headerRight}>
              <Button w={70} h={30} className={styles.signUp} onClick={() => dispatch(openModal("signUp"))}>
                <AppRegistrationIcon />
                {locations[location].singUp}
              </Button>
            </div>
          </ListItem>
        ) : (
          <>
            <ListItem key="" className={styles.avatar}>L</ListItem>
            <ListItem key="">
              <KeyboardArrowDownSharpIcon />
            </ListItem>
          </>
        )}
      </ListContainer>
    </div>
  );
};

export default NavBar;
