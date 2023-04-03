import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import LayoutWithSidebar from "components/layout/LayoutWithSidebar";
import { getSession } from "next-auth/client";
import Layout from "components/layout/Layout";

const Board = () => {
  const { t } = useTranslation("dashboard");

  return <div className="flex-1">board</div>;
};

export default Board;

Board.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const loginUrl =
    context.locale === "ar" ? "/login" : `/${context.locale}/login`;

  if (!session) {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session,
        ...(await serverSideTranslations(context.locale, [
          "common",
          "dashboard",
        ])),
      },
    };
  }
};
