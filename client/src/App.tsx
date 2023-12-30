import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./components/NavBar";
import Celebs from "./components/Celebs";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import CelebProfile from "./components/CelebProfile";
import Login from "./components/Login";
import SignUp from "./components/signup";
import PrivateRoute from "./components/privateRoute";
import Dashboard from "./components/Dashboard";
import FanRequests from "./components/FanRequests";
import FulfillRequest from "./components/FulfillRequest";

function App() {
  // const { signed } = useSelector((state: RootState) => state.signed);

  const signed = true;
  return (
    <>
      <div className="flex flex-col  absolute   w-full h-full  p-0 m-0  bg-gradient-to-r from-slate-900 to-slate-700 ">
        <NavBar />
        {/* <Celebs /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          {signed ? (
            <>
              <Route path="/" element={<PrivateRoute />} />
              <Route path="/profile" element={<CelebProfile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/requests" element={<FanRequests />} />
              <Route path="/fulfill/:requestId" element={<FulfillRequest />} />
            </>
          ) : (
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;
