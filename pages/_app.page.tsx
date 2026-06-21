import { PropsWithChildren } from "react";

import { NextPage } from "next";
import { AppProps } from "next/app";

import { MantineProvider, MantineThemeOverride, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Provider as ReduxProvider } from "react-redux";

import AppInitializer from "@/shared/components/wrappers/AppInitializer";
import { store } from "@/shared/redux/store";
import { blcTheme } from "@/shared/themes/themes";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/nprogress/styles.css";
import "@/styles/globals.css";

export type NextApplicationPage<P = unknown, IP = P> = NextPage<P, IP> & {
  Guard?: (props: PropsWithChildren) => JSX.Element;
  Layout?: (props: PropsWithChildren) => JSX.Element;
};

type TCustomAppProps<P = unknown> = AppProps & {
  Component: NextApplicationPage;
  pageProps: P;
};

const theme = createTheme(blcTheme as MantineThemeOverride);

export default function App(props: TCustomAppProps) {
  const { Component, pageProps } = props;

  const component = Component.Layout ? (
    <Component.Layout>
      <Component {...pageProps} />
    </Component.Layout>
  ) : (
    <Component {...pageProps} />
  );

  return (
    <ReduxProvider store={store}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <AppInitializer>
            <Notifications />
            {Component.Guard ? <Component.Guard>{component}</Component.Guard> : component}
          </AppInitializer>
        </ModalsProvider>
      </MantineProvider>
    </ReduxProvider>
  );
}
