import { useEffect, useState } from "react";
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

const navigation = [
  { name: "Home", href: "/", current: false },
  { name: "About", href: "/about", current: false },
  { name: "Dashboard", href: "/dashboard", current: false },
];

const selectOptions = [
  { value: "ar", label: "ar", image: "/flags/ar.svg" },
  { value: "en", label: "en", image: "/flags/en.svg" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MainNav() {
  const [nav, setNav] = useState(navigation);
  const router = useRouter();
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (router.locale === "ar") {
      document.documentElement.lang = "ar";
      document.body.dir = "rtl";
    } else {
      document.documentElement.lang = "en";
      document.body.dir = "ltr";
    }
  }, [router.locale]);

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      dispatch(toggleTheme("light"));
      document.documentElement.classList.remove("dark");
    } else if (localStorage.getItem("theme") === "dark") {
      dispatch(toggleTheme("dark"));
      document.documentElement.classList.add("dark");
    } else {
      dispatch(toggleTheme("dark"));
    }
  }, [theme]);

  useEffect(() => {
    // every time the router changes, we need to update the nav style.
    const newNav = navigation.map((item) => {
      if (router.pathname === item.href) {
        return { ...item, current: true };
      } else {
        return { ...item, current: false };
      }
    });
    setNav(newNav);
  }, [router]);

  const selectLanguageHandler = (value) => {
    router.push(router.asPath, undefined, { locale: value });
  };

  return (
    <Disclosure
      as="nav"
      style={{ direction: "ltr" }}
      className="dark:bg-gray-800 shadow-md"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
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
                <div className="hidden sm:block ml-auto">
                  <div className="flex space-x-4">
                    {nav.map((item) => (
                      <Link href={item.href} key={item.name}>
                        <a
                          className={classNames(
                            item.current
                              ? "dark:bg-gray-900 dark:text-white border-b-2 dark:border-transparent border-blue-700"
                              : "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white border-b-2 border-transparent dark:border-transparent hover:border-blue-700",
                            "dark:rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <ReactSelect
                options={selectOptions}
                defaultValue={selectOptions.find(
                  (ele) => ele.value === router.locale
                )}
                onSelectChange={selectLanguageHandler}
                placeholder="Select a language"
                isSearchable={false}
                formatOptionLabel={(client) => (
                  <div className={`flex items-center`}>
                    <img className="w-4 h-4" src={client.image} alt="logo" />
                    <span className="ml-2 capitalize">{client.label}</span>
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
                  className="ml-2 h-6 w-6 text-white cursor-pointer"
                />
              )}
              <Button className={`ml-4`}>login</Button>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {nav.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={classNames(
                      item.current
                        ? "dark:bg-gray-900 dark:text-white border-b-2 dark:border-transparent  border-blue-700"
                        : "dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white border-b-2 border-transparent dark:border-transparent hover:border-blue-700",
                      "block dark:rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
