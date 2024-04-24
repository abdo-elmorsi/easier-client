import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftIcon,
  ChevronRightIcon,
  InboxArrowDownIcon,
  RectangleStackIcon,
  TruckIcon,
  UsersIcon,

} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo } from "react";
import { Overview } from "components/icons";
import { useSavedState } from "hooks";
import { Button } from "components/UI";
// import { ClearStorageButton } from "components/global";
import { isSuperAdmin } from 'utils/utils';
import { useSession } from "next-auth/react";


const Sidebar = React.memo(() => {
  const { data } = useSession();
  const router = useRouter();
  const [activeAdminSubMenu, setActiveAdminSubMenu] = useState(null);
  const is_super_admin = isSuperAdmin(data);
  const [fixedSideBar, setFixedSideBar] = useSavedState(true, "easier-fixed-side-barr-cache")


  const Links = useMemo(() => [

    {
      nameAR: "ملخص",
      nameEN: "overView",
      href: "/dashboard",
      current: router.pathname == "/dashboard",
      icon: <Overview className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "المستأجرين",
      nameEN: "Tenants",
      href: "/dashboard/tenants",
      current: router.pathname == "/dashboard/tenants",
      icon: <UsersIcon className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "الابراج",
      nameEN: "Towers",
      href: "/dashboard/towers",
      current: router.pathname == "/dashboard/towers",
      icon: <BuildingOffice2Icon className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "شقق",
      nameEN: "Apartments",
      href: "/dashboard/apartments",
      current: router.pathname == "/dashboard/apartments",
      icon: <RectangleStackIcon className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "أجراءات",
      nameEN: "Actions",
      icon: <BookOpenIcon className="w-5 h-5" />,
      submenuOpen: activeAdminSubMenu == 4,
      submenu: [
        {
          nameAR: "أجر",
          nameEN: "Rent",
          href: "/dashboard/actions/rental",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/dashboard/actions/rental",
        },
      ]
    },
    {
      nameAR: "تقرير دفع الايجار ",
      nameEN: "Rent Payment Report",
      href: "/dashboard/rent-payment-report",
      current: router.pathname == "/dashboard/rent-payment-report",
      icon: <BookOpenIcon className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "الدردشات",
      nameEN: "Chats",
      href: "/dashboard/chats",
      current: router.pathname == "/dashboard/chats",
      icon: <ChatBubbleLeftIcon className="w-5 h-5" />,
      submenuOpen: false,
    },
    ...(is_super_admin ? [{

      nameAR: "طلبات الانضمام",
      nameEN: "Request Join",
      href: "/dashboard/request-join",
      current: router.pathname == "/dashboard/request-join",
      icon: <InboxArrowDownIcon className="w-5 h-5" />,
      submenuOpen: false,

    }] : [])
  ], [router.pathname, activeAdminSubMenu]);


  return (
    // w-14 hover:w-64
    <div className={`flex flex-col flex-shrink-0  transition-all duration-300 bg-white border-none hover:w-64 w-14 ${fixedSideBar ? "md:w-64" : ""} sidebar text-text dark:bg-gray-900 `}>
      <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-auto">
        <ul className="flex flex-col py-4 space-y-1">


          {Links.map((tab, index) => (
            <React.Fragment key={tab.href}>
              {tab.submenu ? (
                <React.Fragment key={tab.href}>
                  <div className="relative flex flex-row items-center h-11">
                    <button
                      onClick={() =>
                        setActiveAdminSubMenu(() =>
                          tab.submenuOpen ? null : index
                        )
                      }
                      className={`w-full focus:outline-none relative flex h-11 flex-row items-center border-l-4 pr-6 rtl:pr-4 rtl:border-l-0 rtl:border-r-4 dark:text-white dark:hover:text-white hover:border-primary ${tab.submenuOpen ? 'border-primary' : 'border-transparent'
                        }`}
                    >
                      <span className="inline-flex items-center justify-center ml-4">
                        {tab.icon}
                      </span>
                      <span className="ml-2 text-sm tracking-wide truncate">
                        {router.locale === 'en' ? tab.nameEN : tab.nameAR}
                      </span>
                      <span className="absolute inset-y-0 flex items-center pl-2 duration-300 opacity-0 arrow-icon right-2 rtl:pr-2 rtl:right-auto rtl:left-2">
                        <ChevronRightIcon
                          className={`duration-200 w-5 h-5 ${tab.submenuOpen ? 'rtl:rotate-90' : 'rotate-90 rtl:-rotate-180'}`}
                        />
                      </span>
                    </button>
                  </div>
                  {tab.submenuOpen && (
                    <ul className="flex flex-col px-2 py-4 space-y-1">
                      {tab.submenu.map((subTab) => (
                        <li key={subTab.href} className="tab_link">
                          <Link href={subTab.href}>
                            <div
                              className={`${subTab.current
                                ? 'dark:text-gray-100 border-primary'
                                : 'dark:text-white border-transparent hover:border-primary dark:hover:border-primary'
                                } text-white-600 relative flex h-11 flex-row items-center border-l-4 focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-2`}
                            >
                              <span className="inline-flex items-center justify-center ml-4 duration-500 sub-menu-icon">
                                <ArrowRightCircleIcon className="w-5 h-5 rtl:rotate-180" />
                              </span>
                              <span className="ml-2 text-sm tracking-wide truncate">
                                {router.locale === 'en' ? subTab.nameEN : subTab.nameAR}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </React.Fragment>
              ) : (
                <li onClick={() => activeAdminSubMenu && setActiveAdminSubMenu(null)}>
                  <Link href={tab.href}>
                    <div
                      className={`${tab.current
                        ? 'dark:text-gray-100 border-primary'
                        : 'dark:text-white border-transparent hover:border-primary dark:hover:border-primary'
                        } text-white-600 relative flex h-11 flex-row items-center border-l-4 pr-6 focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-4`}
                    >
                      <span className="inline-flex items-center justify-center ml-4">
                        {tab.icon}
                      </span>
                      <span className="ml-2 text-sm tracking-wide truncate">
                        {router.locale === 'en' ? tab.nameEN : tab.nameAR}
                      </span>
                    </div>
                  </Link>
                </li>
              )}
            </React.Fragment>
          ))}


        </ul>






        <Button onClick={() => setFixedSideBar(!fixedSideBar)} className="mx-auto mt-auto text-xs tracking-wide text-center truncate dark:text-primary">
          <ArrowLeftCircleIcon className={` transition-all duration-300 hover:scale-110 ${!fixedSideBar ? "-rotate-180 rtl:rotate-0" : "rtl:rotate-180"}`} width={25} />
        </Button>
        {/* <ClearStorageButton /> */}
      </div>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';

export default Sidebar;