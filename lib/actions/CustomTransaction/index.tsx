import {
  TransactionHandler,
  ActionHandler,
  RawTransaction,
  ParsedFunctionCallTransaction,
  ReadableTransaction,
} from "../../types";
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
import { decodeCalldataWithSignature } from "../../utils/ethereum";
import { OneTimePaymentActionConfig } from "../NounsOneTimePayment";
import { TransactionParser } from "../../utils/parser";
import { formatAbiParameter } from "abitype";
import { FunctionCallCodeBlock } from "../../components/FunctionCallCodeBlock";

export class FunctionCallTransactionHandler
  implements TransactionHandler<FunctionCallTransaction>
{
  static readonly type = "function-call";
  readonly raw: RawTransaction;
  readonly parsed: ParsedFunctionCallTransaction<FunctionCallTransaction>;

  constructor(
    mode: "raw" | "parsed",
    data:
      | RawTransaction
      | ParsedFunctionCallTransaction<FunctionCallTransaction>
  ) {
    switch (mode) {
      case "raw":
        this.raw = data as RawTransaction;
        this.parsed = FunctionCallTransactionHandler.parse(
          this.raw
        ) as ParsedFunctionCallTransaction<FunctionCallTransaction>;
        break;
      case "parsed":
        this.parsed =
          data as ParsedFunctionCallTransaction<FunctionCallTransaction>;
        this.raw = FunctionCallTransactionHandler.unparse(this.parsed);
        break;
      default:
        throw new Error("Invalid mode");
    }
  }

  static parse(
    rt: RawTransaction
  ): ParsedFunctionCallTransaction<FunctionCallTransaction> | false {
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
  }

  static unparse(
    t: ParsedFunctionCallTransaction<FunctionCallTransaction>
  ): RawTransaction {
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
  }

  codeBlock() {
    return (
      <FunctionCallCodeBlock
        target={this.parsed.target}
        name={this.parsed.functionName!}
        inputs={this.parsed.functionInputs!}
        value={this.parsed.value}
        inputTypes={this.parsed.functionInputTypes!}
      />
    );
  }

  comment() {
    return undefined;
  }
}

export class PayableFunctionCallTransactionHandler
  implements TransactionHandler<PayableFunctionCallTransaction>
{
  static readonly type = "payable-function-call";
  readonly raw: RawTransaction;
  readonly parsed: ParsedFunctionCallTransaction<PayableFunctionCallTransaction>;

  constructor(
    mode: "raw" | "parsed",
    data:
      | RawTransaction
      | ParsedFunctionCallTransaction<PayableFunctionCallTransaction>
  ) {
    switch (mode) {
      case "raw":
        this.raw = data as RawTransaction;
        this.parsed = PayableFunctionCallTransactionHandler.parse(
          this.raw
        ) as ParsedFunctionCallTransaction<PayableFunctionCallTransaction>;
        break;
      case "parsed":
        this.parsed =
          data as ParsedFunctionCallTransaction<PayableFunctionCallTransaction>;
        this.raw = PayableFunctionCallTransactionHandler.unparse(this.parsed);
        break;
      default:
        throw new Error("Invalid mode");
    }
  }

  static parse(
    rt: RawTransaction
  ): ParsedFunctionCallTransaction<PayableFunctionCallTransaction> | false {
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
  }

  static unparse(
    t: ParsedFunctionCallTransaction<PayableFunctionCallTransaction>
  ): RawTransaction {
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
  }

  codeBlock() {
    return (
      <FunctionCallCodeBlock
        target={this.parsed.target}
        name={this.parsed.functionName!}
        inputs={this.parsed.functionInputs!}
        value={this.parsed.value}
        inputTypes={this.parsed.functionInputTypes!}
      />
    );
  }

  comment() {
    return undefined;
  }
}

export class CustomTransactionActionHandler
  implements
    ActionHandler<
      CustomTransactionAction,
      FunctionCallTransaction | PayableFunctionCallTransaction
    >
{
  static readonly type = "custom-transaction" as const;
  static readonly form = CustomTransactionForm;
  static readonly formdataToAction = dataToAction;
  readonly action: CustomTransactionAction;

  constructor(action: CustomTransactionAction) {
    this.action = action;
  }

  getTransactions() {
    return [
      FunctionCallTransactionHandler,
      PayableFunctionCallTransactionHandler,
    ];
  }

  resolve(
    a: CustomTransactionAction
  ): TransactionHandler<
    FunctionCallTransaction | PayableFunctionCallTransaction
  >[] {
    const { name: functionName, inputs: functionInputTypes } = parseAbiItem(
      `function ${a.contractCallSignature}`
    ) as AbiFunction;

    if (a.contractCallValue > 0)
      return [
        new PayableFunctionCallTransactionHandler("raw", {
          type: "payable-function-call",
          target: a.contractCallTarget,
          functionName,
          functionInputs: a.contractCallArguments,
          functionInputTypes,
          value: BigInt(a.contractCallValue),
        }),
      ];

    return [
      new FunctionCallTransactionHandler("raw", {
        type: "function-call",
        target: a.contractCallTarget,
        functionName,
        functionInputs: a.contractCallArguments,
        functionInputTypes,
        value: 0n,
      }),
    ];
  }

  build(r: ReadableTransaction[]) {
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
      },
      remainingTransactions,
    };
  }

  summarize(a: CustomTransactionAction) {
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
  }
}
