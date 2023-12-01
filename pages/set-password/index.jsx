import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Custom
import { useHandleMessage } from "hooks";
import { userSetPassword } from "helper/apis/auth";
import { Spinner, Button } from "components/UI";
import { Input } from "components/formik";
import { Logo } from "components/icons";
import { getFirstError } from "utils/utils";

const SetPassword = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { query } = router;
  const [isLoading, setIsLoading] = useState(false);
  const handleMessage = useHandleMessage();
  const initialValues = {
    password: "",
    repeatedPassword: "",
    // terms_and_condition: false,
  };

  const loginValidation = Yup.object().shape({
    password: Yup.string()
      .min(8, t("password_must_be_at_least_8_characters_key"))
      .required(t("password_is_required_key"))
      .trim(),
    repeatedPassword: Yup.string()
      .required(t("Please_repeat_your_password_key"))
      .oneOf([Yup.ref('password'), null], t("Passwords_must_match_key")),
    // terms_and_condition: Yup.boolean().oneOf([true], t("You_must_accept_the_terms_and_conditions_key")),
  });

  const onSubmit = async (values) => {
    if (!query.code || !query.token) {
      handleMessage(t("something_went_wrong_please_use_a_valid_url_key"));
      return;
    }
    const submitData = {
      password: values.password,
      password_confirmation: values.repeatedPassword,
      terms_and_condition: 1,
      code: query.code,
      token: query.token
    };
    setIsLoading(true);
    try {
      await userSetPassword(submitData);
      handleMessage(t("password_add_successfully_key"), "success");
      router.push('/login');
    } catch ({ data }) {
      handleMessage(data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen dark:bg-dark dark:bg-gray-800">

      <div className="hidden bg-center bg-cover login md:block md:w-1/2">
        <div className="flex flex-col items-center justify-center h-screen">
          <Logo className="text-white w-52" />
        </div>
      </div>
      <div className="w-full px-4 md:w-1/2 md:px-12 xl:px-48">
        <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">{t("set_password_key")}</h1>
        <p className="mb-2 text-sm text-gray-500 dark:text-white">{t("set_password_for_new_corporation_key")}</p>
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidation}
          onSubmit={onSubmit}
        >
          {(formikProps) => (
            <Form className="flex flex-col">
              <div className="mb-4">
                <Input
                  label={t("password_key")}
                  placeholder={t("enter_password_key")}
                  name="password"
                  type="password"
                  {...formikProps}
                />
              </div>
              <div className="mb-2">

                <Input
                  label={t("repeated_password_key")}
                  placeholder={t("re_enter_password_key")}
                  name="repeatedPassword"
                  type="password"
                  {...formikProps}
                />
              </div>
              {/* <div className=" flex gap-2">
                <label htmlFor="terms_and_condition">{t("terms_and_condition_key")}</label>
                <Field
                  id="terms_and_condition"
                  className={"focus:outline-none"}
                  type="checkbox"
                  name="terms_and_condition"
                />
              </div>
              {formikProps.touched.terms_and_condition && formikProps.errors.terms_and_condition && (
                <p className="text-red-500">{formikProps.errors.terms_and_condition}</p>
              )} */}
              <Button
                className="btn--primary mt-2"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                    {t("loading_key")}
                  </>
                ) : (
                  t("save_key")
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SetPassword;

SetPassword.getLayout = function PageLayout(page) {
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