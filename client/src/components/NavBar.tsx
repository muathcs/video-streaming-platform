import React, { useState } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { CiBurger, CiMenuBurger } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-scroll";

const navigation = [
  { title: "Catogories" },
  { title: "Home" },
  { title: "How does it work" },
  { title: "Celebs" },
  { title: "About" },
];

function NavBar() {
  const [click, setClick] = useState(false);
  const [search, setSearch] = useState("");
  const handleClick = () => setClick(!click);

  const content = (
    <>
      <div className="sm:hidden block absolute  w-full left-0 right-0 bg-slate-800 transition h-[100%] top-0 text-white">
        <ul className="text-center text-xl  relative top-32 text-white flex flex-col gap-5 text-[30px]">
          {navigation.map((item) => (
            <Link spy={true} smooth={true} to="Home">
              <li className="text-white hover:cursor-pointer  hover:bg-gray-600 hover:rounded-full p-2 flex items-center justify-center">
                {item.title}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <>
      <nav className="w-full relative left-0 top-0 h-22    ">
        <div className="h-full flex justify-between  text-white   py-4 border-black ">
          <div className="sm:flex  items-start font-normal hidden   w-full  px-0 sm:px-20  z-10 ">
            <div className="w-1/2 ">
              <ul className="sm:flex hidden  text-[18px]  w-full justify-center gap-5   ">
                {navigation.map((item) => (
                  <Link spy={true} smooth={true} to="Home">
                    <li className="hover:cursor-pointer hover:bg-gray-600 hover:rounded hove:bg-slate-400 text-white -full p-2 flex items-center justify-center    ">
                      {item.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
            <div className=" flex justify-end w-1/2 ">
              <input
                placeholder="Search for celebd"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-2  rounded-xl px-5 py-2 w-full  right-5 bg-white text-black focus:outline-none"
              />
            </div>
          </div>
          <div className=" w-full left-0 top-0 h-full absolute">
            {click && content}
          </div>

          <button
            className="block sm:hidden transtion absolute right-5 bg-none focus:outline-none focus:border-none"
            onClick={handleClick}
          >
            {click ? <AiOutlineClose /> : <CiMenuBurger />}
          </button>
        </div>
      </nav>
      {/* <div>
        <div className="w-full bg-red-400 h-[10%] absolute top-0 left-0 flex items-center gap-10">
            <h1 className='font-bold relative left-5 text-[40px]'>LOGO</h1>
            <ul className='flex flex-row gap-4 '>
                <li className='hover:cursor-pointer hover:bg-gray-600 hover:rounded-full p-2 flex items-center justify-center'>catogories</li>
                <li className='hover:cursor-pointer hover:bg-gray-600 hover:rounded-full p-2 flex items-center justify-center'>Home</li>
                <li className='hover:cursor-pointer hover:bg-gray-600 hover:rounded-full p-2 flex items-center justify-center'>How it works</li>
                <li className='hover:cursor-pointer hover:bg-gray-600 hover:rounded-full p-2 flex items-center justify-center'>About</li>
            </ul>
            <input placeholder='search for celeb ' className='rounded-xl px-5 py-2 w-2/5 absolute right-5 bg-white text-black focus:outline-none '/>
        </div>
    </div> */}
    </>
  );
}

export default NavBar;
