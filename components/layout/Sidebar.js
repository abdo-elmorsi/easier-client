import React from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  RectangleStackIcon,
  UsersIcon,

} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo } from "react";
import { Overview, Settlement } from "components/icons";
import { useSavedState } from "hooks";
import { Button } from "components/UI";
// import { ClearStorageButton } from "components/global";


const Sidebar = React.memo(() => {
  const router = useRouter();

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
      nameAR: "تقرير دفع الايجار ",
      nameEN: "Rent Payment Report",
      href: "/dashboard/rent-payment-report",
      current: router.pathname == "/dashboard/rent-payment-report",
      icon: <BookOpenIcon className="w-5 h-5" />,
      submenuOpen: false,
    },
  ], [router.pathname]);



  return (
    // w-14 hover:w-64
    <div className={`flex flex-col flex-shrink-0 min-h-full transition-all duration-300 bg-white border-none hover:w-64 w-14 ${fixedSideBar ? "md:w-64" : ""} sidebar text-text dark:bg-gray-900 `}>
      <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-auto">
        <ul className="flex flex-col py-4 space-y-1">


          {Links.map((tab) => (
            <li key={tab.href}>
              <Link href={tab.href}>
                <a
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
                </a>
              </Link>
            </li>
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