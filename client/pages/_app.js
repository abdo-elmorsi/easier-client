import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import "styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Layout from "components/layout/Layout";
import store from "../store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (router.locale === "ar") {
      document.documentElement.lang = "ar";
      document.body.dir = "rtl";
      document.body.style.fontFamily = `'Noto Sans Arabic', sans-serif`;
    } else if (router.locale === "en") {
      document.documentElement.lang = "en";
      document.body.dir = "ltr";
      document.body.style.fontFamily = `'Cairo', sans-serif`;
    }
  }, [router.locale]);

  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      {getLayout(<Component {...pageProps} />)}
    </Provider>
  );
}

export default appWithTranslation(MyApp);
