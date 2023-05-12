import React from "react";
import NavBarLanding from "./components/NavBarLanding";
import { useSelector } from "react-redux";
import { ConfigState } from "../../store/configSlice";

type Props = {};

const LandingPage = (props: Props) => {
  const { theme } = useSelector((state: ConfigState) => state.config);
  return (
    <div className={theme}>
      <NavBarLanding />
    </div>
  );
};

export default LandingPage;
