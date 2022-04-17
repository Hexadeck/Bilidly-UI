import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import Layout from "../components/layout/layout.js";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useRouter } from "next/router";
import GovMenu from "../components/govMenu";

import lightTheme from "../theme/light";
import darkTheme from "../theme/dark";

import Configure from "./configure";

import stores from "../stores/index.js";

import { ACTIONS } from "../stores/constants";
import "../styles/global.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [themeConfig, setThemeConfig] = useState(darkTheme);
  const [stableSwapConfigured, setStableSwapConfigured] = useState(false);
  const [accountConfigured, setAccountConfigured] = useState(false);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const changeTheme = (dark) => {
    // setThemeConfig(dark ? darkTheme : lightTheme);
    // localStorage.setItem('yearn.finance-dark-mode', dark ? 'dark' : 'light');
  };

  const accountConfigureReturned = () => {
    setAccountConfigured(true);
  };

  const stableSwapConfigureReturned = () => {
    setStableSwapConfigured(true);
  };

  useEffect(function () {
    const localStorageDarkMode = window.localStorage.getItem(
      "yearn.finance-dark-mode"
    );
    changeTheme(localStorageDarkMode ? localStorageDarkMode === "dark" : false);
  }, []);

  useEffect(function () {
    stores.emitter.on(ACTIONS.CONFIGURED_SS, stableSwapConfigureReturned);
    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigureReturned);

    stores.dispatcher.dispatch({ type: ACTIONS.CONFIGURE });

    return () => {
      stores.emitter.removeListener(
        ACTIONS.CONFIGURED_SS,
        stableSwapConfigureReturned
      );
      stores.emitter.removeListener(
        ACTIONS.ACCOUNT_CONFIGURED,
        accountConfigureReturned
      );
    };
  }, []);
  console.log("Rerendered");
  return (
    <React.Fragment>
      <Head>
        <title>Bilidly</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={themeConfig}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {accountConfigured &&
          (router.pathname.includes("governance") ? (
            <Layout changeTheme={changeTheme}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "100px",
                  marginBottom: "-80px",
                }}
              >
                <GovMenu />
              </div>
              <Component {...pageProps} changeTheme={changeTheme} />
            </Layout>
          ) : (
            <Layout changeTheme={changeTheme}>
              <Component {...pageProps} changeTheme={changeTheme} />
            </Layout>
          ))}
        {!accountConfigured && <Configure {...pageProps} />}
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
