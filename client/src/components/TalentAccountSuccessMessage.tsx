import React from "react";
import Confett from "../assets/Confetti.png";
import Tick from "../assets/complete.png";
function TalentAccountSuccessMessage() {
  return (
    <div className="flex items-start justify-center">
      <div className="mt-10  ">
        <div className=" flex justify-center">
          <img src={Confett} />
        </div>
        <div className="flex mt-10 justify-center items-center">
          <h1 className="text-xl ">
            Your account has been created Successfully
          </h1>
          <img src={Tick} className="text-sm w-6 h-6" />
        </div>
        <p className="mt-10 text-lg">
          Download the Hikaya app from either the App Store or Google Play Store
          to finish setting up your account, login using your email.
        </p>
      </div>
    </div>
  );
}

export default TalentAccountSuccessMessage;
