import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { saveUserInfo } from "../../store/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const userInfoDto = JSON.parse(localStorage.getItem("userInfo") as string);
      dispatch(saveUserInfo(userInfoDto));
    } catch (error) {
      console.log(error);
    }
  }, []);
  return <>123</>;
};

export default Home;
