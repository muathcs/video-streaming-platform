import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Success = () => {
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
    console.log("here");
    notify(); // Show the toast when loading is true
  }, []);
  console.log("messagexx:");
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
      <div className="mt-10 text-[24px]">
        <h1>Thank You!</h1>
        <p className="">
          Your request has been made, expect a response within one week, if you
          do not recieve a response within one week, you can claim a refund.
        </p>
        <p>If you paid for 24 hours delivery, expect a reply within 24 hours</p>
      </div>
    </>
  );
};

export default Success;
