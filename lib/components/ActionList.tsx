import { useState } from "react";
import { formatUnits } from "viem";
import { Action, ReadableTransaction } from "../types";
import { useGovKitContext } from "./GovKitProvider";

// used as action summary for custom transaction...
export const TransactionExplanation = ({
  transaction: t,
}: {
  transaction: ReadableTransaction;
}) => {
  switch (t.type) {
    case "transfer":
      return (
        <>
          Transfer <em>{formatUnits(t.value, 18)} ETH</em> to{" "}
          <em>{t.target}</em>
        </>
      );

    case "usdc-transfer-via-payer":
      return (
        <>
          Transfer{" "}
          <em>
            {parseFloat(formatUnits(t.usdcAmount, 6)).toLocaleString()} USDC
          </em>{" "}
          to <em>{t.receiverAddress}</em>
        </>
      );

    default:
      // @ts-ignore
      throw new Error(`Unknown transaction type: "${t.type}"`);
  }
};

export const ActionListItem = ({ action }: { action: Action }) => {
  const [expanded, setExpanded] = useState(false);
  const { actions } = useGovKitContext();

  const actionConfig = actions.find((a) => a.type === action.type);
  if (actionConfig == null) {
    throw new Error(`Unknown action type: "${action.type}"`);
  }

  const actionTransactionConfigs = actionConfig.getTransactions();
  const actionTransactions = actionConfig.resolveAction(action as any);
  const ActionSummary = actionConfig.actionSummary(action as any);

  return (
    <>
      <div>{ActionSummary}</div>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Hide" : "Show"} Transaction
      </button>
      {expanded && (
        <ul className="space-y-4">
          {actionTransactions.map((t, i) => {
            const transactionConfig = actionTransactionConfigs.find(
              (atc) => atc.type === t.type
            );
            if (transactionConfig == null) {
              throw new Error(`Unknown transaction type: "${t.type}"`);
            }

            const parsed = transactionConfig.parse(
              transactionConfig.unparse(t, { chainId: 1 }),
              { chainId: 1 }
            );
            const Comment = transactionConfig.transactionComment(t);
            const CodeBlock = transactionConfig.transactionCodeBlock(parsed);
            return (
              <li key={i}>
                {CodeBlock}
                {Comment != null && Comment}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export const ActionList = ({ actions }: { actions: Action[] }) => {
  return (
    <>
      <h1>Actions</h1>
      <ul>
        {actions.map((a, i) => (
          <li key={`${a.type}-${i}`}>
            <ActionListItem action={a} />
          </li>
        ))}
      </ul>
    </>
  );
};
