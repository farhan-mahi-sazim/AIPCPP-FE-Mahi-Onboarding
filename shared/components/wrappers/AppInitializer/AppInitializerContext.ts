import { createContext, useContext } from "react";

type TSessionContext = {
  isLoading: boolean;
  error: unknown;
  user: unknown | null;
  getMe: () => void;
};

export const AppInitializerContext = createContext<TSessionContext>({
  user: null,
  isLoading: false,
  error: undefined,
  getMe: () => {},
} as TSessionContext);

export const useSessionContext = () => useContext(AppInitializerContext);
