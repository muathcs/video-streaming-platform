import { useState, useEffect, Fragment, useRef } from "react";
import { Combobox, Disclosure, Menu, Transition } from "@headlessui/react";
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
import { CiSearch } from "react-icons/ci";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

// retrieve profile image.

// Assuming userID is a variable containing the user ID you want to retrieve the image for

function NavBar() {
  const { logout, currentUser, celeb, userInfo }: any = useAuth();
  const [notifications, setNotifications] = useState<notification[]>();
  const [unread, setUnread] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchCelebVal, setSearchCelebVal] = useState<string>("");
  const [celebsSuggestion, setCelebsSuggestion] = useState<string[]>([]);
  const optionsRef = useRef<HTMLParagraphElement | null>(null);

  const { data: putRequest } = useGlobalAxios("put");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const getNotification = async () => {
      try {
        const response = await axios.get(`${apiUrl}/notification`, {
          params: { data: currentUser.uid },
        });

        console.log("notification response: ", response);

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
      } catch (error) {
        console.error("THIS HERE: ", error);
      }
    };

    getNotification();

    return () => {};
  }, []);

  // const celeb = localStorage.getItem("celeb");

  // this function will run when a user opens the notification tab, and will set all the notifications the user read to is_read = true
  function readNotifications() {
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
  }

  const path = celeb ? "dashboard" : celeb == undefined ? "" : "requests";

  const [navigation, setNavigation] = useState([
    { name: "Catogories", href: "/", current: false },
    { name: "How ", href: "/about", current: false },
    { name: "Celebs", href: "/", current: false },
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

  async function searchCeleb(keysSearch: string) {
    try {
      const response = await axios.get(`${apiUrl}/search`, {
        params: { name: keysSearch },
      });

      console.log("search: ", response);
      setCelebsSuggestion(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Disclosure
        as="nav"
        className=" text-[24px]  sm:text-[16px] z-50  block     "
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-[100rem] px-2 sm:px-6    z-50    ">
              {/* notifications, profile image and search bar.  */}
              <div className="relative flex flex-col lg:flex-row  h-full gap-2  z-50   py-10  ">
                {/* Mobile menu button, profile and notifications*/}
                <div className="relative lg:absolute  h-1/2  w-full  ">
                  {/* mobile menu button */}
                  <div className=" w-1/2   ">
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
                    <div className="items-center justify-center   lg:flex  hidden  lg:h-[4rem] relative   ">
                      <h1 className="text-[3rem]   text-white relative   flex-grow">
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
                      <div className="hidden  lg:flex    w-3/4   ">
                        <div className="flex flex-shrink space-x-4 mx-2 w-full ">
                          {navigation.map((item, index) => {
                            if (!item.name) return;
                            return (
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
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* notification and profile buttons */}
                  <div className="absolute inset-y-0  right-0 flex items-center pr-2 md:mt-5 ">
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
                                  <span className="bg-red-600  font-bold text-lg text-center flex justify-center items-center absolute h-7 w-7 bottom-7 left-6 rounded-[50%] text-white">
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
                    <Menu as="div" className="relative ml-3  ">
                      <div>
                        <Menu.Button className="relative  w-16 h-16 flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-full w-full rounded-full object-cover "
                            src={userInfo && userInfo.imgurl}
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
                              <Link
                                to="/user/profile"
                                onClick={() => {
                                  console.log("clickixn xx");
                                }}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Your Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="settings"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={handleLogout}
                                href=""
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

                <div className="h-1/3  lg:relative left-[50%] lg:w-[35%] xl:w-[39%]  right-[20rem]  lg:h-[4rem] lg:flex items-center mt-10 md:mt-12 lg:mt-0    ">
                  <Menu
                    as="div"
                    className="relative inline-block text-left  w-full"
                  >
                    {/* combox start */}
                    <div className="top-16 w-full   ">
                      <Combobox>
                        <div>
                          <div className="relative w-full flex items-center ">
                            <input
                              onClick={() => {
                                if (!searchCelebVal) {
                                  setCelebsSuggestion([]);
                                }
                                optionsRef.current?.click();
                              }}
                              className="text-black py-1 sm:py-2 rounded-full w-full border border-gray-500 bg-white px-5"
                              value={searchCelebVal}
                              onChange={(e) => {
                                setSearchCelebVal(() => {
                                  const newValue = e.target.value;
                                  searchCeleb(newValue); // pass the updated value to your function
                                  return newValue; // return the new value to update the state
                                });
                              }}
                            />
                            <button
                              onClick={() => searchCeleb(searchCelebVal)}
                              className="absolute right-3 flex items-center text-black text-[22px] hover:text-gray-700 cursor-pointer"
                            >
                              <CiSearch className="" />
                            </button>
                          </div>
                          <Combobox.Button className="hidden">
                            <p ref={optionsRef} aria-hidden="true" />
                          </Combobox.Button>
                          {celebsSuggestion.length != 0 ? (
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              // afterLeave={() => setQuery("")}
                            >
                              {/* <div ref={optionsRef}>

                          </div> */}
                              <Combobox.Options
                                data-headlessui-state="open"
                                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md  text-black  py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm "
                              >
                                {celebsSuggestion.map((celeb: any) => (
                                  <Combobox.Option
                                    onClick={(
                                      e: React.MouseEvent<
                                        HTMLElement,
                                        MouseEvent
                                      >
                                    ) => {
                                      const target = e.target as HTMLElement;

                                      navigate("/profile", {
                                        state: { celeb },
                                      });
                                    }}
                                    key={celeb.id}
                                    className={({ active }) =>
                                      `relative cursor-pointer select-none py-2 pl-10 pr-4  text-black    ${
                                        active
                                          ? "bg-purple-600 text-black "
                                          : "text-gray-900 bg-white"
                                      }`
                                    }
                                    value={celeb}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`block truncate  ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {celeb.displayname}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active
                                                ? "text-white"
                                                : "text-teal-600"
                                            }`}
                                          >
                                            {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            </Transition>
                          ) : null}
                        </div>
                      </Combobox>
                    </div>

                    <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ">
                      {notifications?.length != 0 ? (
                        <Menu.Item>
                          <p className="text-black flex">
                            <ImNotification className="text-red-500 mr-2 relative top-1" />
                            You don't have any notifications
                          </p>
                        </Menu.Item>
                      ) : (
                        notifications?.map((notification: notification) => (
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
                        ))
                      )}
                    </Menu.Items>
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
