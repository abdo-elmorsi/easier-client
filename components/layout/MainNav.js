import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
    Bars3Icon,
    SunIcon,
    MoonIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "components/UI/Button";
import { toggleTheme } from "store/ThemeSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "components/select/ReactSelect";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { getSession, signOut } from "next-auth/react";
import { removeCookie } from "utils/cookies";

const selectOptions = [
    { value: "ar", label: "العربية", image: "/flags/ar.svg" },
    { value: "en", label: "english", image: "/flags/en.svg" },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function MainNav() {
    const router = useRouter();
    const { theme } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const [session, setSession] = useState("");
    useEffect(() => {
        (async () => {
            try {
                const respond = await getSession();
                if (respond) {
                    setSession(respond);
                } else {
                    setSession("");
                }
            } catch (error) {
                toast.error(error.message);
            }
        })();
    }, [router]);

    const selectLanguageHandler = (value) => {
        router.push(router.asPath, undefined, { locale: value });
    };

    return (
        <Disclosure
            as="nav"
            className="relative z-50 shadow-md dark:bg-gray-800"
        >
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    {open ? (
                                        <XMarkIcon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Bars3Icon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="block h-8 w-auto lg:hidden"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                        alt="Your Company"
                                    />
                                    <img
                                        className="hidden h-8 w-auto lg:block"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="ml-6 hidden rtl:mr-6 sm:block">
                                    <div className="flex items-center gap-2">
                                        <Link href={"/"}>
                                            <a
                                                className={classNames(
                                                    router.pathname === "/"
                                                        ? "active-desktop-nav"
                                                        : "hover-desktop-nav",
                                                    "default-desktop-nav"
                                                )}
                                            >
                                                {t("home")}
                                            </a>
                                        </Link>
                                        <Link href={"/contact"}>
                                            <a
                                                className={classNames(
                                                    router.pathname ===
                                                        "/contact"
                                                        ? "active-desktop-nav"
                                                        : "hover-desktop-nav",
                                                    "default-desktop-nav"
                                                )}
                                            >
                                                {t("contact")}
                                            </a>
                                        </Link>
                                        {session && (
                                            <Link href={"/dashboard"}>
                                                <a
                                                    className={classNames(
                                                        router.pathname ===
                                                            "/dashboard"
                                                            ? "active-desktop-nav"
                                                            : "hover-desktop-nav",
                                                        "default-desktop-nav"
                                                    )}
                                                >
                                                    {t("dashboard")}
                                                </a>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <ReactSelect
                                className="ml-3"
                                options={selectOptions}
                                defaultValue={selectOptions.find(
                                    (ele) => ele.value === router.locale
                                )}
                                onSelectChange={selectLanguageHandler}
                                placeholder="Select a language"
                                isSearchable={false}
                                formatOptionLabel={(client) => (
                                    <div className={`flex items-center`}>
                                        <img
                                            className="h-4 w-4"
                                            src={client.image}
                                            alt="logo"
                                        />
                                        <span className="ml-2 capitalize rtl:mr-2 rtl:ml-0">
                                            {client.label}
                                        </span>
                                    </div>
                                )}
                            />
                            {theme === "light" && (
                                <SunIcon
                                    onClick={() => {
                                        dispatch(toggleTheme("dark"));
                                    }}
                                    className="ml-2 h-6 w-6 cursor-pointer"
                                />
                            )}
                            {theme === "dark" && (
                                <MoonIcon
                                    onClick={() => {
                                        dispatch(toggleTheme("light"));
                                    }}
                                    className="ml-2 h-6 w-6 cursor-pointer text-white"
                                />
                            )}
                            {!session && (
                                <Button
                                    className="ml-4"
                                    onClick={() => router.push("/login")}
                                >
                                    {t("login")}
                                </Button>
                            )}
                            {session && (
                                <Button
                                    className="ml-4"
                                    onClick={() => {
                                        removeCookie("updated-image");
                                        signOut();
                                    }}
                                >
                                    {t("logout")}
                                </Button>
                            )}
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            <Link href={"/"}>
                                <a
                                    className={classNames(
                                        router.pathname === "/"
                                            ? "active-mobile-nav"
                                            : "hover-mobile-nav",
                                        "default-mobile-nav"
                                    )}
                                >
                                    {t("home")}
                                </a>
                            </Link>
                            <Link href={"/contact"}>
                                <a
                                    className={classNames(
                                        router.pathname === "/contact"
                                            ? "active-mobile-nav"
                                            : "hover-mobile-nav",
                                        "default-mobile-nav"
                                    )}
                                >
                                    {t("contact")}
                                </a>
                            </Link>
                            {session && (
                                <Link href={"/dashboard"}>
                                    <a
                                        className={classNames(
                                            router.pathname === "/dashboard"
                                                ? "active-mobile-nav"
                                                : "hover-mobile-nav",
                                            "default-mobile-nav"
                                        )}
                                    >
                                        {t("dashboard")}
                                    </a>
                                </Link>
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
