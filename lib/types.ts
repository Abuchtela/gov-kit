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

export type DecodedTransaction = {
  name: string;
  inputs: any[];
  inputTypes: any[];
  proxy: boolean;
  proxyImplementation?: `0x${string}`;
};

type OffchainTransactionType =
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

interface OffchainTransactionBaseType {
  type: OffchainTransactionType;
}

export interface TransferTransaction extends OffchainTransactionBaseType {
  type: "transfer";
  target: `0x${string}`;
  value: bigint;
}

interface FunctionCallTransaction extends OffchainTransactionBaseType {
  type: "function-call";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputTypes: string[];
  functionInputs: any[];
}

interface PayableFunctionCallTransaction extends OffchainTransactionBaseType {
  type: "payable-function-call";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputTypes: string[];
  functionInputs: any[];
}

interface UnparsedFunctionCallTransaction extends OffchainTransactionBaseType {
  type: "unparsed-function-call";
  target: `0x${string}`;
  signature: string;
  calldata: `0x${string}`;
  value: bigint;
}

interface UnparsedPayableFunctionCallTransaction
  extends OffchainTransactionBaseType {
  type: "unparsed-payable-function-call";
  target: `0x${string}`;
  signature: string;
  calldata: `0x${string}`;
  value: bigint;
}

export interface PayerTopUpTransaction extends OffchainTransactionBaseType {
  type: "payer-top-up";
  target: `0x${string}`;
  value: bigint;
}

interface WethDepositTransaction extends OffchainTransactionBaseType {
  type: "weth-deposit";
  target: `0x${string}`;
  value: bigint;
}

interface WethApprovalTransaction extends OffchainTransactionBaseType {
  type: "weth-approval";
  target: `0x${string}`;
  receiverAddress: `0x${string}`;
  wethAmount: bigint;
}

interface WethTransferTransaction extends OffchainTransactionBaseType {
  type: "weth-transfer";
  target: `0x${string}`;
  receiverAddress: `0x${string}`;
  wethAmount: bigint;
}

interface UsdcApprovalTransaction extends OffchainTransactionBaseType {
  type: "usdc-approval";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputTypes: string[];
  functionInputs: any[];
}

export interface UsdcTransferViaPayerTransaction
  extends OffchainTransactionBaseType {
  type: "usdc-transfer-via-payer";
  target: `0x${string}`;
  receiverAddress: `0x${string}`;
  usdcAmount: bigint;
}

interface UsdcStreamFundingViaPayerTransaction
  extends OffchainTransactionBaseType {
  type: "usdc-stream-funding-via-payer";
  receiverAddress: `0x${string}`;
  usdcAmount: bigint;
}

interface TreasuryNounTransferTransaction extends OffchainTransactionBaseType {
  type: "treasury-noun-transfer";
  target: `0x${string}`;
  nounId: bigint;
  receiverAddress: `0x${string}`;
  safe: boolean;
}

interface EscrowNounTransferTransaction extends OffchainTransactionBaseType {
  type: "escrow-noun-transfer";
  target: `0x${string}`;
  nounIds: bigint[];
  receiverAddress: `0x${string}`;
}

export interface WethStreamFundingTransaction
  extends OffchainTransactionBaseType {
  type: "weth-stream-funding";
  target: `0x${string}`;
  receiverAddress: `0x${string}`;
  wethAmount: bigint;
}

export interface StreamTransaction extends OffchainTransactionBaseType {
  type: "stream";
  token: string;
  receiverAddress: `0x${string}`;
  tokenAmount: bigint;
  startDate: Date;
  endDate: Date;
  streamContractAddress: string;
}

export type OffchainTransaction =
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

export type OnChainTransaction = {
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
  | "usdc"
  | "payer-top-up"
  | "custom-transaction";

interface ActionBaseType {
  type: ActionType;
}

interface OneTimePaymentAction extends ActionBaseType {
  type: "one-time-payment";
  currency: "eth" | "usdc";
  amount: string;
  target: `0x${string}`;
}

interface StreamingPaymentAction extends ActionBaseType {
  type: "streaming-payment";
  currency: "weth" | "usdc";
  amount: string;
  target: `0x${string}`;
  startTimestamp: Date;
  endTimestamp: Date;
  predictedStreamContractAddress: `0x${string}`;
}

interface PayerTopUpAction extends ActionBaseType {
  type: "payer-top-up";
  amount: string;
}

interface CustomTransactionAction extends ActionBaseType {
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
