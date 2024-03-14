import React from "react";
import { useAuth } from "../context/AuthContext";
import { AuthContextType, UserInfoType } from "../TsTypes/types";
import { GoGitPullRequest } from "react-icons/go";
import { FaDollarSign } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiSolidCategory } from "react-icons/bi";

function UserProfile() {
  const { userInfo }: AuthContextType = useAuth();
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
        <p className="text-gray-500">{userInfo?.fav_categories}Fav category</p>
      </div>
      <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
        <li className="flex flex-col items-center justify-around">
          <span className="text-blue-900 text-[20px]">
            <GoGitPullRequest />
          </span>

          <div>2k</div>
        </li>
        <li className="flex flex-col items-center justify-between">
          <span className="text-blue-900 text-[20px]">
            <FaDollarSign />
          </span>
          <div>10k</div>
        </li>
        <li className="flex flex-col items-center justify-around">
          <span className="text-blue-900 text-[20px]">
            <BiSolidCategory />
          </span>
          <div>15</div>
        </li>
      </ul>
      <div className="p-4 border-t mx-8 mt-2">
        <Link
          to={"/settings"}
          className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
        >
          Settings
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;
