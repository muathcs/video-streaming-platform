import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import { apiUrl } from "../utilities/fetchPath";
import { RequestType } from "../TsTypes/types";

// if we reach the success page, it means a request has been sent to the celeb, so we can also create a notificaiton here to notify the celeb of the request that was made to them.
type SuccessType = {
  celebUid: string;
  price: number;
};

const Success = ({ celebUid, price }: SuccessType) => {
  const { state } = useLocation();

  console.log("celeb: ", celebUid);

  async function sendReciept() {
    try {
      const celeb = await axios.get(`${apiUrl}/Celebs/${celebUid}`);

      const response = await axios.post(`${apiUrl}/stripe/reciept`, {
        celebuid: celebUid,
        price: price,
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    sendReciept();
  }, []);

  // const { currentUser } = useAuth();

  // const [request] = useLocalStorage("request");

  const notify = () => {
    toast.success("Success", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    notify(); // Show the toast when loading is true
  }, []);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ width: "500px", height: "5100px", marginTop: 100 }}
      />
      <div className="text-2xl h-full flex items-center justify-center flex-col bg-black">
        <div className="text-center  rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-white">Thank You!</h1>
          <p className="text-lg mb-4 text-white">
            Your request has been successfully submitted. We appreciate your
            patience and will process your request promptly.
          </p>
          <p className="text-lg mb-6 text-white">
            You can expect a response within one week. If you do not receive a
            response by then, you'll be automatically refunded.
          </p>
          <p className="text-lg text-white">
            For those who opted for the 24-hour delivery option, you will
            receive a reply within 24 hours.
          </p>
        </div>
      </div>
    </>
  );
};

export default Success;
