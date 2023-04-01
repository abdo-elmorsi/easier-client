import Button from "components/UI/Button";
import Input from "components/formik/Input";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";

const Login = () => {
  const { t } = useTranslation("common");

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

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className="login flex h-screen flex-col items-start justify-center bg-cover bg-center px-6 sm:px-8 md:px-16 xl:px-32">
      <img
        className="mx-auto mb-3 block h-8 md:mx-1"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
        alt="Your Company"
      />
      <h2 className="mx-auto mb-6 text-3xl text-gray-800 md:mx-0 lg:text-4xl">
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
                type="username"
                placeholder={t("username")}
              />
              <Input
                label={t("password")}
                name="password"
                type="password"
                placeholder={t("password")}
              />
              <Button className="mt-6" type="submit">
              {t("login")}
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
