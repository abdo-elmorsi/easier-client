import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import LayoutWithSidebar from "components/layout/LayoutWithSidebar";

const Dashboard = () => {
  const { t } = useTranslation("dashboard");

  return <div className="flex-1">dashboard</div>;
};

export default Dashboard;

Dashboard.getLayout = function PageLayout(page) {
  return <LayoutWithSidebar>{page}</LayoutWithSidebar>;
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["dashboard"])),
    },
  };
}
