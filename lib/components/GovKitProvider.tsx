import { createContext, useContext, createElement } from "react";
import {
  DefaultTextInput,
  DefaultNumberInput,
  DefaultAddressInput,
} from "./DefaultFormElements";
import { FormAction } from "../types";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type ContextValue = {
  TextInput: React.ComponentType<InputProps>;
  NumberInput: React.ComponentType<InputProps>;
  AddressInput: React.ComponentType<InputProps>;
  etherscanApiKey: string;
  // maybe include this for viem?
  //   alchemyApiKey: string;
  actions: FormAction[];
};

const Context = createContext<ContextValue | null>(null);

type Config = Partial<Omit<ContextValue, "etherscanApiKey" | "actions">> & {
  etherscanApiKey: string;
  actions: FormAction[];
};

export interface GovKitProviderProps {
  children?: React.ReactNode;
  config: Config;
}

export const GovKitProvider: React.FC<GovKitProviderProps> = ({
  config,
  children,
}) => {
  const DEFAULT_VALUES = {
    TextInput: DefaultTextInput,
    NumberInput: DefaultNumberInput,
    AddressInput: DefaultAddressInput,
  };

  const value = {
    ...DEFAULT_VALUES,
    ...config,
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useGovKitContext = () => {
  const context = useContext(Context);
  if (!context) throw Error("GovKitContext must be inside a GovKitProvider.");
  return context;
};
