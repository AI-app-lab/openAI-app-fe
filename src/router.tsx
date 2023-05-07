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

export const GuardRounded = ({ component }: { component: JSX.Element }) => {
  const userInfoDto = JSON.parse(localStorage.getItem("userInfo") as string);
  console.log(userInfoDto);

  return userInfoDto ? component : <Navigate to="/" replace />;
};
export const getUserInfoFromLocal = () => {
  const userInfoDto = JSON.parse(localStorage.getItem("userInfo") as string);

  return userInfoDto;
};
export const router = createBrowserRouter([
  {
    path: "/",
    element: <>Landing Page</>,
  },
  {
    path: "/sign-up",
    element: <>sign-up</>,
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
        element: <GuardRounded component={<Chat />} />,
      },
      {
        path: "shop",
        element: <GuardRounded component={<Shop />} />,
      },
    ],
  },
]);
