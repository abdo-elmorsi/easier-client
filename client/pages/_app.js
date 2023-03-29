import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import "styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Layout from "components/layout/Layout";
import store from "../store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
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
