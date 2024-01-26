import { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { CiMenuBurger } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRequests } from "../context/RequestContext";
import axios from "../api/axios";
import { apiUrl } from "../utilities/fetchPath";
import { ImNotification } from "react-icons/im";
import { notification } from "../TsTypes/types";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

// retrieve profile image.

// Assuming userID is a variable containing the user ID you want to retrieve the image for

function NavBar() {
  const { logout, currentUser, celeb }: any = useAuth();
  const [notifications, setNotifications] = useState<notification[]>();
  const [unread, setUnread] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: putRequest } = useGlobalAxios("put");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    console.log("mounting");
    const getNotification = async () => {
      try {
        const response = await axios.get(`${apiUrl}/notification`, {
          params: { data: currentUser.uid },
        });

        console.log("this: ", response.data);

        setNotifications(response.data);

        const totalUnreadNotifications: number = response.data.reduce(
          (total: number, notification: notification) => {
            return !notification.is_read ? total + 1 : total;
          },
          0
        );

        // to prevent flickering only set unread if there are unread notification in the database.
        if (totalUnreadNotifications != unread) {
          setUnread(totalUnreadNotifications);
        }
        setLoading(false);

        // console.log("response", response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getNotification();

    return () => {
      console.log("unmounting");
    };
  }, []);

  // const celeb = localStorage.getItem("celeb");

  // this function will run when a user opens the notification tab, and will set all the notifications the user read to is_read = true
  function readNotifications() {
    console.log("beofre: ", notifications);
    setNotifications((notifications) => {
      return (
        notifications?.map((notification) => ({
          ...notification,
          is_read: true,
        })) ?? []
      );
    });

    putRequest(`${apiUrl}/notification`, { uid: currentUser.uid });

    setUnread(0);
    console.log("beofre: ", notifications);
  }

  const path = celeb ? "dashboard" : celeb == undefined ? "" : "requests";

  const [navigation, setNavigation] = useState([
    { name: "Catogories", href: "#", current: false },
    { name: "How ", href: "/about", current: false },
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

  console.log("notis: ", notifications?.length == 0);

  const { requests } = useRequests();

  return (
    <>
      <Disclosure
        as="nav"
        className=" text-[24px] sm:text-[16px] z-10 block  sm:py-5 py-2 h-[100rem]    "
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-[100rem] px-2 sm:px-6   h-[8rem]     ">
              {/* notifications, profile image and search bar.  */}
              <div className="relative flex flex-col lg:flex-row  h-full gap-2    ">
                {/* Mobile menu button, profile and notifications*/}
                <div className="relative lg:absolute  h-1/2  w-full  ">
                  {/* mobile menu button */}
                  <div className=" w-1/2  ">
                    <div className="absolute inset-y-0 left-0 flex items-center lg:hidden   ">
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="absolute -inset-0.5 " />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <FaTimes
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <CiMenuBurger
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    {/* big screen cameo button  */}
                    <div className="items-center justify-center   lg:flex  hidden  lg:h-[4rem] relative border-2  ">
                      <h1 className="text-[3rem]   text-white relative  border-2 flex-grow">
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
                      <div className="hidden  lg:flex   border-2 w-3/4   ">
                        <div className="flex flex-shrink space-x-4 mx-2 w-full ">
                          {navigation.map((item, index) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              onClick={() => {
                                const updatedNav = navigation.map(
                                  (item, i) => ({
                                    ...item,
                                    current: i == index, //when a spec link is clicked, current becomes true
                                  })
                                );

                                setNavigation(updatedNav);
                              }}
                              className={classNames(
                                item.current
                                  ? "bg-slate-300 rounded-full text-white"
                                  : "text-white hover:bg-gray-700 hover:rounded-full focus:bg-gray-800 hover:text-white ",
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
                  </div>

                  {/* notification and profile buttons */}
                  <div className="absolute inset-y-0  right-0 flex items-center pr-2 ">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className=" inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                          <p
                            onClick={readNotifications}
                            className="relative rounded-full   p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                          >
                            <span className="absolute -inset-1.5 " />
                            <span className="sr-only ">View notifications</span>

                            {requests && (
                              <>
                                {unread ? (
                                  <span className="bg-red-600 font-bold text-lg text-center flex justify-center items-center absolute h-7 w-7 bottom-7 left-6 rounded-[50%] text-white">
                                    {loading ? (
                                      <AiOutlineLoading3Quarters />
                                    ) : (
                                      unread
                                    )}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </>
                            )}
                            <GiShoppingCart
                              className="h-10 w-10"
                              aria-hidden="true"
                            />
                          </p>
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
                        <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                          <div className="px-1 py-5">
                            {notifications?.length == 0 ? (
                              <Menu.Item>
                                <p className="text-black flex">
                                  <ImNotification className="text-red-500 mr-2 relative top-1" />
                                  You don't have any notifications
                                </p>
                              </Menu.Item>
                            ) : (
                              notifications?.map(
                                (notification: notification) => (
                                  <Menu.Item key={notification.notificationid}>
                                    {({ active }) => (
                                      <p
                                        className={`${
                                          active
                                            ? "bg-red-500 text-white"
                                            : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-4 border border-gray-300 bg-gray-100 text-lg my-2 `}
                                      >
                                        <ImNotification className="text-green-500 mr-2 relative top-1" />
                                        {notification.message}
                                      </p>
                                    )}
                                  </Menu.Item>
                                )
                              )
                            )}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3 ">
                      <div>
                        <Menu.Button className="relative  w-16 h-16 flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-full w-full rounded-full object-cover"
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
                {/* close here */}

                {/* search bar */}
                <div className="h-1/3  lg:relative left-[50%] lg:w-[35%] xl:w-[39%]  right-[20rem]  lg:h-[4rem] lg:flex items-center  ">
                  <input
                    placeholder="Search"
                    className="text-black py-1  sm:py-2  rounded-full w-full border border-gray-500 bg-white px-5   "
                  />
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
