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

  if (currentUser !== null) {
    const isAuthenticated = currentUser;
    return isAuthenticated ? <Celebs /> : null; // or loading indicator, etc...
  }
  return <Navigate to={"/login"} replace />;
}

export default PrivateRoute;
