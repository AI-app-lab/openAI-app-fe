import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage/LandingPage";

import Box from "./pages/Chat/Chat";
import Layout from "./components/Layout/Layout";
import Apps from "./pages/Apps/Apps";
import Chat from "./pages/Chat/Chat";
import { useDispatch, useSelector } from "react-redux";

import { saveUserInfo } from "./store/userSlice";
import Shop from "./pages/Shop/Shop";
import Login from "./pages/authPages/Login/Login";
import OralChat from "./pages/OralChat/OralChat";
import SignUp from "./pages/authPages/SignUp/SignUp";

export const GuardRounded = ({ component }: { component: JSX.Element }) => {
  const userInfoDto = JSON.parse(localStorage.getItem("userInfo") as string);

  return userInfoDto ? component : <Navigate to="/" replace />;
};
export const getUserInfoFromLocal = () => {
  const userInfoDto = JSON.parse(localStorage.getItem("userInfo") as string);

  return userInfoDto;
};
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },

  {
    element: <Layout />,
    children: [
      {
        path: "apps",
        element: <GuardRounded component={<Apps />} />,
      },
      {
        path: "apps/chat",
        element: <GuardRounded component={<Chat type="basic" />} />,
      },
      {
        path: "apps/shop",
        element: <GuardRounded component={<Shop />} />,
      },
      {
        path: "apps/oral-chat",
        element: <GuardRounded component={<OralChat />} />,
      },
    ],
  },
]);
