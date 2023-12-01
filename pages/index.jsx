import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PropTypes from "prop-types";

// Custom
import { Layout } from "components/layout";
import { Spinner } from "components/UI";

const Index = () => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation("common");
    const [tableData, setTableData] = useState([
        {
            title: 'total_corporate_key',
            count: 0,
            desc: 'corporate_key',
            percentage: 0,
            duration: moment().startOf("month").fromNow(),
        },
        {
            title: 'total_coordinators_key',
            count: 0,
            desc: 'coordinator_key',
            percentage: 0,
            duration: moment().startOf("month").fromNow(),
        },
        {
            title: 'total_tenants_key',
            count: 0,
            desc: 'tenants_key',
            percentage: 0,
            duration: moment().startOf("month").fromNow(),
        },

        {
            title: 'total_number_of_booking_key',
            count: 0,
            desc: 'bookings_key',
            percentage: 0,
            duration: moment().startOf("month").fromNow(),
        },

    ]);


    const fetchReport = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false)
        }, 1500);
    };
    useEffect(() => {
        fetchReport();
    }, []);
    return (
        <div className="container mx-auto mt-4">

            <div className="grid grid-rows-2 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-2">
                {
                    tableData.map((card, idx) => <React.Fragment key={`${card.count}-${idx}`}>
                        <div className='p-4 bg-white rounded-lg shadow-sm dark:bg-slate-800'>
                            <div className="font-bold text-slate-600 dark:text-slate-200">{t(card?.title)}</div>
                            <div className="mt-3 text-3xl font-semibold text-primary">
                                {loading ? <Spinner className="w-5 h-5 text-primary" /> : <span>{card?.count}</span>}
                                <span className="px-2 text-sm text-slate-400 dark:text-slate-200">{t(card?.desc)}</span>
                            </div>
                            <div className="flex mt-3">
                                <span className={`p-1 text-sm ${card.percentage < 0 ? "text-red-600 font-bold bg-red-100" : "text-green-600 font-bold bg-green-100"} rounded-md`}>

                                    {loading ? <Spinner className={`w-10 h-5 ${card.percentage < 0 ? "text-red-600" : "text-green-600"}`} /> : <span dir="ltr">{`${card?.percentage}%`}</span>}

                                </span>

                                <span dir="ltr" className="mx-2 font-thin text-gray-300">{moment(moment().startOf("month").toDate()).fromNow()}</span>
                            </div>
                        </div>
                    </React.Fragment>)
                }
            </div>
        </div>
    );
};


Index.getLayout = function PageLayout(page) {
    return (
        <Layout>
            <>{page}</>
        </Layout>
    );
};
Index.propTypes = {
    totals: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired,
            desc: PropTypes.string.isRequired,
            percentage: PropTypes.string.isRequired,
            duration: PropTypes.string.isRequired,
        })
    ).isRequired
};
export default Index;

export const getServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });
    return {
        props: {
            session,
            ...(await serverSideTranslations(context.locale, ["common"])),
        },
    };
}