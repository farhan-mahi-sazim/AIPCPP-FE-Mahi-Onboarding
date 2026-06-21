import { PropsWithChildren, ReactElement } from "react";

import { MantineProvider, MantineThemeOverride, createTheme } from "@mantine/core";
import { configureStore } from "@reduxjs/toolkit";
import { render, RenderOptions } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";

import authenticatedUserSliceReducer from "@/shared/redux/reducers/user.reducer";
import { blcTheme } from "@/shared/themes/themes";

if (!globalThis.fetch) {
  globalThis.fetch = jest.fn() as unknown as typeof fetch;
}

const { documentsApi } = jest.requireActual<typeof import("@/shared/redux/rtk-apis/documents.api")>(
  "@/shared/redux/rtk-apis/documents.api",
);

const theme = createTheme(blcTheme as MantineThemeOverride);

export const createTestStore = () =>
  configureStore({
    reducer: {
      authenticatedUser: authenticatedUserSliceReducer,
      [documentsApi.reducerPath]: documentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(documentsApi.middleware),
  });

export type TTestStore = ReturnType<typeof createTestStore>;

type TRenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  store?: TTestStore;
};

export const renderWithProviders = (
  ui: ReactElement,
  { store = createTestStore(), ...renderOptions }: TRenderWithProvidersOptions = {},
) => {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <ReduxProvider store={store}>
      <MantineProvider theme={theme}>{children}</MantineProvider>
    </ReduxProvider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
