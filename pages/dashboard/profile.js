import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import LayoutWithSidebar from "components/layout/LayoutWithSidebar";
import { getSession } from "next-auth/client";
import Layout from "components/layout/Layout";
import Tabs from "components/UI/Tabs";
import EditProfileForm from "components/profile-page/EditProfileForm";
import { UserCircleIcon, KeyIcon } from "@heroicons/react/24/outline";
import ChangePassword from "components/profile-page/ChangePassword";

const Profile = ({ session }) => {
  const { t } = useTranslation("common");

  const tabsData = [
    {
      label: t("general"),
      icon: <UserCircleIcon className="h-5 w-5" />,
      content: <EditProfileForm session={session} />,
    },
    {
      label: t("change password"),
      icon: <KeyIcon className="h-5 w-5" />,
      content: <ChangePassword />,
    },
  ];

  return (
    <div className="flex-1">
      <Tabs tabsData={tabsData} />
    </div>
  );
};

export default Profile;

Profile.getLayout = function PageLayout(page) {
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
