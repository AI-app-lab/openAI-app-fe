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
import { nanoid } from "nanoid";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import IconButton from "../IconButon/IconButton";

type Props = {
  isSideBarOpen: boolean;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavBar = ({ isSideBarOpen, setIsSideBarOpen }: Props) => {
  const { userInfo } = useSelector((state: UserState) => state.user);
  const { location } = useSelector((state: ConfigState) => state.config);

  const dispatch = useDispatch();
  return (
    <div className={styles.navBarWrapper}>
      <ListContainer className={styles.listContainer} fd="row">
        {
          <ListItem onClick={() => setIsSideBarOpen(!isSideBarOpen)} className={styles.sdBarCallBtn}>
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
        <ListItem className={styles.logo}>Kit Zone</ListItem>
      </ListContainer>

      <ListContainer className={styles.listContainer} fd="row">
        {!userInfo ? (
          <ListItem>
            <div className={styles.headerRight}>
              <Button w={70} h={30} className={styles.signUp} onClick={() => dispatch(openModal("signUp"))}>
                <AppRegistrationIcon />
                {locations[location].singUp}
              </Button>
            </div>
          </ListItem>
        ) : (
          <>
            <ListItem key={nanoid()} className={styles.avatar}>
              L
            </ListItem>
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
