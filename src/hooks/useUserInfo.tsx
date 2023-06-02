import React from "react";
import { useSelector } from "react-redux";
import { UserState } from "../store/userSlice";
//use user's email
export const useUserInfo = () => {
  const { userInfo } = useSelector((state: UserState) => state.user);
  return userInfo;
};
