import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, Link } from "react-router-dom";
import axios from "../api/axios";
import { apiUrl } from "../utilities/fetchPath";
import { RequestType } from "../TsTypes/types";
import { FaCheckCircle } from 'react-icons/fa';

// if we reach the success page, it means a request has been sent to the celeb, so we can also create a notification here to notify the celeb of the request that was made to them.
type SuccessType = {
  celebUid: string;
  price: number;
};

const Success = ({ celebUid, price }: SuccessType) => {
  const { state } = useLocation();

  async function sendReceipt() {
    try {
      await axios.post(`${apiUrl}/stripe/receipt`, {
        celebuid: celebUid,
        price: price,
      });
    } catch (error) {
      console.error("Error sending receipt:", error);
    }
  }

  useEffect(() => {
    sendReceipt();
    toast.success("Payment successful!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b bg-black text-white p-4">
        <div className="max-w-md w-full bg-white text-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center">
            <FaCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
            <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
            <p className="text-lg mb-6">
              Your request has been successfully submitted and payment processed.
            </p>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold mb-2">What's Next?</p>
              <ul className="list-disc list-inside text-left">
                <li>You'll receive a confirmation email shortly.</li>
                <li>The celebrity will be notified of your request.</li>
                <li>Expect a response within one week.</li>
                {/* <li>If you chose 24-hour delivery, you'll hear back within a day.</li> */}
              </ul>
            </div>
            <p className="text-sm mb-6">
              If you don't receive a response within the expected timeframe, 
              you'll be automatically refunded.
            </p>
            <Link 
              to="/requests" 
              className="inline-block bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
            >
              Go to Requests
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
