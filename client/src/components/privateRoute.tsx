import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Celebs from "./Celebs";

function PrivateRoute() {
  const { currentUser }: any = useAuth();

  console.log("clzzz: ", currentUser);
  console.log("outlet: ", <Outlet />);
  return currentUser ? <Outlet /> : <Navigate to={"/login"} replace />;
}

export default PrivateRoute;
