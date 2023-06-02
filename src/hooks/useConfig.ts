import React from "react";
import { ConfigState } from "../store/configSlice";
import { useSelector } from "react-redux";
const useLanguage = () => {
  const { location } = useSelector((state: ConfigState) => state.config);
  return location;
};
const useTheme = () => {
  const { theme } = useSelector((state: ConfigState) => state.config);
  return theme;
};
export { useLanguage, useTheme };
