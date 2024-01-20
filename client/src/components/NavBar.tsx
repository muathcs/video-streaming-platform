import { useState } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { CiMenuBurger } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRequests } from "../context/RequestContext";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

// retrieve profile image.

// Assuming userID is a variable containing the user ID you want to retrieve the image for

function NavBar() {
  const { logout, currentUser, celeb }: any = useAuth();
  const navigate = useNavigate();
  // const celeb = localStorage.getItem("celeb");

  const path = celeb ? "dashboard" : celeb == undefined ? "" : "requests";

  const [navigation, setNavigation] = useState([
    { name: "Catogories", href: "#", current: false },
    { name: "Home", href: "#", current: false },
    { name: "How ", href: "#", current: false },
    { name: "Celebs", href: "#", current: false },
    { name: "About", href: "#", current: false },
    { name: path, href: path, current: false },
  ]);

  // logout
  async function handleLogout() {
    try {
      await logout();

      navigate("/login");
      // location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  console.log("current: ", currentUser);

  const { requests } = useRequests();

  console.log("req: ", requests);

  return (
    <>
      <Disclosure
        as="nav"
        className=" text-[24px] sm:text-[16px] z-10 block  py-5    "
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-[100rem] px-2 sm:px-6   ">
              <div className="relative flex h-16  items-center justify-between ">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden ">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <FaTimes className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <CiMenuBurger
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex items-center justify-center    w-full   ">
                  <div className=" w-2/3 flex ">
                    <div className="flex flex-shrink-0 items-center">
                      <h1 className="text-[50px]  sm:block hidden text-white relative bottom-2">
                        <Link
                          className="text-white "
                          onClick={() => {
                            const updatedNav = navigation.map((item) => ({
                              ...item,
                              current: false,
                            }));

                            setNavigation(updatedNav);
                          }}
                          to="/"
                        >
                          Cameo
                        </Link>
                      </h1>
                    </div>
                    <div className="hidden sm:ml-6 sm:block ">
                      <div className="flex space-x-4 mx-2">
                        {navigation.map((item, index) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => {
                              const updatedNav = navigation.map((item, i) => ({
                                ...item,
                                current: i == index, //when a spec link is clicked, current becomes true
                              }));

                              setNavigation(updatedNav);
                            }}
                            className={classNames(
                              item.current
                                ? "bg-slate-300 rounded-full text-white"
                                : "text-white hover:bg-gray-700 hover:rounded-full focus:bg-gray-800 hover:text-white",
                              "rounded-full px-3 py-3 text-[20px] font-medium "
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className=" w-full ">
                    <input
                      placeholder="Search"
                      className="text-black py-2 rounded-full w-full border border-gray-500 bg-white px-5  "
                    />
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 sm:mt-3">
                  <button
                    type="button"
                    className="relative rounded-full  p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>

                    {requests && (
                      <span className="bg-red-600 font-bold text-lg text-center flex justify-center items-center absolute h-7 w-7 bottom-7 left-6 rounded-[50%] text-white">
                        {requests?.length}
                      </span>
                    )}
                    <GiShoppingCart className="h-10 w-10" aria-hidden="true" />
                  </button>
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3 ">
                    <div>
                      <Menu.Button className="relative  w-16 h-16 flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-full w-full rounded-full"
                          src={currentUser && currentUser.photoURL}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={handleLogout}
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default NavBar;
