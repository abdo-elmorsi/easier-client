import React, { Fragment } from "react";
import { useRouter } from "next/router";
import {
  HomeIcon,
  InboxIcon,
  ChatBubbleBottomCenterTextIcon,
  BellIcon,
  UserIcon,
  Cog8ToothIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const navigation = [
  {
    name: { en: "Main", ar: "الرئيسية" },
    tabs: [
      {
        nameAR: "الرئيسية",
        nameEN: "Dashboard",
        href: "/dashboard",
        current: false,
        icon: <HomeIcon className="h-5 w-5" />,
      },
      {
        nameAR: "سبورة",
        nameEN: "Board",
        href: "/dashboard/board",
        current: false,
        icon: <InboxIcon className="h-5 w-5" />,
      },
      {
        nameAR: "الرسائل",
        nameEN: "Messages",
        href: "/dashboard",
        current: false,
        icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />,
      },
      {
        nameAR: "الاشعارات",
        nameEN: "Notifications",
        href: "/dashboard",
        current: false,
        icon: <BellIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    name: { en: "Settings", ar: "الاعدادات" },
    tabs: [
      {
        nameAR: "الملف الشخصي",
        nameEN: "Profile",
        href: "/dashboard",
        current: false,
        icon: <UserIcon className="h-5 w-5" />,
      },
      {
        nameAR: "الإعدادات",
        nameEN: "Settings",
        href: "/dashboard",
        current: false,
        icon: <Cog6ToothIcon className="h-5 w-5" />,
      },
    ],
  },
];

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="flex w-14 flex-col border-none bg-blue-900 text-white transition-all duration-300 hover:w-64 dark:bg-gray-900 md:w-64">
      <div className="flex flex-grow flex-col justify-between overflow-y-auto overflow-x-hidden">
        <ul className="flex flex-col space-y-1 py-4">
          {navigation.map((item) => (
            <Fragment key={item.name.en}>
              <li className="hidden px-5 md:block">
                <div className="flex h-8 flex-row items-center">
                  <div className="text-sm font-light uppercase tracking-wide text-gray-400">
                    {router.locale === "en" ? item.name.en : item.name.ar}
                  </div>
                </div>
              </li>
              {item.tabs.map((tab) => (
                <li key={tab.nameEN}>
                  <Link href={tab.href} key={tab.nameEN}>
                    <a className="text-white-600 hover:text-white-800 relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6 hover:border-blue-500 hover:bg-blue-800 focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-4 dark:hover:border-gray-800 dark:hover:bg-gray-600">
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
            </Fragment>
          ))}
        </ul>
        <p className="mb-14 hidden px-5 py-3 text-center text-xs md:block">
          Copyright @2023
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
