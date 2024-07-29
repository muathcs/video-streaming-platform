import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestContext";
import axios from "@/api/axios";
import { apiUrl } from "@/utilities/fetchPath";
import { CelebType, notification } from "@/TsTypes/types";
import { useGlobalAxios } from "@/hooks/useGlobalAxios";
import { GiShoppingCart } from "react-icons/gi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import NotificationMenu from "./NotificationMenu";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

function Nav() {
  const { logout, currentUser, celeb, userInfo }: any = useAuth();
  const navigate = useNavigate();
  const { requests } = useRequests();
  const [celebsSuggestion, setCelebsSuggestion] = useState<string[]>([]);
  const [searchCelebVal, setSearchCelebVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState(false);

  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];
  const path = celeb ? "dashboard" : celeb == undefined ? "" : "requests";

  const [navigation, setNavigation] = useState([
    { name: "Catogories", href: "/", current: false },
    { name: "How ", href: "/about", current: false },
    { name: "Celebs", href: "/", current: false },
    { name: path, href: path, current: false },
    { name: "Join as Talent", href: "/signup/talent", current: false },
  ]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [notifications, setNotifications] = useState<notification[]>();
  const [unread, setUnread] = useState<number>(0);

  const { data: putRequest } = useGlobalAxios("put");

  useEffect(() => {
    setLoading(true);
    const getNotification = async () => {
      if (!currentUser) {
        return;
      }
      try {
        const response = await axios.get(`${apiUrl}/notification`, {
          params: { data: currentUser.uid },
        });

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

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  function readNotifications() {
    if (!currentUser) {
      return;
    }
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

  async function searchCeleb(keysSearch: string) {
    try {
      const response = await axios.get(`${apiUrl}/search`, {
        params: { name: keysSearch },
      });

      setCelebsSuggestion(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="mt-2 ">
      <div className=" max-w-7xl px-2 sm:px-6 lg:px-8    mx-auto">
        <div className="relative flex h-16 items-center justify-between   ">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden ">
            {/* Mobile menu button */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* nav items */}
          <div className=" flex w-full items-center    ">
            <div className="hidden md:flex flex-1 items-center justify-center md:items-stretch md:justify-center     ">
              <div className="flex flex-shrink-0 items-center">
                <Link to={"/"} className="text-4xl font-bold md:block hidden">
                  Cameo
                </Link>
              </div>
              <div className="hidden sm:ml-6 md:block ">
                <div className="flex md:space-x-2 lg:space-x-4 ">
                  {navigation.length > 0 &&
                    navigation.map((item, index) => {
                      if (!item.name) return;
                      return (
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
                              ? "underline rounded-full text-white "
                              : "text-white hover:bg-gray-700 hover:rounded-full focus:bg-gray-800 hover:text-white text-sm lg:text-lg  lg:font-medium  ",
                            "rounded-full px-3 py-3 text-nowrap "
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
            {/* Search bar */}
            <div className="relative mx-auto text-gray-600 sm:block ml-10 w-full  sm:right-0   ">
              <input
                className=" h-10 pl-2 w-full rounded-full text-sm focus:outline-none bg-white    "
                type="search"
                name="search"
                value={searchCelebVal}
                placeholder="Search "
                onChange={(e) => {
                  const input = e.target.value;

                  setSearchCelebVal(input);
                  searchCeleb(input);
                }}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-3 mr-2 "
              >
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 30.239 30.239"
                  // style={{ enableBackground: "new 0 0 30.239 30.239" }}
                  xmlSpace="preserve"
                  width="512px"
                  height="512px"
                >
                  <g>
                    <path
                      d="M20.905,18.313c1.504-2.022,2.268-4.442,2.268-6.935C23.172,5.085,18.087,0,11.586,0C5.085,0,0,5.085,0,11.586
                      c0,6.501,5.085,11.586,11.586,11.586c2.396,0,4.716-0.726,6.697-2.092l7.371,7.372c0.391,0.391,0.902,0.586,1.414,0.586
                      s1.023-0.195,1.414-0.586c0.781-0.781,0.781-2.047,0-2.828L20.905,18.313z M11.586,19.172c-4.179,0-7.586-3.407-7.586-7.586
                      s3.407-7.586,7.586-7.586s7.586,3.407,7.586,7.586S15.764,19.172,11.586,19.172z"
                    />
                  </g>
                </svg>
              </button>

              {celebsSuggestion.length > 0 && searchCelebVal && (
                <div className="border-2 mt-3 absolute w-full z-10 bg-white overflow-auto max-h-60">
                  {celebsSuggestion.map((celeb: any, index) => (
                    <p
                      key={index}
                      className="hover:bg-purple-600 cursor-pointer text-left pl-10 hover:text-white py-2 text-[12px]"
                      onClick={() => {
                        setSearchCelebVal(""); // Clear the search value to hide the dropdown

                        navigate("/profile", {
                          state: { celeb },
                        });
                      }}
                    >
                      {celeb.displayname}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* logo and notification */}
          <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ">
            <button
              onClick={() => {
                setOpenNotification(() => !openNotification);
              }}
              type="button"
              className="relative rounded-full p-1 text-gray-400 "
            >
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
                        {loading ? <AiOutlineLoading3Quarters /> : unread}
                      </span>
                    ) : (
                      ""
                    )}
                  </>
                )}
                <GiShoppingCart className="h-10 w-10" aria-hidden="true" />
              </p>
              {openNotification ? (
                <NotificationMenu notifications={notifications} />
              ) : (
                ""
              )}
            </button>

            {/* Profile dropdown */}
            <div className="relative ml-3 ">
              <div>
                <button
                  type="button"
                  className="relative flex   "
                  id="user-menu-button"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  onClick={toggleUserMenu}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-16 h-14 rounded-full object-cover"
                    src={userInfo && userInfo.imgurl}
                    alt=""
                  />
                </button>
              </div>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <Link
                    to="/user/profile"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                    }}
                    className={
                      "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                    }
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="settings"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                    }}
                    className={
                      "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    }
                  >
                    Settings
                  </Link>
                  <a
                    onClick={handleLogout}
                    href=""
                    className={
                      "block px-4 py-2 text-sm text-gray-700 bg-gray-100"
                    }
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <a
              href="#"
              className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              aria-current="page"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Team
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Projects
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Calendar
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
