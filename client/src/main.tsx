import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store.tsx";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/AuthContext.tsx";
import RequestForm from "./components/RequestForm.tsx";
import { RequestContext } from "./context/RequestContext.tsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51LJDOjGFwRQBDdF4mK0dnR99AbxVar1HyeMsbYUN4HDWWC44f29yhYiOCArdEv3T7yQ5JNZF1QbbmzUWXqjywMPQ00RtVGGAFq"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
