import React, { useEffect, useState } from "react";
import NavBarLanding from "./components/NavBarLanding";
import { useSelector } from "react-redux";
import { ConfigState } from "../../store/configSlice";

const LandingPage = () => {
  const { theme } = useSelector((state: ConfigState) => state.config);

  return (
    <div className={theme}>
      <NavBarLanding />
    </div>
  );
};

export default LandingPage;
