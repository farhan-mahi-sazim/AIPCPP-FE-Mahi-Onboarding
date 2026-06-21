import { createContext, useContext } from "react";

import { TSessionContext } from "./AppInitializer.types";

export const AppInitializerContext = createContext<TSessionContext>({
  user: null,
  isLoading: false,
  error: undefined,
  getMe: () => {},
} as TSessionContext);

export const useSessionContext = () => useContext(AppInitializerContext);
