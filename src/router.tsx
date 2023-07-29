import React, { FC, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { Main } from "./pages/LandingPage/LandingPage";

import { lsGet } from "./utils/localstorage";
import { lazy } from "react";
import Layout from "./components/Layout/Layout";
import PwdReset from "./pages/authPages/PwdReset/PwdReset";
import Contact from "./pages/Contact/Contact";
import Privacy from "./pages/Privacy/Privacy";
import Apps from "./pages/Apps/Apps";
import Chat from "./pages/Chat/Chat";
import Shop from "./pages/Shop/Shop";
import OralChat from "./pages/OralChat/OralChat";
import Translator from "./pages/Translator/Translator";
import Draw from "./pages/Draw/Draw";
import Account from "./pages/Account/Account";

type GuardProps = {
  Component: FC;
};

export const GuardRounded = ({ Component }: GuardProps) => {
  return lsGet("userInfo") ? <Component /> : <Navigate to="/" replace />;
};
export const getUserInfoFromLocal = () => {
  return lsGet("userInfo");
};

const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const Login = lazy(() => import("./pages/authPages/Login/Login"));
const Product = lazy(() => import("./pages/Product/Product"));
const SignUp = lazy(() => import("./pages/authPages/SignUp/SignUp"));

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
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/privacy",
    element: <Privacy />,
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
    path: "/reset-password",
    element: <PwdReset />,
  },

  {
    element: <Layout />,
    children: [
      {
        path: "apps",
        element: <GuardRounded Component={Apps} />,
      },
      {
        path: "apps/chat",
        element: <GuardRounded Component={Chat} />,
      },
      {
        path: "shop",
        element: <GuardRounded Component={Shop} />,
      },
      {
        path: "apps/oral-chat",
        element: <GuardRounded Component={OralChat} />,
      },
      {
        path: "apps/translator",
        element: <GuardRounded Component={Translator} />,
      },
      {
        path: "apps/draw",
        element: <GuardRounded Component={Draw} />,
      },
      {
        path: "account",
        element: <GuardRounded Component={Account} />,
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
