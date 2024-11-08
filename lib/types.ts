import { AbiParameter } from "viem";
import {
  OneTimePaymentAction,
  TransferTransaction,
  UsdcTransferViaPayerTransaction,
} from "./actions/NounsOneTimePayment/types";
import {
  CustomTransactionAction,
  FunctionCallTransaction,
  PayableFunctionCallTransaction,
} from "./actions/CustomTransaction/types";
import {
  TransferENSFromTreasuryAction,
  TransferENSTransaction,
} from "./actions/TransferENSFromTreasury/types";

export type RawTransaction = {
  target: `0x${string}`;
  signature: string;
  calldata: `0x${string}`;
  value: bigint | string;
};

export type RawTransactions = {
  targets: `0x${string}`[];
  values: string[];
  signatures: string[];
  calldatas: `0x${string}`[];
};

export type ParsedFunctionCallTransaction<T> = T & {
  functionName?: string;
  functionInputs?: any[];
  functionInputTypes?: readonly AbiParameter[];
};

export type TransactionConfig<T extends { type: string }> = {
  type: T["type"];
  parse: (t: RawTransaction, { chainId }: { chainId: number }) => T | false;
  unparse: (t: T, { chainId }: { chainId: number }) => RawTransaction;
  transactionCodeBlock: (t: ParsedFunctionCallTransaction<T>) => JSX.Element;
  transactionComment: (t: T) => JSX.Element | undefined;
};

export interface BaseAction {
  type: string;
}

export type ActionConfig<
  A extends BaseAction,
  T extends BaseReadableTransaction
> = {
  type: A["type"];
  form: React.FC;
  formdataToAction: (data: any) => A;
  // wish I could type this better, like TransactionConfig<T>
  getTransactions: () => TransactionConfig<any>[];
  resolveAction: (a: A) => T[];
  buildAction: (r: any[]) => { action: A; remainingTransactions: any[] } | null;
  actionSummary: (a: A) => JSX.Element;
};

export type Action =
  | OneTimePaymentAction
  | CustomTransactionAction
  | TransferENSFromTreasuryAction;

export interface BaseReadableTransaction {
  type: string;
}

export type ReadableTransaction =
  | TransferTransaction
  | UsdcTransferViaPayerTransaction
  | FunctionCallTransaction
  | PayableFunctionCallTransaction
  | TransferENSTransaction;

export type OneTimePaymentActionConfig = ActionConfig<
  OneTimePaymentAction,
  TransferTransaction | UsdcTransferViaPayerTransaction
>;

export type CustomTransactionActionConfig = ActionConfig<
  CustomTransactionAction,
  FunctionCallTransaction | PayableFunctionCallTransaction
>;

export type TransferENSFromTreasuryActionConfig = ActionConfig<
  TransferENSFromTreasuryAction,
  TransferENSTransaction
>;

export type TypedActionConfig =
  | OneTimePaymentActionConfig
  | CustomTransactionActionConfig
  | TransferENSFromTreasuryActionConfig;
