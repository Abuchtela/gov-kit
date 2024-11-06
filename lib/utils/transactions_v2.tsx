import {
  parseUnits,
  parseEther,
  AbiParameter,
  encodeAbiParameters,
} from "viem";
import { RawTransaction, RawTransactions } from "../types";
import { resolveIdentifier } from "./contracts";
import { decodeCalldataWithSignature } from "./transactions";

const normalizeSignature = (s: string) => {
  if (s == null) return null;
  return s.replace(/\s+/g, " ").replace(/,\s*/g, ", ");
};

type OneTimePaymentAction = {
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

export interface UsdcTransferViaPayerTransactionWithMetadata
  extends UsdcTransferViaPayerTransaction {
  functionName: string;
  functionInputs: any[];
  functionInputTypes: readonly AbiParameter[];
}

const actionConfig = {
  // possible transaction that could live in an action
  // have types... ReadableTransaction types
  subTransactions: [],
  // returns all possible transaction types
  resolveAction: (
    a: OneTimePaymentAction
  ): (TransferTransaction | UsdcTransferViaPayerTransaction)[] => {
    switch (a.currency) {
      case "eth":
        return [
          {
            type: "transfer",
            target: a.target,
            value: parseEther(a.amount),
          },
        ];
      case "usdc":
        return [
          {
            type: "usdc-transfer-via-payer",
            receiverAddress: a.target,
            target: a.target,
            usdcAmount: parseUnits(a.amount, 6),
          },
        ];
      default:
        throw new Error();
    }
  },
  // have to order these by most specific to least specific, it's almost like CSS
  parse: (
    data: RawTransaction,
    { chainId }: { chainId: number }
  ):
    | TransferTransaction
    | UsdcTransferViaPayerTransactionWithMetadata
    | false => {
    const nounsPayerContract = resolveIdentifier(chainId, "payer");
    const isEthTransfer = data.signature == null && data.calldata === "0x";

    if (isEthTransfer)
      return {
        type: "transfer",
        target: data.target,
        value: BigInt(data.value),
      };

    const {
      name: functionName,
      inputs: functionInputs,
      inputTypes: functionInputTypes,
    } = decodeCalldataWithSignature({
      signature: data.signature,
      calldata: data.calldata,
    });

    if (
      data.target === nounsPayerContract.address &&
      normalizeSignature(data.signature) ===
        normalizeSignature("sendOrRegisterDebt(address,uint256)")
    ) {
      const receiverAddress = functionInputs[0].toLowerCase();

      return {
        type: "usdc-transfer-via-payer",
        target: data.target as `0x${string}`,
        functionName,
        functionInputs,
        functionInputTypes,
        receiverAddress: receiverAddress,
        usdcAmount: BigInt(functionInputs[1]),
      };
    }

    return false;
  },
  // could really be a property of ReadableTransaction
  unparse: (
    t: TransferTransaction | UsdcTransferViaPayerTransaction,
    { chainId }: { chainId: number }
  ): RawTransaction => {
    const nounsPayerContract = resolveIdentifier(chainId, "payer");

    if (t.type === "transfer") {
      return {
        target: t.target,
        value: t.value,
        signature: "",
        calldata: "0x",
      };
    } else if (t.type === "usdc-transfer-via-payer") {
      return {
        target: nounsPayerContract.address,
        value: "0",
        signature: "sendOrRegisterDebt(address,uint256)",
        calldata: encodeAbiParameters(
          [{ type: "address" }, { type: "uint256" }],
          [t.receiverAddress, t.usdcAmount]
        ),
      };
    } else {
      throw new Error();
    }
  },
  buildAction: () => {},
  actionSummary: (a: OneTimePaymentAction): JSX.Element => {
    return (
      <>
        Transfer{" "}
        <em>
          {a.amount} {a.currency.toUpperCase()}
        </em>{" "}
        to <em>{a.target}</em>
      </>
    );
  },
  transactionComment: (): JSX.Element => {
    return <p>No comment</p>;
  },
};
