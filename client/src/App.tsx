import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./components/NavBar";
import Celebs from "./components/Celebs";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import CelebProfile from "./components/CelebProfile";
import Login from "./components/Login";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

function App() {
  const { signed } = useSelector((state: RootState) => state.signed);
  return (
    <>
      <div className="flex flex-col  absolute   w-full h-full p-0 m-0 ">
        <NavBar />
        {/* <Celebs /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          {signed ? (
            <>
              <Route path="/" element={<Celebs />} />
              <Route path="/profile" element={<CelebProfile />} />
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
