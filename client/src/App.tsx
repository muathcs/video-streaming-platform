import "./App.css";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import CelebProfile from "./components/CelebProfile";
import Login from "./components/Login";
import SignUp from "./components/signup";
import PrivateRoute from "./components/privateRoute";
import Dashboard from "./components/Dashboard";
import FanRequests from "./components/FanRequests";
import FulfillRequest from "./components/FulfillRequest";
import Payment from "./components/Payment";
import PaymentStatus from "./components/PaymentStatus";
import Success from "./components/Success";
import Category from "./components/Category";
import FulFilled from "./components/fulfillRequest/FulFilled";
import HowTo from "./components/HowTo";
import Settings from "./components/Settings";
import Celebs from "./components/Celebs";
import PaymentStatusWrapper from "./components/PaymentStatusWrapper";

function App() {
  return (
    <>
      <div className="">
        <NavBar />
        {/* <Celebs /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route element={<Settings />} path="/settings" />
            <Route element={<Celebs />} path="/" />
          </Route>
          <Route path="/profile" element={<CelebProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/requests" element={<FanRequests />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/fulfill/:requestId" element={<FulfillRequest />} />
          <Route path="/paymentstatus" element={<PaymentStatus />} />
          <Route path="/success" element={<Success />} />
          <Route path="/about" element={<HowTo />} />
          <Route path="/request/fulfilled" element={<FulFilled />} />
          <Route path="/browse/:category" element={<Category />} />
          <Route path="/*" element={<PrivateRoute />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
