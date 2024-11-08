import { parseEther, encodeAbiParameters, formatUnits } from "viem";
import { TransactionConfig, ActionConfig } from "../../types";
import { TransferENSFromTreasuryAction, TransferENSTransaction } from "./types";
import { decodeCalldataWithSignature } from "../../utils/transactions";
import { FunctionCallCodeBlock } from "../../components/FunctionCallCodeBlock";
import { normalizeSignature } from "../../utils/transactions";
import TransferENSFromTreasuryForm, { dataToAction } from "./Form";

export const transferENSTransactionConfig: TransactionConfig<TransferENSTransaction> =
  {
    type: "transfer-ens",
    parse: (rt) => {
      const {
        name: functionName,
        inputs: functionInputs,
        inputTypes: functionInputTypes,
      } = decodeCalldataWithSignature({
        signature: rt.signature,
        calldata: rt.calldata,
      });

      if (
        rt.target === "0x65A3870F48B5237f27f674Ec42eA1E017E111D63" &&
        normalizeSignature(rt.signature) ===
          normalizeSignature("transfer(address,uint256)")
      ) {
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
    },
    unparse: (t) => {
      return {
        // TODO: replace with the actual contract address
        target: "0x65A3870F48B5237f27f674Ec42eA1E017E111D63",
        value: "0",
        signature: "transfer(address,uint256)",
        calldata: encodeAbiParameters(
          [{ type: "address" }, { type: "uint256" }],
          [t.receiver, t.value]
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

export const TransferENSFromTreasuryActionConfig: ActionConfig<
  TransferENSFromTreasuryAction,
  TransferENSTransaction
> = {
  type: "transfer-ens-from-treasury",
  form: () => <TransferENSFromTreasuryForm />,
  formdataToAction: dataToAction,
  getTransactions: () => {
    return [transferENSTransactionConfig];
  },
  resolveAction: (a) => {
    return [
      {
        type: "transfer-ens",
        target: a.receiver,
        value: parseEther(a.amount),
        receiver: a.receiver,
      },
    ];
  },
  buildAction: (r) => {
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
        // firstTransactionIndex: getTransactionIndex(usdcTransferTx),
      };
      return { action, remainingTransactions };
    }

    return null;
  },
  actionSummary: (a) => {
    return (
      <>
        Transfer <em>{a.amount} ENS</em> to <em>{a.receiver}</em>
      </>
    );
  },
};
