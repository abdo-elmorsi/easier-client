import React, { useCallback, useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
  SunIcon,
  MoonIcon,
  ArrowsUpDownIcon,
  ArrowLeftOnRectangleIcon,
  LanguageIcon,
  ArrowRightOnRectangleIcon,
  FaceSmileIcon,
  BellIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { toggleTheme } from "store/ThemeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { signOut, useSession } from "next-auth/react";
import { MainLogo } from "components/icons";
import Link from "next/link";
import { Badge, Button, List, ListItem, ListItemPrefix, Popover, PopoverContent, PopoverHandler, Typography } from "@material-tailwind/react";
import Cookies from "js-cookie";
import { useHandleMessage } from "hooks";
import API from "helper/apis";
import { isSuperAdmin } from "utils/utils";



export default function MainNav() {
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user || {};
  const handleMessage = useHandleMessage();
  const is_super_admin = isSuperAdmin({ user });
  const firstLetter = user?.userName?.slice(0, 1) || "U";
  const [notifications, setNotifications] = useState([]);
  const userRole = user?.role;
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  // Memoized language selection handler
  const selectLanguageHandler = useCallback(() => {
    const currentLang = router.locale.toLowerCase();
    router.push(router.asPath, undefined, { locale: currentLang === 'ar' ? "en" : "ar" });
  }, [router]);

  const logOut = () => {
    signOut();
    Cookies.remove('user-token');

  };

  const fetchNotifications = async () => {
    try {
      const data = await API.getAllRequestJoin({
        filters: "seen_by=false",
        page: 1,
        limit: 10,
      });
      setNotifications(data.items);
    } catch (error) {
      handleMessage(error);
    }
  };
  const readNotification = async (id) => {
    try {
      await API.markAsReadRequestJoin(id);
      setNotifications(prev => {
        const filteredNotifications = prev.filter(notification => notification._id != id);
        return filteredNotifications;
      })
    } catch (error) {
      handleMessage(error);
    }
  };

  useEffect(() => {
    is_super_admin && fetchNotifications();
  }, [is_super_admin])


  return (
    <Disclosure
      as="nav"
      style={{ zIndex: 9999 }}
      className="sticky top-0 bg-white dark:bg-gray-800"
    >
      {() => (
        <>
          <div className="px-2 sm:px-6">
            <div className="relative flex items-center justify-between h-16">
              <div className="inset-y-0 left-0 flex items-center sm:hidden">
              </div>
              <div className="flex items-center justify-start flex-1 sm:items-stretch sm:justify-start">
                <div className="flex items-center flex-shrink-0 w-12 md:w-52">
                  <Link href="/">
                    <MainLogo className="cursor-pointer" />
                  </Link>
                </div>
              </div>

              <div className="items-center hidden gap-2 md:flex">

                <Button onClick={selectLanguageHandler} className="flex items-center justify-center w-8 h-8 px-2 py-2 text-sm bg-gray-100 rounded-full cursor-pointer text-dark hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-400">
                  {router.locale.includes("ar") ? "EN" : "AR"}
                </Button>




                {theme === "light" && (
                  <SunIcon
                    onClick={() => {
                      dispatch(toggleTheme("dark"));
                    }}
                    className="w-8 h-8 px-2 py-2 mx-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-400"
                  />
                )}
                {theme === "dark" && (
                  <MoonIcon
                    onClick={() => {
                      dispatch(toggleTheme("light"));
                    }}
                    className="w-8 h-8 px-2 py-2 mx-2 text-white bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-400"
                  />
                )}
              </div>
              <Popover className="relative">
                <PopoverHandler className="flex items-center justify-center">
                  <button >
                    <Badge content={notifications?.length}>
                      <BellIcon className="flex items-center justify-center w-8 h-8 p-2 mx-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-400" />
                    </Badge>

                  </button>
                </PopoverHandler>
                <PopoverContent className="absolute right-0 z-50 w-64 mt-2 bg-white rounded-lg shadow-lg rtl:right-auto rtl:left-0 dark:bg-gray-700 dark:border-gray-400 dark:text-white">
                  {is_super_admin && <>
                    <div className="p-2">
                      <h2 className="mb-2 text-lg font-semibold">{t("join_request_key")}</h2>
                      <ul className="divide-y divide-gray-200">
                        {notifications?.length ? notifications.map(notification => (
                          <li key={notification._id} className="flex justify-between py-2">
                            <div className="flex flex-col">
                              <p className="text-sm">{t("name_key")}: {notification.user_name}</p>
                              <p className="text-xs">{t("email_key")}: {notification.user_email}</p>
                            </div>
                            <button onClick={() => readNotification(notification._id)} className="flex items-center">
                              <EyeIcon className="w-6 h-6 text-primary" />
                            </button>
                          </li>
                        )) : <p className="mb-5 text-xs text-secondary">{t("table_no_data_message_key")}</p>}
                      </ul>
                      <Link href="/dashboard/request-join" className="text-sm font-light text-secondary">
                        <a>{t("view_all_key")}</a>
                      </Link>
                    </div>
                    <hr />
                  </>
                  }
                </PopoverContent>
              </Popover>
              <span className="my-2 ml-5 mr-2 text-transparent border-l-2 border-gray-400 rtl:ml-2 rtl:mr-5 h-3/4">.</span>

              <Popover placement="bottom">
                <PopoverHandler>
                  <Button className="flex items-center justify-between gap-4 px-2 text-black bg-transparent shadow-none dark:text-white hover:shadow-none">

                    <div className="flex items-center justify-center w-10 h-10 p-2 text-sm uppercase bg-gray-100 rounded-full dark:bg-gray-500">
                      {firstLetter}
                    </div>


                    <div className="flex flex-col items-center justify-between">
                      <span> {user?.userName}</span>
                      <span> {user?.email}</span>
                    </div>

                    <ArrowsUpDownIcon className="hidden w-5 md:flex" />
                  </Button>
                </PopoverHandler>
                <PopoverContent className=" w-auto dark:bg-gray-700 dark:border-gray-400 dark:text-white z-[9999]">
                  {user?._id && <div className="flex items-center gap-4 pb-4 mb-4 border-b border-blue-gray-50 ">
                    <div className="flex items-center justify-center w-10 h-10 p-2 text-sm uppercase bg-gray-100 rounded-full dark:bg-gray-500">
                      {firstLetter}
                    </div>
                    {/* <Avatar src="/img/team-4.jpg" alt={user?.name} /> */}
                    <div>
                      <Typography variant="h6" className="dark:text-white">
                        {user?.userName}
                      </Typography>
                      <Typography variant="small" color="gray" className="font-normal dark:text-white">
                        {userRole}
                      </Typography>
                    </div>
                  </div>}
                  <List className="p-0">
                    {/* balance in small device */}
                    {/* btn dark in small device */}
                    <ListItem
                      onClick={() => { dispatch(toggleTheme(`${theme === "light" ? "dark" : "light"}`)) }}
                      className="gap-4 dark:text-gray-100 hover:text-black active:text-dark md:hidden">
                      <ListItemPrefix>
                        {theme === "light" ? (<SunIcon className="w-8" />) : (<MoonIcon className="w-8" />)}
                      </ListItemPrefix>
                      {t("dark_mode_key")}
                    </ListItem>
                    {/* btn language in small device */}
                    <ListItem
                      onClick={selectLanguageHandler}
                      className="gap-4 dark:text-gray-100 hover:text-black active:text-dark md:hidden">

                      <ListItemPrefix>
                        <LanguageIcon className="w-8" />
                      </ListItemPrefix>
                      {/* {t("dark_mode_key")} */}
                      {router.locale.includes("ar") ? "English" : "عربي"}
                    </ListItem>





                    {!user?._id ? (<Link href="/login">
                      <ListItem
                        className="gap-4 dark:text-gray-100 hover:text-black active:text-dark">
                        <ListItemPrefix>
                          <ArrowRightOnRectangleIcon className="w-8" />
                        </ListItemPrefix>
                        {t("sign_in_key")}
                      </ListItem>
                    </Link>) : (
                      <>
                        <Link href="/dashboard">
                          <ListItem
                            as={"a"}
                            className="gap-4 dark:text-gray-100 hover:text-black active:text-dark">
                            <ListItemPrefix>
                              <FaceSmileIcon className="w-8" />
                            </ListItemPrefix>
                            {t("dashboard_key")}
                          </ListItem>
                        </Link>
                        <ListItem
                          onClick={logOut}
                          className="gap-4 dark:text-gray-100 hover:text-black active:text-dark">
                          <ListItemPrefix>
                            <ArrowLeftOnRectangleIcon className="w-8" />
                          </ListItemPrefix>
                          {t("sign_out_key")}
                        </ListItem>
                      </>
                    )}


                  </List>
                </PopoverContent>
              </Popover>

            </div>
          </div>
        </>
      )
      }
    </Disclosure >
  );
}
