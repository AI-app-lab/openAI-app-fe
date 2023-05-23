import React from "react";
import { UserState } from "../store/userSlice";
import { useSelector } from "react-redux";

export const useToken = () => {
  const { userInfo } = useSelector((state: UserState) => state.user);

  if (!userInfo?.token) {
    return null;
  }
  return userInfo.token;
};
