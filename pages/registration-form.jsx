import React, { useCallback, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Custom
import { useHandleMessage, useInput } from "hooks";
import { PhoneInput, Button, FileInput, Input, Spinner } from "components/UI";

import { getFirstError } from "utils/utils";
import { Logo, MainLogo } from "components/icons";
import { registrationRequest } from "helper/apis/corporate";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const RegistrationRequest = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const handleMessage = useHandleMessage();
  const [submitted, setSubmitted] = useState(false);

  const name = useInput("", "", true);
  const [logo, setLogo] = useState({});
  const vat_number = useInput("", "number", true);
  const commercial_registration_number = useInput("", "number", true);

  // **************************************  coordinators logic **************************************
  const [coordinators, setCoordinators] = useState([
    { name: "", email: "", limit: "", phone: "+966" },
  ]);
  const handleAddCoordinator = () =>
    setCoordinators((prev) => [
      ...prev,
      { name: "", email: "", limit: "", phone: "+966" },
    ]);

  const handleRemoveCoordinator = useCallback(
    (coordinatorIndex) =>
      setCoordinators((prev) => prev.filter((_, i) => i !== coordinatorIndex)),
    []
  );

  const handleEditCoordinator = useCallback((field, value, index) => {
    setCoordinators((prev) => {
      const theCoordinator = prev.find((e, i) => i == index);
      theCoordinator[field] = value;
      return [
        ...prev.slice(0, index),
        theCoordinator,
        ...prev.slice(index + 1),
      ];
    });
  }, []);

  // validation Add Coordinator
  const validationAddCoordinator = useCallback(() => {
    const theLastCoordinator = coordinators[coordinators.length - 1];
    if (
      name.value &&
      +vat_number.value &&
      +commercial_registration_number.value
    ) {
      if (!coordinators.length) {
        return true;
      } else if (
        theLastCoordinator.name &&
        theLastCoordinator.phone &&
        theLastCoordinator.email
      ) {
        return true;
      }
    }
  }, [
    name.value,
    vat_number.value,
    commercial_registration_number.value,
    coordinators,
  ]);
  // **************************************  coordinators logic **************************************

  // main validation
  const validation = useCallback(() => {
    if (
      name.value &&
      +vat_number.value &&
      +commercial_registration_number.value &&
      coordinators.length
    ) {
      if (coordinators.length > 1) {
        return true;
      } else if (coordinators.length == 1) {
        if (coordinators[0].name && coordinators[0].email) {
          return true;
        }
      } else {
        return true;
      }
    }
  }, [
    name.value,
    vat_number.value,
    commercial_registration_number.value,
    coordinators.length,
  ]);

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const formData = new FormData();
      formData.append("name", name.value);
      formData.append("logo", logo);
      formData.append("vat_number", vat_number.value);
      formData.append(
        "commercial_registration_number",
        commercial_registration_number.value
      );
      coordinators.forEach((c, index) => {
        formData.append(`coordinators[${index}][name]`, c.name);
        formData.append(`coordinators[${index}][email]`, c.email);
        formData.append(
          `coordinators[${index}][phone]`,
          `${c?.country?.country_code}${c?.phone}`
        );
      });
      const corporate = await registrationRequest(formData);

      handleMessage(t("registration_request_msg_key"), "success");
      router.push("/login");
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.error || data?.message
      );
    } finally {
      setSubmitted(false);
    }
  };

  const selectLanguageHandler = () => {
    const currentLang = router.locale.toLowerCase();
    router.push(router.asPath, undefined, {
      locale: currentLang == "ar" ? "en" : "ar",
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <header className="p-4 bg-white dark:bg-gray-900 dark:text-white">
        <div className="container flex justify-between mx-auto">
          <Link href="/login">
            <Logo className="cursor-pointer text-primary" />
          </Link>

          <Button onClick={selectLanguageHandler} className="w-40 btn--primary">
            {router.locale.includes("ar") ? "English" : "عربي"}
          </Button>
        </div>
      </header>

      <div className="container p-10 mx-auto mt-10 bg-white rounded dark:bg-gray-900">
        <h1 className="mb-8 text-xl border-b font-body dark:text-white">
          {t("registration_form_key")}
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input label={t("corporate_name_key")} {...name.bind} />
          </div>
          <div>
            <FileInput
              accept="image/*"
              value={logo}
              name={"input-file"}
              label={t("corporate_logo_key")}
              placeholder={t("upload_picture_key")}
              errorMsg={""}
              onChange={(value) => setLogo(value)}
            />
          </div>
          <div>
            <Input label={t("vat_number_key")} {...vat_number.bind} />
          </div>
          <div>
            <Input
              label={t("cr_number_key")}
              {...commercial_registration_number.bind}
            />
          </div>
        </div>
        {coordinators.map((c, i) => {
          return (
            <>
              <h3 className="font-bold dark:text-white">
                {t("coordinator_key")} {i + 1}
              </h3>
              <div className="relative p-4 mt-2 mb-6 border rounded-lg shadow md:p-8">
                <span
                  onClick={() => handleRemoveCoordinator(i)}
                  className="absolute flex items-center justify-center w-10 h-10 duration-200 rounded-full cursor-pointer hover:rotate-180 hover:text-white hover:bg-hoverPrimary -top-3 -right-3 rtl:right-auto rtl:-left-3 text-primary bg-secondary"
                >
                  <XMarkIcon width={25} />
                </span>
                <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Input
                      label={t("name_key")}
                      value={c.name}
                      onChange={(e) =>
                        handleEditCoordinator("name", e.target.value, i)
                      }
                    />
                  </div>
                  <div dir="ltr">
                    <PhoneInput
                      dir="ltr"
                      label={t("phone_number_key")}
                      value={c.phone}
                      setValue={(value) =>
                        handleEditCoordinator("phone", value, i)
                      }
                      country={c.country}
                      setCountry={(country) =>
                        handleEditCoordinator("country", country, i)
                      }
                    />
                  </div>
                  <div>
                    <Input
                      dir="ltr"
                      label={t("email_key")}
                      value={c.email}
                      onChange={(e) =>
                        handleEditCoordinator("email", e.target.value, i)
                      }
                      submitted={c.email}
                      validator={{
                        valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email),
                        message: t("value_is_invalid_key"),
                      }}
                    />
                  </div>
                  {i + 1 == coordinators?.length && (
                    <div>
                      <div className="flex justify-end">
                        <Button
                          disabled={
                            coordinators.length == 10 ||
                            !validationAddCoordinator()
                          }
                          onClick={handleAddCoordinator}
                          className={"btn--primary"}
                        >
                          {t("add_new_key")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        })}
        {coordinators.length == 0 && (
          <div>
            <div className="flex justify-end">
              <Button
                disabled={
                  coordinators.length == 10 || !validationAddCoordinator()
                }
                onClick={handleAddCoordinator}
                className={"btn--primary"}
              >
                {t("add_new_key")}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-20">
          <Button
            disabled={submitted || !validation()}
            onClick={handleSubmit}
            className="w-32 btn--primary"
          >
            {submitted ? (
              <>
                <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                {t("loading_key")}
              </>
            ) : (
              t("submit_key")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationRequest;

RegistrationRequest.getLayout = function PageLayout(page) {
  return <>{page}</>;
};

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const routeUrl = context.locale === "ar" ? "/" : `/${context.locale}`;
  if (session) {
    return {
      redirect: {
        destination: routeUrl,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session,
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }
};
