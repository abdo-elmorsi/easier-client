import Button from "components/UI/Button";
import Input from "components/formik/Input";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const Login = () => {
  const initialValues = {
    username: "",
    password: "",
  };

  const loginValidation = Yup.object().shape({
    username: Yup.string().required("Username is required").trim(),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required")
      .trim(),
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className="login flex flex-col items-start justify-center h-screen bg-center bg-cover px-6 sm:px-8 xl:px-32 md:px-16">
      <img
        className="h-8 block mb-3 mx-auto md:mx-1"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
        alt="Your Company"
      />
      <h2 className="text-gray-800 text-3xl lg:text-4xl mb-6 mx-auto md:mx-0">
        Sign in to your account
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={loginValidation}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form className="flex flex-col w-full md:w-2/5 lg:w-1/4">
              <Input
                label="Username"
                name="username"
                type="username"
                placeholder="username"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="password"
              />
              <Button className="mt-6" type="submit">
                Login
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
