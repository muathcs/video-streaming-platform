import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Celebs from "./Celebs";

function PrivateRoute() {
  const { currentUser }: any = useAuth();

  return currentUser ? <Celebs /> : <Navigate to={"/login"} replace />;
}

export default PrivateRoute;
