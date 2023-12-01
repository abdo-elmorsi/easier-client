import React, { useState } from "react";
import Input from "components/formik/Input";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { Button, Spinner } from "components/UI";
import FileInput from "components/formik/FileInput";
import { updateProfile } from "helper/apis/tenants";
import { toast } from "react-toastify";
import PropTypes from "prop-types"
import { useSession } from "next-auth/react";

const EditProfileForm = () => {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const { t } = useTranslation("common");

  const { name: userName, email, phone: phoneNumber } = session.user;

  const onSubmit = async (values) => {
    if (values.userName === userName && values.email === email && values.phoneNumber === phoneNumber && !image) {
      toast.warning(t("Make any changes."))
      return;
    }
    if (image?.size / 1000 / 1000 >= 3.1) {
      toast.warning(t("max size of image 3.1 MB"))
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("userName", values.userName);
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);
    image && formData.append("photo", image);

    try {
      const data = await updateProfile(formData);
      toast.success(data.message);
      update({ ...session.user, ...data.user })
    } catch ({ response }) {
      toast.error(response.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    userName: userName || "",
    phoneNumber: phoneNumber || "",
    email: email || "",
  };

  const editProfileValidation = Yup.object().shape({
    userName: Yup.string().required(t("username_is_required_key")).trim(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={editProfileValidation}
      onSubmit={onSubmit}
    >
      {() => {
        return (
          <Form className="flex flex-col items-center justify-around gap-8 sm:m-5 lg:flex-row">
            <div className="flex flex-col items-center justify-center mb-12">
              <FileInput
                label={
                  <div className="relative w-32 h-32 overflow-hidden rounded-full shadow-lg cursor-pointer user__image-box shrink-0 outline outline-1 outline-offset-4 outline-gray-400 sm:h-48 sm:w-48">
                    <img
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : session?.user?.photo
                            ?.secure_url
                      }
                      className="block object-cover object-center w-full h-full transition-all duration-500 scale-105 user__image"
                    />
                    <span className="absolute text-sm text-center text-white transition-all duration-500 -translate-x-1/2 opacity-0 user__edit translate-y-1/5 top-1/2 left-1/2 md:text-lg">
                      {t("change_your_image_key")}
                    </span>
                  </div>
                }
                className={"mb-8"}
                onChange={(event) =>
                  setImage(event.currentTarget.files[0])
                }
              />
              <p className={`text-center text-xs text-gray-500 ${image?.size / 1000 / 1000 >= 3.1 ? `text-red-500` : ""} sm:text-sm`}>
                {t("allowed *.jpeg, *.jpg, *.png, *.gif")}{" "}
                <br></br> {t("max size of 3.1 MB")}
              </p>
            </div>

            <div className="flex flex-col w-full gap-4 lg:w-2/5">
              <Input
                label={t("username_key")}
                name="userName"
                type="text"
                className={"w-full"}
              />
              <Input
                label={t("phone_number_key")}
                name="phoneNumber"
                type="text"
                className={"w-full"}
              />
              <Input
                label={t("email_address_key")}
                name="email"
                type="email"
                className={"w-full"}
              />
              <Button
                disabled={isLoading}
                className="flex items-center justify-center w-full mx-auto mt-6"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />{" "}
                    {t("loading_key")}
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


EditProfileForm.propTypes = {
  session: PropTypes.object.isRequired
}

export default EditProfileForm;
