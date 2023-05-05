import React, { useEffect } from "react";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "./store/userSlice";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
