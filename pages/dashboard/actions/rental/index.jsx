import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import { useRouter } from "next/router";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { ServerTable, Header } from "components/global";
import { Actions, MinimizedBox, Modal } from "components/UI";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage } from "hooks";
import { isSuperAdmin } from "utils/utils";
import { rentalColumns } from "components/columns";
import { AddUpdateModal, PrintView } from "components/pages/actions/rental";
import API from "helper/apis";

const Index = ({ session }) => {
  const router = useRouter();
  const is_super_admin = isSuperAdmin(session);
  const language = router.locale.toLowerCase();
  const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';

  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleMessage = useHandleMessage();

  const { t } = useTranslation("common");
  const [exportingExcel, setExportingExcel] = useState(false);
  const printViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ================== add-update rental ============
  const [showUpdateModal, setShowUpdateModal] = useState({
    isOpen: false,
    id: null
  });

  const closeEditModal = () => {
    setShowUpdateModal(({}));
  };
  // ================== add-update rental ============


  const columns = rentalColumns(t, date_format, is_super_admin);

  const fetchReport = async (page, perPage, query = "") => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const data = await API.getAllRentals({
        search,
        searchFields: ["user"],
        // ...(!is_super_admin ? { filters: `owner=${session.user._id}` } : {}),
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

  const handleExportExcel = async () => {
    setExportingExcel(true);
    await exportExcel(tableData, columns, t("rental_key"), handleMessage);
    setTimeout(() => {
      setExportingExcel(false);
    }, 1000);
  };

  const exportPDF = useCallback(() => {
    if (printViewRef.current) {
      printViewRef.current.print();
    }
  }, [printViewRef.current]);
  useEffect(() => {
    fetchReport(1, 10);
  }, []);
  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("rental_key")}
          path="/dashboard/actions/rental"
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <MinimizedBox></MinimizedBox>
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
          actions={
            <Actions
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fetchReport={fetchReport}
              addMsg={t("rent_key")}
              onClickAdd={() => setShowUpdateModal({ isOpen: true, id: null })}
              onClickPrint={exportPDF}
              onClickExport={handleExportExcel}
              isDisabledExport={exportingExcel || !tableData?.length}
            />
          }
        />
      </div>
      <PrintView ref={printViewRef} data={tableData} />

      {showUpdateModal?.isOpen && (
        <Modal
          title={t("rent_key")}
          show={showUpdateModal?.isOpen}
          footer={false}
          onClose={() => closeEditModal()}
        >
          <AddUpdateModal
            fetchReport={fetchReport}
            handleClose={() => closeEditModal()}
            id={showUpdateModal?.id}
            session={session}
          />
        </Modal>
      )}


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
    return {
      redirect: {
        destination: `${loginUrl}?returnTo=${encodeURIComponent(resolvedUrl || "/")}`,
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