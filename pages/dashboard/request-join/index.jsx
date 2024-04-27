import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import { useRouter } from "next/router";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { requestJoinColumns } from "components/columns";
import { ServerTable, Header } from "components/global";
import { Actions } from "components/UI";
import { useHandleMessage } from "hooks";
import API from "helper/apis";


export const conditionalRowStyles = [
  {
    when: row => row.role === "superAdmin",
    style: {
      fontWeight: 'bold',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },

];

const Index = () => {
  const router = useRouter();
  const language = router.locale.toLowerCase();
  const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';


  const [refresh, setRefresh] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleMessage = useHandleMessage();

  const { t } = useTranslation("common");

  const [searchQuery, setSearchQuery] = useState("");


  const [statusLoading, setStatusLoading] = useState(false);
  const handleAccept = async (id) => {
    setStatusLoading(true);
    try {
      await API.acceptRequestJoin(
        id,
        { link: `${window.location.host}/complete-form` }
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      handleMessage(error, null);
    } finally {
      setStatusLoading(false)
    }
  }
  const handelReject = async (id) => {
    setStatusLoading(true);
    try {
      await API.rejectRequestJoin(
        id
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      handleMessage(error, null);
    } finally {
      setStatusLoading(false)
    }
  }
  const columns = requestJoinColumns(t, handleAccept, handelReject, statusLoading, date_format);

  const fetchReport = async (page, perPage, query = "") => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const data = await API.getAllRequestJoin({
        search,
        searchFields: ["user_name", "user_email", "user_phone_number"],
        sort: "email_sent",
        page,
        limit: perPage,
      });
      setTableData(data.items);
      setTotalRows(data.totalRecords);
      setLoading(false);
    } catch (error) {
      handleMessage(error, null, setLoading);
    }
  };

  const handlePageChange = (page) => fetchReport(page, perPage);

  const handlePerRowsChange = (rowsPerPage, page) => {
    setPerPage(rowsPerPage);
    fetchReport(page, rowsPerPage);
  };


  useEffect(() => {
    fetchReport(1, 10);
  }, [refresh]);
  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("request_join_key")}
          path="/dashboard/request-join"
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <ServerTable
          columns={columns}
          data={tableData || []}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fetchReport={fetchReport}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          progressPending={loading}
          paginationTotalRows={totalRows}
          paginationPerPage={perPage}
          conditionalRowStyles={conditionalRowStyles}
          actions={
            <Actions
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fetchReport={fetchReport}
            />
          }
        />
      </div>
    </>
  );
};



Index.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default Index;

Index.propTypes = {
  session: PropTypes.object.isRequired
};

export const getServerSideProps = async ({ req, locale, resolvedUrl }) => {
  const session = await getSession({ req: req });
  const userRole = session?.user?.role;

  if (!session || (userRole !== "admin" && userRole !== "superAdmin")) {
    const loginUrl = locale === "en" ? `/${locale}/login` : "/login";
    const returnTo = resolvedUrl || "/";
    return {
      redirect: {
        destination: `${loginUrl}?returnTo=${encodeURIComponent(returnTo)}`,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }
};