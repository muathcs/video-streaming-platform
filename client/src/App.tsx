import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="border-2 border-black bg-black w-full h-full">
      <NavBar />
    </div>
  );
}

export default App;
