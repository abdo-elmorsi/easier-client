import React, { useState } from "react";
import Input from "components/formik/Input";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import Button from "components/UI/Button";

const ChangePassword = () => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values) => {
    console.log(values);
  };

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const changePasswordValidation = Yup.object().shape({
    oldPassword: Yup.string()
      .min(6, t("password must be at least 6 characters"))
      .required(t("old password is required"))
      .trim(),
    newPassword: Yup.string()
      .min(6, t("password must be at least 6 characters"))
      .required(t("new password is required"))
      .trim(),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("password must match new password"))
      .required(t("password is required"))
      .trim(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={changePasswordValidation}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form className="flex flex-col items-center justify-around gap-8 sm:m-5 lg:flex-row">
            <div className="w-full lg:w-2/5">
              <Input
                label={t("old password")}
                name="oldPassword"
                type="password"
                placeholder={t("old password")}
                className={"w-full"}
              />
              <Input
                label={t("new password")}
                name="newPassword"
                type="password"
                placeholder={t("new password")}
                className={"w-full"}
              />
              <Input
                label={t("confirm new password")}
                name="confirmNewPassword"
                type="password"
                placeholder={t("confirm new password")}
                className={"w-full"}
              />
              <Button
                disabled={isLoading}
                className="mx-auto mt-6 flex w-full items-center justify-center"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-3 h-4 w-4 rtl:ml-3" /> {t("loading")}
                  </>
                ) : (
                  t("update")
                )}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ChangePassword;
