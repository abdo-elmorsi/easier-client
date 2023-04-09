import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  HomeIcon,
  InboxIcon,
  ChatBubbleBottomCenterTextIcon,
  BellIcon,
  UserIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTranslation } from "next-i18next";


const navigation = [
  {
    nameAR: "الرئيسية",
    nameEN: "Dashboard",
    href: "/dashboard",
    current: false,
    icon: <HomeIcon className="h-5 w-5" />,
    category: "main",
  },
  {
    nameAR: "سبورة",
    nameEN: "Board",
    href: "/dashboard/board",
    current: false,
    icon: <InboxIcon className="h-5 w-5" />,
    category: "main",
  },
  {
    nameAR: "الرسائل",
    nameEN: "Messages",
    href: "/dashboard/messages",
    current: false,
    icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />,
    category: "main",
  },
  {
    nameAR: "الاشعارات",
    nameEN: "Notifications",
    href: "/dashboard/notifications",
    current: false,
    icon: <BellIcon className="h-5 w-5" />,
    category: "main",
  },
  {
    nameAR: "الملف الشخصي",
    nameEN: "Profile",
    href: "/dashboard/profile",
    current: false,
    icon: <UserIcon className="h-5 w-5" />,
    category: "setting",
  },
  {
    nameAR: "الإعدادات",
    nameEN: "Settings",
    href: "/dashboard/settings",
    current: false,
    icon: <Cog8ToothIcon className="h-5 w-5" />,
    category: "setting",
  },
];

const Sidebar = () => {
  const [nav, setNav] = useState(navigation);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    // every time the router changes, we need to update the nav style.
    const newNav = navigation.map((tab) => {
      if (router.pathname === tab.href) {
        return { ...tab, current: true };
      } else {
        return { ...tab, current: false };
      }
    });
    setNav(newNav);
  }, [router]);

  return (
    <div className="sidebar flex w-14 flex-col border-none bg-blue-900 text-white transition-all duration-300 hover:w-64 dark:bg-gray-900 md:w-64">
      <div className="flex flex-grow flex-col overflow-y-auto overflow-x-hidden">
        <div className="mb-3 pt-5">
          <div className="sidebar__image-box relative mx-auto mb-4 hidden h-28 w-28 overflow-hidden rounded-full  shadow-lg md:block">
            <img
              src="/images/building-1.jpg"
              className="sidebar__image block h-full w-full object-cover object-center transition-all duration-500"
            />
          </div>
          <div className="sidebar__username hidden mx-auto text-center capitalize md:block">
            abdelrahman
          </div>
        </div>
        <ul className="flex flex-col space-y-1 py-4">
          <li className="hidden px-5 md:block">
            <div className="flex h-8 flex-row items-center">
              <div className="text-sm font-light uppercase tracking-wide text-gray-400">
                {t("main")}
              </div>
            </div>
          </li>
          {nav
            .filter((item) => item.category === "main")
            .map((tab) => (
              <li key={tab.nameEN}>
                <Link href={tab.href} key={tab.nameEN}>
                  <a
                    className={`${
                      tab.current
                        ? "text-white-800 border-blue-500 bg-blue-800 dark:border-gray-800 dark:bg-gray-600"
                        : "hover:text-white-800 hover:border-blue-500 hover:bg-blue-800 dark:hover:border-gray-800 dark:hover:bg-gray-600"
                    } text-white-600  relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6  focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-4 `}
                  >
                    <span className="ml-4 inline-flex items-center justify-center">
                      {tab.icon}
                    </span>
                    <span className="ml-2 truncate text-sm tracking-wide">
                      {router.locale === "en" ? tab.nameEN : tab.nameAR}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          <li className="hidden px-5 md:block">
            <div className="flex h-8 flex-row items-center">
              <div className="text-sm font-light uppercase tracking-wide text-gray-400">
                {t("setting")}
              </div>
            </div>
          </li>
          {nav
            .filter((item) => item.category === "setting")
            .map((tab) => (
              <li key={tab.nameEN}>
                <Link href={tab.href} key={tab.nameEN}>
                  <a
                    className={`${
                      tab.current
                        ? "text-white-800 border-blue-500 bg-blue-800 dark:border-gray-800 dark:bg-gray-600"
                        : "hover:text-white-800 hover:border-blue-500 hover:bg-blue-800 dark:hover:border-gray-800 dark:hover:bg-gray-600"
                    } text-white-600  relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6  focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-4 `}
                  >
                    <span className="ml-4 inline-flex items-center justify-center">
                      {tab.icon}
                    </span>
                    <span className="ml-2 truncate text-sm tracking-wide">
                      {router.locale === "en" ? tab.nameEN : tab.nameAR}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
        </ul>
        <p className="mb-14 mt-auto hidden px-5 py-3 text-center text-xs md:block">
          Copyright @2023
        </p>
      </div>
    </div>
  );
};

export default Sidebar;