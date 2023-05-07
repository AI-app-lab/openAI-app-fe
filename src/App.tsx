import React, { useEffect } from "react";

import { RouterProvider } from "react-router-dom";
import { getUserInfoFromLocal, router } from "./router";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userInfoDto = getUserInfoFromLocal();
    userInfoDto && dispatch(saveUserInfo(userInfoDto));
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
