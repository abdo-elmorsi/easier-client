import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import "styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Layout from "components/layout/Layout";
import store from "../store";
import { Provider } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import GlobalSetting from "helper/settings/GlobalSetting";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  const getLayout =
    Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return (
    <SessionProvider>
      <Provider store={store}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <title>Real State Management</title>
        </Head>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {getLayout(
          <GlobalSetting>
            <Component {...pageProps} />
          </GlobalSetting>
        )}
      </Provider>
    </SessionProvider>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default appWithTranslation(MyApp);
