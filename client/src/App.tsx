import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./components/NavBar";
import Celebs from "./components/Celebs";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import CelebProfile from "./components/CelebProfile";

function App() {
  return (
    <>
      <div className="flex flex-col  absolute   w-full h-full p-0 m-0 ">
        <NavBar />
        {/* <Celebs /> */}
        <Routes>
          <Route path="/" element={<Celebs />} />
          <Route path="/profile" element={<CelebProfile />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
