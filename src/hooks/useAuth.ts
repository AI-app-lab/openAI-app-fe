import React from "react";
import { useSelector } from "react-redux";
import { UserState } from "../store/userSlice";
import { lsGet } from "../utils/localstorage";

export const useAuth = () => {
  const { userInfo } = useSelector((state: UserState) => state.user);
  const _userInfo = lsGet("userInfo");
  if (!userInfo && !_userInfo) {
    return false;
  }
  return true;
};
