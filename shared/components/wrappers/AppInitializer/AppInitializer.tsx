import { PropsWithChildren } from "react";
import { AppInitializerContext } from "./AppInitializerContext";

const AppInitializer = ({ children }: PropsWithChildren) => {
  return (
    <AppInitializerContext.Provider
      value={{
        isLoading: false,
        error: undefined,
        user: null,
        getMe: () => {},
      }}
    >
      {children}
    </AppInitializerContext.Provider>
  );
};

export default AppInitializer;
