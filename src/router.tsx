import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";

import LandingPage, { Main } from "./pages/LandingPage/LandingPage";

import Layout from "./components/Layout/Layout";
import Apps from "./pages/Apps/Apps";
import Chat from "./pages/Chat/Chat";

import Shop from "./pages/Shop/Shop";
import Login from "./pages/authPages/Login/Login";
import OralChat from "./pages/OralChat/OralChat";
import SignUp from "./pages/authPages/SignUp/SignUp";
import { lsGet } from "./utils/localstorage";
import Translator from "./pages/Translator/Translator";
import Draw from "./pages/Draw/Draw";
import Product from "./pages/Product/Product";
import Account from "./pages/Account/Account";

export const GuardRounded = ({ component }: { component: JSX.Element }) => {
  return lsGet("userInfo") ? component : <Navigate to="/" replace />;
};
export const getUserInfoFromLocal = () => {
  return lsGet("userInfo");
};
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/product",
        element: <Product />,
      },
    ],
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
        element: <GuardRounded component={<Chat type="text" />} />,
      },
      {
        path: "shop",
        element: <GuardRounded component={<Shop />} />,
      },
      {
        path: "apps/oral-chat",
        element: <GuardRounded component={<OralChat />} />,
      },
      {
        path: "apps/translator",
        element: <GuardRounded component={<Translator />} />,
      },
      {
        path: "apps/draw",
        element: <GuardRounded component={<Draw />} />,
      },
      {
        path: "account",
        element: <GuardRounded component={<Account />} />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <h1
        style={{
          textAlign: "center",
        }}>
        404 NOT FOUND
      </h1>
    ),
  },
]);
