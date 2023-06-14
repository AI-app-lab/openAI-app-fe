import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import store from "./store/store";
import { Provider } from "react-redux";
import HashLoader from "./components/HashLoader/HashLoader";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

let App = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./App") as any), 1000);
  });
});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GoogleReCaptchaProvider useRecaptchaNet reCaptchaKey="6LdaP4omAAAAAA0EUUUyLC8LoRVj6eF8XLskkV7L">
    <Provider store={store}>
      <Suspense fallback={<HashLoader />}>
        <App />
      </Suspense>
    </Provider>
  </GoogleReCaptchaProvider>
);
