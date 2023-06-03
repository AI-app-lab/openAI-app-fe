import React, { useEffect } from "react";

import { router } from "./router";
import { useDispatch, useSelector } from "react-redux";
import { saveUserInfo } from "./store/userSlice";
import { ConfigState, getThemeFromLocal } from "./store/configSlice";
import { SnackbarProvider } from "notistack";
import { lsGet } from "./utils/localstorage";

import { RouterProvider } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getThemeFromLocal());
    const userInfoDto = lsGet("userInfo");
    userInfoDto && dispatch(saveUserInfo(userInfoDto));
  }, []);
  const { theme } = useSelector((state: ConfigState) => state.config);

  return (
    <div className={theme}>
      <SnackbarProvider
        preventDuplicate
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />

      <RouterProvider router={router} />
    </div>
  );
}

export default App;
