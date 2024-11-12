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

export type ContractInfo = {
  name: string;
  abi: any;
  isProxy: boolean;
  implementationAddress: `0x${string}`;
  implementationAbi: any;
};

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

export interface BaseAction {
  type: string;
}

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

// ------------------------------------------------------------
// Parser classes
// ------------------------------------------------------------

export class ActionHandler<A extends Action, T extends ReadableTransaction> {
  static readonly type: string;
  static readonly form: React.FC;
  static readonly action: Action;

  static formdataToAction: (data: any) => Action;
  static getTransactions: () => (typeof TransactionHandler<ReadableTransaction>)[];
  static build: (
    r: any[]
  ) => { action: Action; remainingTransactions: any[] } | null;

  resolve(a: A): TransactionHandler<T>[] {
    throw new Error("Not implemented");
  }

  summarize(a: A): JSX.Element {
    throw new Error("Not implemented");
  }

  constructor(data: Action) {}
}

export abstract class TransactionHandler<T extends ReadableTransaction> {
  static readonly type: string;
  abstract readonly raw: RawTransaction;
  abstract readonly parsed: ParsedFunctionCallTransaction<T>;

  static parse(
    rt: RawTransaction,
    { chainId }: { chainId: number }
  ): ReadableTransaction | false {
    throw new Error("Must implement static parse");
  }

  static unparse(
    t: ReadableTransaction,
    { chainId }: { chainId: number }
  ): RawTransaction {
    throw new Error("Must implement static unparse");
  }

  abstract codeBlock(): JSX.Element;
  abstract comment(): JSX.Element | undefined;

  constructor(
    mode: "raw" | "parsed",
    data: RawTransaction | ParsedFunctionCallTransaction<T>
  ) {}
}
