import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage/LandingPage";
import Home from "./pages/Chat/Ho";
import Box from "./pages/Chat/Chat";
import Layout from "./components/Layout/Layout";
import ToolKit from "./pages/ToolKit/ToolKit";
import Chat from "./pages/Chat/Chat";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { saveUserInfo } from "./store/userSlice";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "apps",
        element: <ToolKit />,
        children: [
          {
            element: <>Toolkit</>,
          },
          {
            path: "chat",
            element: <Chat />,
          },
        ],
      },

      {
        path: "",
        element: <LandingPage />,
      },
    ],
  },
  {
    path: "/sign-up",
    element: <>sign-up</>,
  },
]);

export const GuardRounded = (props: any) => {
  const dispatch = useDispatch();

  let userInfoDto = "";
  try {
    userInfoDto = JSON.parse(localStorage.getItem("userInfo") as string);

    dispatch(saveUserInfo(userInfoDto));
  } catch (error) {
    console.log(error);
  }

  return userInfoDto ? <Outlet /> : <Navigate to="" replace />;
};
