import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import * as Yup from "yup";

// Custom
import { useHandleMessage, useInput } from "hooks";
import { userForgetPassword, userLogin, userVerifyCode } from "helper/apis/auth";
import { Spinner, Button, Input } from "components/UI";
import { Logo } from "components/icons";
import { getFirstError } from "utils/utils";
import Link from "next/link";

const ForgotPassword = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleMessage = useHandleMessage();
  const [token, setToken] = useState("");

  const [step, setStep] = useState(1);
  const email = useInput("", "email", true)
  const code = useInput("", "", null)
  console.log(email.isValid);
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (step == 1) {
        const { data } = await userForgetPassword({ email: email.value });
        console.log(data.token);
        setToken(data.token);
        setStep(2);
      } else {
        const response = await userVerifyCode({ code: code.value, token });
        router.push("/login")
      }
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

        <form>
          <div className="w-80 text-start">


            <h1 className="dark:text-white mb-4">{step == 1 ? t("forgot_password_key") : t("reset_password_key")}</h1>
            <div className="flex flex-col gap-4">
              <div className="mb-4">
                {step == 1 ? (<Input
                  label={t("email_address_key")}
                  name="email"
                  {...email.bind}
                />) : (
                  <Input
                    label={t("code_key")}
                    name="email"
                    {...code.bind}
                  />
                )}
              </div>
              <div className="mb-4">
                <Button type="submit" disabled={(step == 1 && (!email.value || !email.isValid)) || (step == 2 && !code.value) || isLoading} onClick={onSubmit} className="btn--primary w-full">
                  {isLoading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                      {t("loading_key")}
                    </>
                  ) : (
                    t("continue_key")
                  )}
                </Button>
              </div>
              <p className="dark:text-white">
                <span>{t("have_an_account_key")}?</span>

                <Link href={"/login"}>
                  <span className="text-primary cursor-pointer"> {t("sign_in_key")}</span>
                </Link>
              </p>
            </div>

          </div>
        </form>
      </div>
    </div >
  );
};

export default ForgotPassword;

ForgotPassword.getLayout = function PageLayout(page) {
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
