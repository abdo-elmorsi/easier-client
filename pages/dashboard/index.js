import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import LayoutWithSidebar from "components/layout/LayoutWithSidebar";
import { getSession } from "next-auth/react";
import Layout from "components/layout/Layout";

const Dashboard = ({ session }) => {
  console.log(session);
  const { t } = useTranslation("dashboard");

  return <div className="flex-1">dashboard</div>;
};

export default Dashboard;

Dashboard.getLayout = function PageLayout(page) {
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
