import "./App.css";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import CelebProfile from "./pages/CelebProfile";
import Login from "./pages/Login";
import SignUp from "./pages/signup";
import PrivateRoute from "./components/privateRoute";
import Dashboard from "./pages/Dashboard";
import FanRequests from "./pages/FanRequests";
import FulfillRequest from "./components/FulfillRequest";
import Payment from "./pages/Payment";
import PaymentStatus from "./pages/PaymentStatus";
import Success from "./components/Success";
import Category from "./pages/Category";
import FulFilled from "./components/fulfillRequest/FulFilled";
import HowTo from "./pages/HowTo";
import Settings from "./pages/Settings";
import Celebs from "./pages/Celebs";
import PaymentStatusWrapper from "./components/PaymentStatusWrapper";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <>
      {/* <Celebs /> */}
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route element={<Settings />} path="/settings" />
          <Route element={<Celebs />} path="/" />
          <Route path="/requests" element={<FanRequests />} />
          <Route path="/profile" element={<CelebProfile />} />
          <Route path="/profile/:name/:id" element={<CelebProfile />} />
          <Route path="/fulfill/:requestId" element={<FulfillRequest />} />
          <Route path="/request/fulfilled" element={<FulFilled />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/paymentstatus" element={<PaymentStatus />} />
          {/* <Route path="/success" element={<Success />} /> */}
        </Route>
        <Route path="/about" element={<HowTo />} />
        <Route path="/browse/:category" element={<Category />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/*" element={<PrivateRoute />} />
      </Routes>
    </>
  );
}

export default App;
