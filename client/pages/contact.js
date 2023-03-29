import Head from "next/head";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Contact = () => {
  return (
    <>
      <Head>
        <title>Real State contact</title>
      </Head>
      <div>contact</div>
    </>
  );
};

export default Contact;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
