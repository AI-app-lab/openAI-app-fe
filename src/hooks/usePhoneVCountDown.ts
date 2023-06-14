import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PhoneVRange, UserState } from "../store/userSlice";

export const usePhoneVCountDown = (type: PhoneVRange) => {
  const { status, nextTryTime } = useSelector((state: UserState) => state.user);
  const [sendBtnText, setSendBtnText] = useState<number | string>("发送");
  const countdown = () => {
    const timer = setInterval(() => {
      const time = new Date().getTime();
      const count = Math.round((nextTryTime[type] - time) / 1000);
      setSendBtnText(count);
      if (count <= 0) {
        clearInterval(timer);
        setSendBtnText("发送");
      }
    }, 1000);
  };
  useEffect(() => {
    nextTryTime["RESET_PWD"] && countdown();
  }, [nextTryTime["RESET_PWD"], sendBtnText]);

  return { sendBtnText, status };
};
