import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./components/NavBar";
import Celebs from "./components/Celebs";

function App() {
  return (
    <div className="flex flex-col absolute left-0 w-full h-full bg-black">
      <NavBar />
      <Celebs />
    </div>
  );
}

export default App;
