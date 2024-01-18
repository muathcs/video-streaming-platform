import "./App.css";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router-dom";
import CelebProfile from "./components/CelebProfile";
import Login from "./components/Login";
import SignUp from "./components/signup";
import PrivateRoute from "./components/privateRoute";
import Dashboard from "./components/Dashboard";
import FanRequests from "./components/FanRequests";
import FulfillRequest from "./components/FulfillRequest";
import Payment from "./components/Payment";
import PaymentStatus from "./components/PaymentStatus";
import Success from "./components/Success";
import Category from "./components/Category";

function App() {
  // const { signed } = useSelector((state: RootState) => state.signed);

  const signed = true;
  return (
    <>
      <div className="flex flex-col  absolute   w-full h-full  p-0 m-0 overflow-auto bg-[#121114] ">
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
              <Route path="/payment" element={<Payment />} />
              <Route path="/fulfill/:requestId" element={<FulfillRequest />} />
              <Route path="/paymentstatus" element={<PaymentStatus />} />
              <Route path="/success" element={<Success />} />
              <Route path="/browse/:category" element={<Category />} />
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
