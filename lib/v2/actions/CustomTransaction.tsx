import {
  CustomTransactionAction,
  FunctionCallTransaction,
  PayableFunctionCallTransaction,
  UnparsedFunctionCallTransaction,
  UnparsedPayableFunctionCallTransaction,
  TransactionConfig,
  ActionConfig,
} from "../utils/types";

export const FunctionCallTransactionConfig: TransactionConfig<FunctionCallTransaction> =
  {
    type: "function-call",
    parse: () => {},
    unparse: () => {},
    transactionCodeBlock: () => {},
    transactionComment: () => {},
  };

export const PayableFunctionCallTransactionConfig: TransactionConfig<PayableFunctionCallTransaction> =
  {
    type: "payable-function-call",
    parse: () => {},
    unparse: () => {},
    transactionCodeBlock: () => {},
    transactionComment: () => {},
  };

export const UnparsedFunctionCallTransactionConfig: TransactionConfig<UnparsedFunctionCallTransaction> =
  {
    type: "unparsed-function-call",
    parse: () => {},
    unparse: () => {},
    transactionCodeBlock: () => {},
    transactionComment: () => {},
  };

export const UnparsedPayableFunctionCallTransactionConfig: TransactionConfig<UnparsedPayableFunctionCallTransaction> =
  {
    type: "unparsed-payable-function-call",
    parse: () => {},
    unparse: () => {},
    transactionCodeBlock: () => {},
    transactionComment: () => {},
  };

export const CustomTransactionActionConfig: ActionConfig<
  CustomTransactionAction,
  | FunctionCallTransaction
  | PayableFunctionCallTransaction
  | UnparsedFunctionCallTransaction
  | UnparsedPayableFunctionCallTransaction
> = {
  type: "custom-transaction",
  getFormValues: () => {},
  getTransactions: () => {},
  resolveAction: () => {},
  buildAction: () => {},
  actionSummary: () => {},
};
