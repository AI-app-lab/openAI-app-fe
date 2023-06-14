import React, { Suspense } from "react";
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";

import { Main } from "./pages/LandingPage/LandingPage";

import { lsGet } from "./utils/localstorage";
import { lazy } from "react";
import Layout from "./components/Layout/Layout";
import Draw from "./pages/Draw/Draw";
import Translator from "./pages/Translator/Translator";
import OralChat from "./pages/OralChat/OralChat";
import Shop from "./pages/Shop/Shop";
import Chat from "./pages/Chat/Chat";
import Apps from "./pages/Apps/Apps";
import Account from "./pages/Account/Account";

import PwdReset from "./pages/authPages/PwdReset/PwdReset";
import Contact from "./pages/Contact/Contact";
import Privacy from "./pages/Privacy/Privacy";

export const _GuardRounded = ({ component }: { component: JSX.Element }) => {
  return lsGet("userInfo") ? component : <Navigate to="/" replace />;
};
export const getUserInfoFromLocal = () => {
  return lsGet("userInfo");
};
const GuardRounded = lazy(() => import("./router").then((m) => ({ default: m._GuardRounded })));
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
