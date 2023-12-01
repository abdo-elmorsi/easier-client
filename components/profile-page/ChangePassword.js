import React, { useState } from "react";
import Input from "components/formik/Input";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { Button, Spinner } from "components/UI";
import { updatePassword } from "helper/apis/tenants";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const data = await updatePassword(values);
      toast.success(data.message);
    } catch (response) {
      toast.error(response.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const changePasswordValidation = Yup.object().shape({
    oldPassword: Yup.string()
      .min(6, t("password_must_be_at_least_6_characters_key"))
      .required(t("old_password_is_required_key"))
      .trim(),
    newPassword: Yup.string()
      .min(6, t("password_must_be_at_least_6_characters_key"))
      .required(t("new_password_is_required_key"))
      .trim(),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("password_must_match_new_password_key"))
      .required(t("password_is_required_key"))
      .trim(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={changePasswordValidation}
      onSubmit={onSubmit}
    >
      {() => {
        return (
          <Form className="flex flex-col items-center justify-around gap-8 sm:m-5 lg:flex-row">
            <div className="flex flex-col w-full gap-4 lg:w-2/5">
              <Input
                label={t("old_password_key")}
                name="oldPassword"
                type="password"
                className={"w-full"}
              />
              <Input
                label={t("new_password_key")}
                name="newPassword"
                type="password"
                className={"w-full"}
              />
              <Input
                label={t("confirm_new_password_key")}
                name="confirmNewPassword"
                type="password"
                className={"w-full"}
              />
              <Button
                disabled={isLoading}
                className="flex items-center justify-center w-full mx-auto mt-6"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-3 rtl:ml-3" /> {t("loading_key")}
                  </>
                ) : (
                  t("update_key")
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
