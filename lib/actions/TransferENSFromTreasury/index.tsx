import { parseEther, encodeAbiParameters, formatUnits } from "viem";
import {
  ReadableTransaction,
  TransactionHandler,
  ActionHandler,
  RawTransaction,
  ParsedFunctionCallTransaction,
  Action,
} from "../../types";
import { TransferENSFromTreasuryAction, TransferENSTransaction } from "./types";
import { FunctionCallCodeBlock } from "../../components/FunctionCallCodeBlock";
import {
  normalizeSignature,
  decodeCalldataWithSignature,
} from "../../utils/ethereum";
import TransferENSFromTreasuryForm, { dataToAction } from "./Form";

// -------------------------------------------------------------------------------------------------
// Experimental class based approach
// -------------------------------------------------------------------------------------------------
// maybe we can initialize this into any data format. (raw or readable).
// The idea is that you should be able to initialize this into any data format.
// Then, you should be able to convert it into the other format, using the methods.
// It's like you have an instance of TransferENSTransaction. With certain data (amounts, recievers differ etc)
// But what stays the same is the ability to parse and unparse the data in the raw format, as well as
// being able to generate the code block and comment for the transaction (shared by all instances)
// -------------------------------------------------------------------------------------------------

export class TransferENSFromTreasuryActionHandler extends ActionHandler {
  static readonly type = "transfer-ens-from-treasury" as const;
  static readonly form = TransferENSFromTreasuryForm;
  static readonly formdataToAction = dataToAction;

  constructor(action: Action) {
    super(action);
  }

  static getTransactions(): (typeof TransactionHandler<ReadableTransaction>)[] {
    return [TransferENSTransactionHandler];
  }

  static build(r: ReadableTransaction[]): {
    action: TransferENSFromTreasuryAction;
    remainingTransactions: ReadableTransaction[];
  } | null {
    let remainingTransactions = r;

    const transferEnsTx = remainingTransactions.find(
      (t) => t.type === "transfer-ens"
    ) as TransferENSTransaction | null;

    if (transferEnsTx != null) {
      remainingTransactions = remainingTransactions.filter(
        (t) => t !== transferEnsTx
      );
      const action: TransferENSFromTreasuryAction = {
        type: "transfer-ens-from-treasury",
        receiver: transferEnsTx.receiver,
        amount: formatUnits(transferEnsTx.value, 18),
      };
      return { action, remainingTransactions };
    }

    return null;
  }

  resolve(
    a: TransferENSFromTreasuryAction
  ): TransactionHandler<TransferENSTransaction>[] {
    const transferTx = new TransferENSTransactionHandler("parsed", {
      type: "transfer-ens",
      target: "0x323a76393544d5ecca80cd6ef2a560c6a395b7e3",
      value: parseEther(a.amount),
      receiver: a.receiver,
    });

    return [transferTx];
  }

  summarize(a: TransferENSFromTreasuryAction): JSX.Element {
    return (
      <>
        Transfer <em>{a.amount} ENS</em> to <em>{a.receiver}</em>
      </>
    );
  }
}

export class TransferENSTransactionHandler
  implements TransactionHandler<TransferENSTransaction>
{
  static readonly type = "transfer-ens" as const;
  readonly raw: RawTransaction;
  readonly parsed: ParsedFunctionCallTransaction<TransferENSTransaction>;

  constructor(
    mode: "raw" | "parsed",
    data: RawTransaction | ParsedFunctionCallTransaction<TransferENSTransaction>
  ) {
    switch (mode) {
      case "raw":
        if ("type" in data) {
          throw new Error("Invalid mode");
        }
        this.raw = data;
        this.parsed = TransferENSTransactionHandler.parse(
          this.raw
        ) as ParsedFunctionCallTransaction<TransferENSTransaction>;
        break;
      case "parsed":
        if (!("type" in data)) {
          throw new Error("Invalid mode");
        }
        this.parsed = data;
        this.raw = TransferENSTransactionHandler.unparse(this.parsed);
        break;
      default:
        throw new Error("Invalid mode");
    }
  }

  static parse(
    rt: RawTransaction
  ): ParsedFunctionCallTransaction<TransferENSTransaction> | false {
    if (
      rt.target.toLowerCase() ===
        "0x323a76393544d5ecca80cd6ef2a560c6a395b7e3".toLowerCase() &&
      normalizeSignature(rt.signature) ===
        normalizeSignature("transfer(address,uint256)")
    ) {
      const {
        name: functionName,
        inputs: functionInputs,
        inputTypes: functionInputTypes,
      } = decodeCalldataWithSignature({
        signature: rt.signature,
        calldata: rt.calldata,
      });
      const receiverAddress = functionInputs[0].toLowerCase();

      return {
        type: "transfer-ens",
        target: rt.target as `0x${string}`,
        functionName,
        functionInputs,
        functionInputTypes,
        receiver: receiverAddress,
        value: BigInt(functionInputs[1]),
      };
    }

    return false;
  }

  static unparse(t: TransferENSTransaction): RawTransaction {
    return {
      target:
        "0x323a76393544d5ecca80cd6ef2a560c6a395b7e3".toLowerCase() as `0x${string}`,
      value: "0",
      signature: "transfer(address,uint256)",
      calldata: encodeAbiParameters(
        [{ type: "address" }, { type: "uint256" }],
        [t.receiver, t.value]
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
