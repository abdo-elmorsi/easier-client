import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import { useRouter } from "next/router";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { apartmentColumns } from "components/columns";
import { ServerTable, DeleteModal, Header } from "components/global";
import { Actions, MinimizedBox, Modal } from "components/UI";
import { AddUpdateModal, PrintView } from "components/pages/apartments";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage } from "hooks";
import { Filter } from "components/pages/towers";
import API from "helper/apis";

const Index = ({ session }) => {
  const apartment_id = router?.query?.id || "";
  const router = useRouter();
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
  const [gridFilter, setGridFilter] = useState({});

  // ================== add-update apartment ============
  const [showUpdateModal, setShowUpdateModal] = useState({
    isOpen: false,
    id: null
  });
  const handleUpdate = (id) => {
    setShowUpdateModal(({ id: id, isOpen: true }));
  };
  const closeEditModal = () => {
    setShowUpdateModal(({}));
  };
  // ================== add-update apartment ============

  // ================== delete apartment ============
  const [showDeleteModal, setShowDeleteModal] = useState({
    loading: false,
    isOpen: false,
    id: null
  });
  const closeDeleteModal = () => {
    setShowDeleteModal(({}));
  };
  const handleDelete = async () => {
    setShowDeleteModal(prev => ({ ...prev, loading: true }))
    try {
      await API.deleteApartment(showDeleteModal?.id);
      closeDeleteModal();
      fetchReport();
    } catch (error) {
      handleMessage(error);
    } finally {
      setShowDeleteModal(prev => ({ ...prev, loading: false }))
    }
  }
  // ================== delete apartment ============


  const columns = apartmentColumns(t, handleUpdate, setShowDeleteModal, date_format);
  const fetchReport = async (page, perPage, query = "", filter = {}) => {
    const search = query?.trim() || searchQuery;
    const _filter = { ...gridFilter, ...filter };
    setLoading(true);

    try {
      const data = await API.getAllApartments({
        search,
        searchFields: ["piece_number"],
        filters: `admin_id=${session.user._id}${_filter?.tower ? `,tower=${_filter?.tower.value}` : ""}`,
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
    await exportExcel(tableData, columns, t("apartments_key"), handleMessage);
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

  const fetchReportFromFilter = (filter) => {
    fetchReport(1, 10, null, filter);
    setGridFilter({ ...gridFilter, ...filter });
  }
  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("apartments_key")}
          path="/dashboard/apartments"
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <MinimizedBox>
          <Filter fetchReport={fetchReportFromFilter} />
        </MinimizedBox>
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
              addMsg={t("add_apartment_key")}
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
          title={t("add_apartment_key")}
          show={showUpdateModal?.isOpen}
          footer={false}
          onClose={() => closeEditModal()}
        >
          <AddUpdateModal
            fetchReport={fetchReport}
            handleClose={() => closeEditModal()}
            id={showUpdateModal?.id}
          />
        </Modal>
      )}

      {showDeleteModal?.isOpen && (
        <Modal
          title={t("delete_key")}
          show={showDeleteModal?.isOpen}
          footer={false}
          onClose={() => closeDeleteModal()}
        >
          <DeleteModal
            showDeleteModal={showDeleteModal}
            handleClose={() => closeDeleteModal()}
            handleDelete={handleDelete}
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

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const userRole = session?.user?.role;
  const loginUrl = context.locale === "ar" ? "/login" : `/${context.locale}/login`;
  if (!session || (userRole != "admin" && userRole != "superAdmin")) {
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
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }
}