import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AuthContextType, UserInfoType } from "../TsTypes/types";
import { GoGitPullRequest } from "react-icons/go";
import { FaDollarSign, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiSolidCategory } from "react-icons/bi";
import { formatter } from "../utilities/currencyFormatter";
import { apiUrl } from "../utilities/fetchPath";
import axios from "../api/axios";

function UserProfile() {
  const { userInfo, celeb }: AuthContextType = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  console.log("userinfo: ", userInfo);
  async function addBankAccount() {
    setLoading(true);
    setError("null");

    try {
      const response = await axios.post(`${apiUrl}/stripe/add-account`, {
        displayname: userInfo?.displayname,
        email: userInfo?.email,
        uid: userInfo?.uid,
      });

      console.log("data: ", response);
      // Handle successful response
      if (response.data.url) {
        // Redirect to the Stripe onboarding URL
        window.open(response.data.url, "_blank")?.focus();
      } else {
        // Handle cases where no URL is provided
        console.error("No URL provided");
        setError("Failed to get the onboarding URL.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-4 sm:max-w-lg  sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900 border-2 ">
      <div className="rounded-t-lg h-52 overflow-hidden">
        <img
          className="object-cover object-top w-full"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Mountain"
        />
      </div>
      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img
          className="object-cover object-center h-32"
          src={userInfo?.imgurl}
          alt="Woman looking front"
        />
      </div>
      <div className="text-center mt-2">
        <h2 className="font-semibold">{userInfo?.displayname}</h2>
        <p className="text-gray-500">{userInfo?.fav_categories}</p>
      </div>
      <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around ">
        <li className="flex flex-col items-center justify-around  basis-[100%]">
          <div className="text-blue-900 text-[20px] has-tooltip ">
            <span className="tooltip rounded shadow-lg text-sm p-1 bg-gray-900 text-white 0 -mt-8 cursor-pointer">
              Number of requests
            </span>
            <span className="">
              <GoGitPullRequest />
            </span>
          </div>
          <div>{userInfo?.num_of_requests}x</div>
        </li>
        <li className="flex flex-col items-center justify-between  basis-[100%]">
          <div className="text-blue-900 text-[20px] has-tooltip ">
            <span className="tooltip rounded shadow-lg text-sm p-1 bg-gray-900 text-white 0 -mt-8 cursor-pointer">
              Amount of money spent
            </span>
            <FaDollarSign />
          </div>
          <div>
            {userInfo?.total_spent && formatter.format(userInfo?.total_spent)}
          </div>
        </li>
        <li className="flex flex-col items-center justify-around  basis-[100%]">
          <div className="text-blue-900 text-[20px] has-tooltip ">
            <span className="tooltip rounded shadow-lg text-sm p-1 bg-gray-900 text-white 0 -mt-8 cursor-pointer">
              create at{" "}
            </span>
            <BiSolidCategory />
          </div>
          <div>{userInfo?.created_at?.toLocaleString().split("T")[0]}</div>
        </li>
      </ul>
      <div className="p-4 border-t mx-8 mt-2">
        <Link
          to={"/settings"}
          className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2 text-center"
        >
          Settings
        </Link>
        {celeb && (
          <button
            disabled={loading}
            onClick={addBankAccount}
            className="w-1/2 mt-4  mx-auto rounded-full bg-gray-900 hover:bg-gray-800 hover:shadow-lg font-semibold text-white px-6 py-2 flex items-center justify-center"
          >
            {loading ? (
              <FaSpinner />
            ) : userInfo?.stripe_onboarded ? (
              "Edit Bank Details"
            ) : (
              "Add a Bank Account"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
