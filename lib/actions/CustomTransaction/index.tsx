import { TransactionConfig, ActionConfig } from "../../types";
import {
  CustomTransactionAction,
  FunctionCallTransaction,
  PayableFunctionCallTransaction,
} from "./types";
import CustomTransactionForm, { dataToAction } from "./Form";
import {
  AbiParameter,
  encodeAbiParameters,
  formatUnits,
  parseAbiItem,
} from "viem";
import { AbiFunction } from "viem";
import { decodeCalldataWithSignature } from "../../utils/transactions";
import { OneTimePaymentActionConfig } from "../NounsOneTimePayment";
import TransactionParser from "../../utils/parser";
import { formatAbiParameter } from "abitype";
import { FunctionCallCodeBlock } from "../../components/FunctionCallCodeBlock";

export const FunctionCallTransactionConfig: TransactionConfig<FunctionCallTransaction> =
  {
    type: "function-call",
    parse: (rt) => {
      const {
        name: functionName,
        inputs: functionInputs,
        inputTypes: functionInputTypes,
        // calldataDecodingFailed,
      } = decodeCalldataWithSignature({
        signature: rt.signature,
        calldata: rt.calldata,
      });

      if (BigInt(rt.value) > 0) {
        return false;
      }
      return {
        type: "function-call",
        target: rt.target as `0x${string}`,
        functionName,
        functionInputs,
        functionInputTypes,
        value: 0n,
      };
    },
    unparse: (t) => {
      const signature = `${t.functionName}(${t.functionInputTypes
        .map((t) => formatAbiParameter(t as unknown as AbiParameter))
        .join(",")})`;
      return {
        target: t.target,
        value: "0",
        signature,
        calldata: encodeAbiParameters(
          t.functionInputTypes,
          t.functionInputs as never
        ),
      };
    },
    transactionCodeBlock: (t) => {
      return (
        <FunctionCallCodeBlock
          target={t.target}
          name={t.functionName!}
          inputs={t.functionInputs!}
          value={t.value}
          inputTypes={t.functionInputTypes!}
        />
      );
    },
    transactionComment: () => {
      return undefined;
    },
  };

export const PayableFunctionCallTransactionConfig: TransactionConfig<PayableFunctionCallTransaction> =
  {
    type: "payable-function-call",
    parse: (rt) => {
      const {
        name: functionName,
        inputs: functionInputs,
        inputTypes: functionInputTypes,
        // calldataDecodingFailed,
      } = decodeCalldataWithSignature({
        signature: rt.signature,
        calldata: rt.calldata,
      });

      return {
        type: "payable-function-call",
        target: rt.target as `0x${string}`,
        functionName,
        functionInputs,
        functionInputTypes,
        value: BigInt(rt.value),
      };
    },
    unparse: (t) => {
      const signature = `${t.functionName}(${t.functionInputTypes
        .map((t) => formatAbiParameter(t as unknown as AbiParameter))
        .join(",")})`;
      return {
        target: t.target,
        value: t.value,
        signature,
        calldata: encodeAbiParameters(
          t.functionInputTypes,
          t.functionInputs as never
        ),
      };
    },
    transactionCodeBlock: (t) => {
      return (
        <FunctionCallCodeBlock
          target={t.target}
          name={t.functionName!}
          inputs={t.functionInputs!}
          value={t.value}
          inputTypes={t.functionInputTypes!}
        />
      );
    },
    transactionComment: () => {
      return undefined;
    },
  };

export const CustomTransactionActionConfig: ActionConfig<
  CustomTransactionAction,
  FunctionCallTransaction | PayableFunctionCallTransaction
> = {
  type: "custom-transaction",
  form: () => <CustomTransactionForm />,
  formdataToAction: dataToAction,
  getTransactions: () => {
    return [
      FunctionCallTransactionConfig,
      PayableFunctionCallTransactionConfig,
    ];
  },
  resolveAction: (a) => {
    const { name: functionName, inputs: functionInputTypes } = parseAbiItem(
      `function ${a.contractCallSignature}`
    ) as AbiFunction;

    if (a.contractCallValue > 0)
      return [
        {
          type: "payable-function-call",
          target: a.contractCallTarget,
          functionName,
          functionInputs: a.contractCallArguments,
          functionInputTypes,
          value: BigInt(a.contractCallValue),
        },
      ];

    return [
      {
        type: "function-call",
        target: a.contractCallTarget,
        functionName,
        functionInputs: a.contractCallArguments,
        functionInputTypes,
        value: 0n,
      },
    ];
  },
  buildAction: (r) => {
    // @ts-ignore
    const parser = new TransactionParser(1, [OneTimePaymentActionConfig]);
    // if (transactionsLeft.length === 0) return null;
    let remainingTransactions = r;
    const tx = remainingTransactions[0];
    const { targets, signatures, calldatas, values } = parser.unparse([tx]);
    remainingTransactions = remainingTransactions.slice(1);
    const { name, inputs, inputTypes } = decodeCalldataWithSignature({
      signature: signatures[0],
      calldata: calldatas[0],
    });

    const signature = `${name}(${inputTypes
      .map((t) => formatAbiParameter(t))
      .join(",")})`;

    return {
      action: {
        type: "custom-transaction",
        target: targets[0],
        contractCallTarget: targets[0],
        contractCallSignature: signature,
        contractCallArguments: inputs,
        contractCallValue: Number(values[0]),
        //   firstTransactionIndex: getTransactionIndex(tx),
      },
      remainingTransactions,
    };
  },
  actionSummary: (a) => {
    return (
      <>
        {a.contractCallValue > 0 ? (
          <>
            <em>{formatUnits(BigInt(a.contractCallValue), 18)}</em> payable
            function call
          </>
        ) : (
          "Function call"
        )}{" "}
        to contract
        <em>{a.contractCallTarget}</em>
      </>
    );
  },
};
