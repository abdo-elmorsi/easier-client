import Button from "components/UI/Button";
import Input from "components/formik/Input";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { userLogin } from "helper/apis/login";
import { toast } from "react-toastify";
import Spinner from "components/UI/Spinner";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

const Login = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    username: "",
    password: "",
  };

  const loginValidation = Yup.object().shape({
    username: Yup.string().required(t("username is required")).trim(),
    password: Yup.string()
      .min(6, t("password must be at least 6 characters"))
      .required(t("password is required"))
      .trim(),
  });

  const onSubmit = async (values) => {
    const submitData = {
      email: values.username,
      password: values.password,
    };
    setIsLoading(true);
    try {
      const respond = await userLogin(submitData);
      const result = await signIn("credentials", {
        redirect: false,
        user: JSON.stringify(respond),
      });
      router.replace("/");
      toast.success(t("Login Success!"));
    } catch (e) {
      toast.error(e?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login flex h-screen flex-col items-start justify-center bg-cover bg-center px-6 sm:px-8 md:px-16 xl:px-32">
      <img
        className="mx-auto mb-3 block h-8 md:mx-1"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
        alt="Your Company"
      />
      <h2 className="mx-auto mb-6 text-3xl text-gray-800 dark:text-white md:mx-0 lg:text-4xl">
        {t("sign in to your account")}
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={loginValidation}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form className="flex w-full flex-col md:w-2/5 lg:w-1/4">
              <Input
                label={t("username")}
                name="username"
                type="text"
                placeholder={t("username")}
              />
              <Input
                label={t("password")}
                name="password"
                type="password"
                placeholder={t("password")}
              />
              <Button
                disabled={isLoading}
                className="mt-6 flex items-center justify-center"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-3 h-4 w-4 rtl:ml-3" /> {t("loading")}
                  </>
                ) : (
                  t("login")
                )}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Login;

Login.getLayout = function PageLayout(page) {
  return <>{page}</>;
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
