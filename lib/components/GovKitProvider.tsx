import { createContext, useContext, createElement } from "react";
import {
  DefaultTextInput,
  DefaultNumberInput,
  DefaultAddressInput,
  DefaultSelect,
} from "./DefaultFormElements";
import { TypedActionConfig } from "../types";
import { TransactionParser } from "../utils/parser";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
};

type ContextValue = {
  TextInput: React.ComponentType<InputProps>;
  NumberInput: React.ComponentType<InputProps>;
  AddressInput: React.ComponentType<InputProps>;
  Select: React.ComponentType<SelectProps>;
  etherscanApiKey: string;
  // maybe include this for viem?
  //   alchemyApiKey: string;
  actions: TypedActionConfig[];
  parser: TransactionParser;
};

const Context = createContext<ContextValue | null>(null);

type Config = Partial<Omit<ContextValue, "etherscanApiKey" | "actions">> & {
  etherscanApiKey: string;
  actions: TypedActionConfig[];
  chainId: number;
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
    Select: DefaultSelect,
  };

  const value = {
    ...DEFAULT_VALUES,
    parser: new TransactionParser(config.chainId, config.actions),
    ...config,
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useGovKitContext = () => {
  const context = useContext(Context);
  if (!context) throw Error("GovKitContext must be inside a GovKitProvider.");
  return context;
};
