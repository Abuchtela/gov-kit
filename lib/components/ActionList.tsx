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
      throw new Error(`Unknown transaction type: "${t.type}"`);
  }
};

export const ActionListItem = ({ action }: { action: Action }) => {
  const [expanded, setExpanded] = useState(false);
  const { actions, parser } = useGovKitContext();

  const actionConfig = actions.find((a) => a.type === action.type);

  if (actionConfig == null) {
    throw new Error(`Unknown action type: "${action.type}"`);
  }

  const actionTransactions = parser.resolveAction(action);
  const ActionSummary = parser.actionSummary(action);

  return (
    <>
      <div>{ActionSummary}</div>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Hide" : "Show"} Transaction
      </button>
      {expanded && (
        <ul className="space-y-4">
          {actionTransactions.map((t, i) => {
            const Comment = t.comment();
            const CodeBlock = t.codeBlock();
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
