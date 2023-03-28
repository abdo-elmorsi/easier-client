import Head from "next/head";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const About = () => {
  return (
    <>
      <Head>
        <title>Real State about</title>
      </Head>
      <div>about</div>
    </>
  );
};

export default About;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
