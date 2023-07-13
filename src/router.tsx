import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { Main } from "./pages/LandingPage/LandingPage";

import { lsGet } from "./utils/localstorage";
import { lazy } from "react";
import Layout from "./components/Layout/Layout";

import PwdReset from "./pages/authPages/PwdReset/PwdReset";
import Contact from "./pages/Contact/Contact";
import Privacy from "./pages/Privacy/Privacy";
import HashLoader from "./components/HashLoader/HashLoader";

type GuardProps = {
  componentModule: Promise<{ default: React.ComponentType<any> }>;
};

export const GuardRounded = ({ componentModule }: GuardProps) => {
  const Component = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(componentModule as any), 200);
    });
  });

  return <Suspense fallback={<HashLoader transparent />}>{lsGet("userInfo") ? <Component /> : <Navigate to="/" replace />}</Suspense>;
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
        element: <GuardRounded componentModule={import("./pages/Apps/Apps")} />,
      },
      {
        path: "apps/chat",
        element: <GuardRounded componentModule={import("./pages/Chat/Chat")} />,
      },
      {
        path: "shop",
        element: <GuardRounded componentModule={import("./pages/Shop/Shop")} />,
      },
      {
        path: "apps/oral-chat",
        element: <GuardRounded componentModule={import("./pages/OralChat/OralChat")} />,
      },
      {
        path: "apps/translator",
        element: <GuardRounded componentModule={import("./pages/Translator/Translator")} />,
      },
      {
        path: "apps/draw",
        element: <GuardRounded componentModule={import("./pages/Draw/Draw")} />,
      },
      {
        path: "account",
        element: <GuardRounded componentModule={import("./pages/Account/Account")} />,
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
