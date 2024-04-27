import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import { useRouter } from "next/router";
import API from 'helper/apis';




import Link from "next/link";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { Header } from "components/global";
import { MinimizedBox } from "components/UI";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage } from "hooks";
import { isSuperAdmin } from "utils/utils";
import ChatBox from "components/pages/chats/ChatBox";
import moment from "moment";

const Index = ({ session }) => {
  const router = useRouter();
  console.log(session);
  const is_super_admin = isSuperAdmin(session);
  const language = router.locale.toLowerCase();
  const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';

  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true);
  const handleMessage = useHandleMessage();

  const { t } = useTranslation("common");
  const printViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");


  const fetchReport = async (page, perPage, query = "") => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const data = await API.getAllTowers({
        search,
        searchFields: ["name"],
        ...(!is_super_admin ? { filters: `owner=${session.user._id}` } : {}),
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

  useEffect(() => {
    // fetchReport(1, 10);

    let admin_id = null;
    const isUser = session.user.role == "user";
    if (isUser) {
      admin_id = session.user.admin_id;
    } else {
      admin_id = session.user._id
    }

    (async () => {
      const data = await API.getAllTenants({
        sort: "updatedAt",
        // select: "name role",
        filters: `admin_id=${admin_id}`,
        page: 1,
        limit: 100
      })
      const items = data.items;

      setUsers([...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items,])


    })();
  }, []);











  return (
    <>
      <div className="flex items-start justify-between h-full border-2 border-gray-400 chats">
        <div className="overflow-hidden p-4 border-r w-auto sm:w-[300px]  ">
          <ul className="h-full overflow-y-auto hide-scroll-bar">
            {users.map(user => {
              return (
                <li key={user._id} className="relative flex items-center gap-3 py-2 mb-5 md:gap-5">
                  <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"} alt={user.name} className="w-10 h-10 rounded-full" />
                  {true && <span className="absolute left-0 w-2 h-2 bg-green-400 rounded-full top-2"></span>}
                  <div className="flex-col hidden sm:flex">

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium">{user.name}</span>
                      <span className="text-xs font-semibold text-gray-300 ">{moment().format("DD/MM/YYYY")}</span>
                    </div>

                    <p className=" text-nowrap overflow-hidden text-ellipsis sm:w-[200px]">Lorem ipsum dolor Lorem ipsum dolor sit amet ipsum dolor si </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Chat box */}
        <div className="flex-1 ">
          <ChatBox />
        </div>
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