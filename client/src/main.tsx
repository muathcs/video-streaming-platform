import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store.tsx";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51LJDOjGFwRQBDdF4XITXzBVWxK72genu1MHAFxH6KOjUXzUq8eKqfe6mtTOU5GSFXJ8O7GJEO5wr1QC1ALZcsobz00DES41OcW"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </AuthProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
