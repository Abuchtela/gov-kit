import { AbiParameter } from "viem";
import { BaseAction, BaseReadableTransaction } from "../../types";

export interface CustomTransactionAction extends BaseAction {
  type: "custom-transaction";
  target: `0x${string}`;
  contractCallSignature: string;
  contractCallValue: number;
  contractCallTarget: `0x${string}`;
  contractCallArguments: any[];
}

export interface FunctionCallTransaction extends BaseReadableTransaction {
  type: "function-call";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputTypes: readonly AbiParameter[];
  functionInputs: any[];
}

export interface PayableFunctionCallTransaction
  extends BaseReadableTransaction {
  type: "payable-function-call";
  target: `0x${string}`;
  value: bigint;
  functionName: string;
  functionInputTypes: readonly AbiParameter[];
  functionInputs: any[];
}
