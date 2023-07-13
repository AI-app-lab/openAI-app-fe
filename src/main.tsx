import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import store from "./store/store";
import { Provider } from "react-redux";
import HashLoader from "./components/HashLoader/HashLoader";

const App = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./App") as any), 1000);
  });
});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <Suspense fallback={<HashLoader />}>
      <App />
    </Suspense>
  </Provider>
);
