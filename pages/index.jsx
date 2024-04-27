import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Custom
import { Layout } from "components/layout";
import { Button } from "components/UI";
import Link from "next/link";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
const Index = () => {
    const { t } = useTranslation("common");


    return (
        <div className="flex justify-center">

            <Link href={"/request-join"}>
                <a>

                    <Button className="btn--primary text-5xl text-center p-4 mt-10 flex items-center">
                        <RocketLaunchIcon className="w-10 h-10" /> {t("join_request_key")}
                    </Button>
                </a>
            </Link>
        </div>
    );
};


Index.getLayout = function PageLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    );
};

export default Index;

export const getStaticProps = async (context) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, ["common"])),
        },
        // revalidate: 300, // Revalidate every 5 minutes (300 seconds)
    };
};
