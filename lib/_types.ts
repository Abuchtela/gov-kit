import { AbiParameter } from "viem";

export type Transaction = {
  amount: number;
  signature: string;
  calldata: string;
};

export type ContractInfo = {
  name: string;
  abi: any;
  isProxy: boolean;
  implementationAddress: `0x${string}`;
  implementationAbi: any;
};

export type DecodedAbiFunction = {
  name: string;
  inputs: any[];
  inputTypes: any[];
  proxy: boolean;
  proxyImplementation?: `0x${string}`;
};

export type ReadableTransactionType =
  | "transfer"
  | "unparsed-function-call"
  | "unparsed-payable-function-call"
  | "function-call"
  | "payable-function-call"
  | "payer-top-up"
  | "weth-deposit"
  | "weth-approval"
  | "weth-transfer"
  | "weth-stream-funding"
  | "usdc-approval"
  | "usdc-transfer-via-payer"
  | "usdc-stream-funding-via-payer"
  | "treasury-noun-transfer"
  | "stream"
  | "escrow-noun-transfer";

export interface ReadableTransactionBase {
  type: ReadableTransactionType;
}

export interface TransferTransaction extends ReadableTransactionBase {
  type: "transfer";
  target: `0x${string}`;
  value: bigint;
}

interface FunctionCallTransaction extends ReadableTransactionBase {
  type: "function-call";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputTypes: readonly AbiParameter[];
  functionInputs: any[];
}

interface PayableFunctionCallTransaction extends ReadableTransactionBase {
  type: "payable-function-call";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputTypes: readonly AbiParameter[];
  functionInputs: any[];
}

interface UnparsedFunctionCallTransaction extends ReadableTransactionBase {
  type: "unparsed-function-call";
  target: `0x${string}`;
  signature?: string;
  calldata: `0x${string}`;
  value: bigint;
  error?: string;
}

interface UnparsedPayableFunctionCallTransaction
  extends ReadableTransactionBase {
  type: "unparsed-payable-function-call";
  target: `0x${string}`;
  signature?: string;
  calldata: `0x${string}`;
  value: bigint;
}

export interface PayerTopUpTransaction extends ReadableTransactionBase {
  type: "payer-top-up";
  target: `0x${string}`;
  value: bigint;
}

interface WethDepositTransaction extends ReadableTransactionBase {
  type: "weth-deposit";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputs: any[];
  functionInputTypes: readonly AbiParameter[];
}

interface WethApprovalTransaction extends ReadableTransactionBase {
  type: "weth-approval";
  target: `0x${string}`;
  receiverAddress: `0x${string}`;
  wethAmount: bigint;
  functionName: string;
  functionInputs: any[];
  functionInputTypes: readonly AbiParameter[];
}

interface WethTransferTransaction extends ReadableTransactionBase {
  type: "weth-transfer";
  target: `0x${string}`;
  receiverAddress: `0x${string}`;
  wethAmount: bigint;
  functionName: string;
  functionInputTypes: readonly AbiParameter[];
  functionInputs: any[];
}

interface UsdcApprovalTransaction extends ReadableTransactionBase {
  type: "usdc-approval";
  target: `0x${string}`;
  spenderAddress: `0x${string}`;
  usdcAmount: bigint;
  functionName: string;
  functionInputTypes: readonly AbiParameter[];
  functionInputs: any[];
}

export interface UsdcTransferViaPayerTransaction
  extends ReadableTransactionBase {
  type: "usdc-transfer-via-payer";
  receiverAddress: `0x${string}`;
  usdcAmount: bigint;
  target: `0x${string}`;
  functionName: string;
  functionInputs: any[];
  functionInputTypes: readonly AbiParameter[];
}

interface UsdcStreamFundingViaPayerTransaction extends ReadableTransactionBase {
  type: "usdc-stream-funding-via-payer";
  receiverAddress: `0x${string}`;
  usdcAmount: bigint;
  target: `0x${string}`;
  functionName: string;
  functionInputs: any[];
  functionInputTypes: readonly AbiParameter[];
}

interface TreasuryNounTransferTransaction extends ReadableTransactionBase {
  type: "treasury-noun-transfer";
  target: `0x${string}`;
  nounId: bigint;
  receiverAddress: `0x${string}`;
  safe: boolean;
  functionName: string;
  functionInputs: any[];
  functionInputTypes: readonly AbiParameter[];
}

interface EscrowNounTransferTransaction extends ReadableTransactionBase {
  type: "escrow-noun-transfer";
  target: `0x${string}`;
  nounIds: bigint[];
  receiverAddress: `0x${string}`;
  functionName: string;
  functionInputs: any[];
  functionInputTypes: readonly AbiParameter[];
}

export interface WethStreamFundingTransaction extends ReadableTransactionBase {
  type: "weth-stream-funding";
  target: `0x${string}`;
  receiverAddress: `0x${string}`;
  wethAmount: bigint;
  functionName: string;
  functionInputs: any[];
  functionInputTypes: readonly AbiParameter[];
}

export interface StreamTransaction extends ReadableTransactionBase {
  type: "stream";
  token: string;
  receiverAddress: `0x${string}`;
  tokenAmount: bigint;
  startDate: Date;
  endDate: Date;
  streamContractAddress: `0x${string}`;
  target: `0x${string}`;
  functionName: string;
  functionInputs: any[];
  functionInputTypes: readonly AbiParameter[];
  tokenContractAddress: `0x${string}`;
}

export type ReadableTransaction =
  | TransferTransaction
  | FunctionCallTransaction
  | PayableFunctionCallTransaction
  | UnparsedFunctionCallTransaction
  | UnparsedPayableFunctionCallTransaction
  | PayerTopUpTransaction
  | WethDepositTransaction
  | WethApprovalTransaction
  | WethTransferTransaction
  | WethStreamFundingTransaction
  | UsdcApprovalTransaction
  | UsdcTransferViaPayerTransaction
  | UsdcStreamFundingViaPayerTransaction
  | TreasuryNounTransferTransaction
  | EscrowNounTransferTransaction
  | StreamTransaction;

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

export type ActionType =
  | "one-time-payment"
  | "streaming-payment"
  | "payer-top-up"
  | "custom-transaction";

interface ActionBase {
  type: ActionType;
}

interface OneTimePaymentAction extends ActionBase {
  type: "one-time-payment";
  currency: "eth" | "usdc";
  amount: string;
  target: `0x${string}`;
}

interface StreamingPaymentAction extends ActionBase {
  type: "streaming-payment";
  currency: "weth" | "usdc";
  amount: string;
  target: `0x${string}`;
  startTimestamp: Date;
  endTimestamp: Date;
  predictedStreamContractAddress: `0x${string}`;
}

interface PayerTopUpAction extends ActionBase {
  type: "payer-top-up";
  amount: string;
}

interface CustomTransactionAction extends ActionBase {
  type: "custom-transaction";
  target: `0x${string}`;
  contractCallSignature: string;
  contractCallValue: number;
  contractCallTarget: `0x${string}`;
  contractCallArguments: any[];
}

export type Action =
  | OneTimePaymentAction
  | StreamingPaymentAction
  | PayerTopUpAction
  | CustomTransactionAction;

export type FormAction = {
  type: ActionType;
  form: React.FC;
  toAction: (data: any) => Action;
};
