import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import { useRouter } from "next/router";
import API from 'helper/apis';



// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { useHandleMessage } from "hooks";
import { isSuperAdmin } from "utils/utils";
import ChatBox from "components/pages/chats/ChatBox";
import moment from "moment";
import Image from "next/image";

import { io } from "socket.io-client"
import config from "config/config";



const Index = ({ session }) => {
  const [socket, setSocket] = useState({});

  const { t } = useTranslation("common");
  const router = useRouter();
  const language = router.locale.toLowerCase();
  const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState({});
  const handleMessage = useHandleMessage();


  useEffect(() => {
    setSocket(io.connect(`${config.apiGateway.production_main_domain}:4000`))
    let admin_id = null;
    const isUser = session.user.role == "user";
    if (isUser) {
      admin_id = session.user.admin_id;
    } else {
      admin_id = session.user._id
    }
    try {
      (async () => {
        const data = await API.getAllTenants({
          sort: "updatedAt",
          // select: "name role",
          ...(!is_super_admin ? { filters: `admin_id=${admin_id}` } : {}),
          page: 1,
          limit: 100
        })
        const items = data.items;
        setUsers(items);
        setLoading(false);
      })();
    } catch (error) {
      handleMessage(error)
    }
  }, []);



  return (
    <>
      <div className="flex items-start justify-between h-full border-2 border-gray-400 chats">
        <div className="overflow-hidden p-4 border-r w-auto sm:w-[300px]  ">
          <ul className="h-full overflow-y-auto hide-scroll-bar">
            {loading ? (
              <>
                {Array(6).fill({}).map(i => {
                  return <div className="flex w-full h-28 justify-start items-center gap-4">
                    <div className="animate-pulse w-12 h-12 rounded-full bg-gray-600"></div>
                    <div className="flex flex-col flex-1">
                      <div className="mb-2 animate-pulse w-full h-5 rounded-sm bg-gray-600"></div>
                      <div className="animate-pulse w-full h-5 rounded-sm bg-gray-600"></div>
                    </div>
                  </div>
                })}
              </>
            ) : <>
              {users.map(user => {
                return (
                  <li key={user._id} onClick={() => setSelectedUser(user)} className="relative flex items-center gap-3 py-2 mb-5 md:gap-5">
                    {!user?.photo?.secure_url ? (
                      <span className="w-10 h-10 dark:bg-gray-500 bg-gray-200 text-gray-900 flex  justify-center items-center rounded-full ">{user.name?.slice(0, 1)}</span>
                    ) : (
                      <Image src={user?.photo?.secure_url} width={100} height={100} alt={user.name} className="rounded-full" />
                    )}
                    <span className="absolute left-0 w-2 h-2 bg-green-400 rounded-full top-2"></span>
                    <div className="flex-col hidden sm:flex">

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">{user.name}</span>
                        <span className="text-xs font-semibold text-gray-300 ">{moment(user?.updatedAt).format(date_format)}</span>
                      </div>

                      <p className=" text-nowrap overflow-hidden text-ellipsis sm:w-[200px]">Lorem ipsum dolor Lorem ipsum dolor sit amet ipsum dolor si </p>
                    </div>
                  </li>
                );
              })}

            </>}
          </ul>
        </div>

        {/* Chat box */}
        <div className="flex-1 ">
          <ChatBox socket={socket} selectedUser={selectedUser} user={session?.user} />
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