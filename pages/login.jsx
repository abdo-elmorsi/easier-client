import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Custom
import { useHandleMessage, useInput } from "hooks";
import { Spinner, Button, Input } from "components/UI";
import { Logo } from "components/icons";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import API from "helper/apis";

const Login = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleMessage = useHandleMessage();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState([]);
  const OTPLength = otp?.filter(e => e)?.length;

  const email = useInput("", "email", true);
  const password = useInput("", "password_optional", true);

  const [showPass, setShowPass] = useState(false);
  const handleShowPass = () => setShowPass(!showPass);

  const resend = (e) => {
    onSubmit(e, true);
  }
  const onSubmit = async (e, resend = false) => {
    e.preventDefault();
    setIsLoading(true);

    if (step == 1 || resend) {
      const submitData = {
        email: email.value,
        password: password.value,
      };
      try {
        const res = await API.login(submitData);
        toast.success(res.message);
        setStep(2);
      } catch (error) {
        handleMessage(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const submitData = {
        otp: otp?.join(""),
        email: email.value,
        password: password.value,
      };
      try {
        const user = await API.verifyCode(submitData);
        Cookies.set('user-token', user.token, { secure: true })
        await signIn("credentials", {
          redirect: false,
          callbackUrl: "/",
          user: JSON.stringify({ ...user.user }),
        });
        router.push(`/`);
      } catch (error) {
        handleMessage(error);
      } finally {
        setIsLoading(false);
      }
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
        <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
          {t("sign_in_now_key")}
        </h1>
        <p className="mb-2 text-sm text-gray-500 dark:text-white">
          {t("enter_your_email_and_password_to_sign_in_key")}
        </p>

        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="mb-4">
            <Input
              label={t("email_address_key")}
              {...email.bind}
              name="email"
            />
          </div>
          <div className="mb-2">
            <Input
              label={t("password_key")}
              name="password"
              type={showPass ? "text" : "password"}
              append={showPass ? <EyeIcon onClick={handleShowPass} className="cursor-pointer text-primary" width={"25"} /> : <EyeSlashIcon onClick={handleShowPass} className="cursor-pointer text-primary" width={"25"} />}
              {...password.bind}
            />
          </div>

          {step == 2 && (

            <>

              <p className="dark:text-gray-300">{t("otp_key")}</p>
              <div className="flex items-center justify-start gap-4 w-94">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="w-14 h-14">
                    <input
                      autoFocus={index == 0}
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const inputValue = e.target.value.slice(-1) || "";
                        if (!isNaN(inputValue)) {
                          setOtp(prevOtp => {
                            const updatedOtp = [...prevOtp];
                            updatedOtp[index] = inputValue;
                            return updatedOtp;
                          });
                          e?.target?.parentElement.nextSibling && inputValue && e.target.parentElement.nextSibling.firstChild.focus();
                          !inputValue && e.target.parentElement.previousSibling && e.target.parentElement.previousSibling.firstChild.focus();
                        }
                      }}
                      className="flex items-center justify-center w-full h-full px-2 text-lg text-center bg-gray-100 border-2 border-gray-200 outline-none md:px-5 rounded-xl focus:bg-gray-50 focus:border-primary hover:bg-gray-50 hover:border-primary"
                    />
                  </div>
                ))}
              </div>

              <p className="flex gap-2">
                <span className="dark:text-gray-300">{t("didnt_receive_code_key")}</span>

                <button onClick={resend} type={"button"} className="bg-transparent text-primary">{t("resend_key")}</button>
              </p>

            </>
          )}


          <Button
            disabled={isLoading || !email.value || !password.value || (step == 2 && OTPLength != 4)}
            className="w-full mt-6 btn--primary"
            type="submit"
          >
            {isLoading ? (
              <>
                <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                {t("loading_key")}
              </>
            ) : (
              t("sign_in_now_key")
            )}
          </Button>
          <Link href="/forget-password">
            <span className="mt-4 cursor-pointer text-primary">

              {t("forgot_password_key")}
            </span>
          </Link>
        </form>

      </div>
    </div>
  );
};

export default Login;

Login.getLayout = function PageLayout(page) {
  return <>{page}</>;
};


export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const routeUrl = context.locale === 'ar' ? '/' : `/${context.locale}/`;

  // const destination = context?.query?.callBackUrl ? `/${context?.query?.callBackUrl}` : "";

  if (session) {
    const role = "admin"//session?.user?.role[0];
    const destination = role == 'admin' ? "" : "";
    return {
      redirect: {
        destination: `${routeUrl}${destination}`,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session,
        ...(await serverSideTranslations(context.locale, ['common'])),
      },
    };
  }
};

