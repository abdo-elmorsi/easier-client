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
import { useSession } from "next-auth/client";
import { updateImage } from "helper/apis/updateImage";
import { getCookie, setCookie } from "utils/cookies";

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
    const { t } = useTranslation("common");
    const [user] = useSession();
    const router = useRouter();
    const [updatedImage, setUpdatedImage] = useState(null);
    const [nav, setNav] = useState(navigation);
    useEffect(() => {
        if (getCookie("updated-image")) {
            setUpdatedImage(getCookie("updated-image"));
        }
    }, []);

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

    const handleChangeImage = (image) => {
        setUpdatedImage(URL.createObjectURL(image));
        (async () => {
            const bodyFormData = new FormData();
            bodyFormData.append("photo", image);
            const data = await updateImage(bodyFormData);
            setUpdatedImage(data.image);
            setCookie("updated-image", data.image, 30);
        })();
    };

    return (
        <div className="sidebar flex w-14 flex-col border-none bg-blue-900 text-white transition-all duration-300 hover:w-64 dark:bg-gray-900 md:w-64">
            <div className="flex flex-grow flex-col overflow-y-auto overflow-x-hidden">
                <div className="mb-3 pt-5">
                    <label
                        for="dropzone-file"
                        className="sidebar__image-box relative mx-auto mb-4 hidden h-28 w-28 cursor-pointer overflow-hidden rounded-full  shadow-lg md:block"
                    >
                        <img
                            src={
                                updatedImage ||
                                user?.user.user?.photo?.secure_url ||
                                "/images/building-1.jpg"
                            }
                            className="sidebar__image block h-full scale-125 object-cover object-center transition-all duration-500"
                        />
                        <span className="sidebar__edit translate-y-1/5 absolute top-1/2 left-1/2 -translate-x-1/2 text-center text-sm opacity-0 transition-all duration-500">
                            {t("edit your account")}
                        </span>
                        <input
                            onChange={(ele) => {
                                handleChangeImage(ele.currentTarget.files[0]);
                            }}
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpg, image/jpeg"
                        />
                    </label>
                    <div className="sidebar__username mx-auto text-center capitalize md:block">
                        {user?.user.user?.userName || User}
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
                                            {router.locale === "en"
                                                ? tab.nameEN
                                                : tab.nameAR}
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
                                            {router.locale === "en"
                                                ? tab.nameEN
                                                : tab.nameAR}
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
