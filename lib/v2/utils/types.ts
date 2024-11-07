import { AbiParameter } from "viem";

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

type FormType = "text" | "number" | "address" | "select";

export type ActionConfig<A extends { type: string }, T> = {
  type: A["type"];
  getFormValues: () => {
    label: string;
    key: keyof A;
    type: FormType;
    options?: { value: string; label: string }[];
  }[];
  // wish I could type this better, like TransactionConfig<T>
  // but it's not working...
  getTransactions: () => TransactionConfig<any>[];
  resolveAction: (a: A) => T[];
  buildAction: (r: any[]) => { action: A; remainingTransactions: any[] } | null;
  actionSummary: (a: A) => JSX.Element;
};

export type OneTimePaymentAction = {
  type: "one-time-payment";
  currency: "eth" | "usdc";
  amount: string;
  target: `0x${string}`;
};

export interface TransferTransaction {
  type: "transfer";
  target: `0x${string}`;
  value: bigint;
}

export interface UsdcTransferViaPayerTransaction {
  type: "usdc-transfer-via-payer";
  receiverAddress: `0x${string}`;
  usdcAmount: bigint;
  target: `0x${string}`;
}

export interface CustomTransactionAction {
  type: "custom-transaction";
  target: `0x${string}`;
  contractCallSignature: string;
  contractCallValue: number;
  contractCallTarget: `0x${string}`;
  contractCallArguments: any[];
}

export interface FunctionCallTransaction {
  type: "function-call";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputTypes: readonly AbiParameter[];
  functionInputs: any[];
}

export interface PayableFunctionCallTransaction {
  type: "payable-function-call";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputTypes: readonly AbiParameter[];
  functionInputs: any[];
}

export interface UnparsedFunctionCallTransaction {
  type: "unparsed-function-call";
  target: `0x${string}`;
  signature?: string;
  calldata: `0x${string}`;
  value: bigint;
  error?: string;
}

export interface UnparsedPayableFunctionCallTransaction {
  type: "unparsed-payable-function-call";
  target: `0x${string}`;
  signature?: string;
  calldata: `0x${string}`;
  value: bigint;
}

export type Action = OneTimePaymentAction;
export type ReadableTransaction =
  | TransferTransaction
  | UsdcTransferViaPayerTransaction
  | FunctionCallTransaction
  | PayableFunctionCallTransaction
  | UnparsedFunctionCallTransaction
  | UnparsedPayableFunctionCallTransaction;

export type TypedActionConfig = ActionConfig<Action, ReadableTransaction>;

// For later, maybe more ergonomic?
//   class Transaction {
//     constructor() {}
//     parse() {}
//     unparse() {}
//     transactionComment() {}
//     transactionCodeBlock() {}
//   }
