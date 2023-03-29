import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

const Login = () => {
  return <div>login</div>;
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
