import { createContext, useContext, createElement } from "react";

type ContextValue = {};

const Context = createContext<ContextValue | null>(null);

type GovKitProviderProps = {
  children?: React.ReactNode;
};

export const GovKitProvider: React.FC<GovKitProviderProps> = ({ children }) => {
  const value = {};

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useGovKitContext = () => {
  const context = useContext(Context);
  if (!context) throw Error("GovKitContext must be inside a GovKitProvider.");
  return context;
};
