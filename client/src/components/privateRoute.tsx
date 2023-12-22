import React, { Component } from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Celebs from "./Celebs";

interface PrivateRouteProps {
  element: React.ReactNode;
  [x: string]: any;
}

function PrivateRoute() {
  const { currentUser }: any = useAuth();

  return currentUser ? <Celebs /> : <Navigate to={"/login"} replace />;
}

export default PrivateRoute;
