import { Fragment, useState } from "react";
import { Action, ReadableTransaction } from "../types";
import {
  resolveAction as resolveActionTransactions,
  decimalsByCurrency,
} from "../utils/transactions";
import { resolveIdentifier as resolveContractIdentifier } from "../utils/contracts";
import { AbiParameter, formatUnits } from "viem";
import { truncateAddress, formatSolidityArgument } from "../utils/ethereum";

export const TransactionExplanation = ({
  transaction: t,
}: {
  transaction: ReadableTransaction;
}) => {
  const chainId = 1;

  switch (t.type) {
    case "transfer":
      return (
        <>
          Transfer <em>{formatUnits(t.value, 18)} ETH</em> to{" "}
          <em>{t.target}</em>
        </>
      );

    case "usdc-approval":
      return (
        <>
          Approve <em>{t.spenderAddress}</em> to spend{" "}
          <em>
            {parseFloat(formatUnits(t.usdcAmount, 6)).toLocaleString()} USDC
          </em>
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

    case "weth-transfer":
      return (
        <>
          Transfer <em>{formatUnits(t.wethAmount, 18)} WETH</em> to{" "}
          <em>{t.receiverAddress}</em>
        </>
      );

    case "weth-approval":
      return (
        <>
          Approve <em>{t.receiverAddress}</em> to spend{" "}
          <em>{formatUnits(t.wethAmount, 18)} WETH</em>
        </>
      );

    case "weth-deposit":
      return (
        <>
          Deposit <em>{formatUnits(t.value, 18)} ETH</em> to the{" "}
          <em>{t.target}</em> contract
        </>
      );

    case "payer-top-up": {
      const { address: nounsPayerAddress } = resolveContractIdentifier(
        chainId,
        "payer"
      );
      return (
        <>
          Top up the <em>{nounsPayerAddress}</em>
        </>
      );
    }

    case "stream": {
      const formattedUnits = formatUnits(
        t.tokenAmount,
        decimalsByCurrency[
          t.token.toLowerCase() as keyof typeof decimalsByCurrency
        ]
      );

      return (
        <>
          Stream{" "}
          {t.token != null && (
            <>
              <em>
                {t.token === "USDC"
                  ? parseFloat(formattedUnits).toLocaleString()
                  : formattedUnits}{" "}
                {t.token}
              </em>{" "}
            </>
          )}
          to <em>{t.receiverAddress}</em> between {}
          {new Date(t.startDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          and{" "}
          {new Date(t.endDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          (
          {
            /* get difference in months */
            new Date(t.endDate).getMonth() - new Date(t.startDate).getMonth()
          }{" "}
          months)
        </>
      );
    }

    case "usdc-stream-funding-via-payer":
    case "weth-stream-funding":
      return (
        <>
          Fund the <em>Stream Contract</em>
        </>
      );

    case "treasury-noun-transfer":
      return (
        <>
          Transfer Noun {t.nounId} to <em>{t.receiverAddress}</em>
        </>
      );

    case "escrow-noun-transfer":
      return (
        <>
          Transfer{" "}
          {t.nounIds.map((nounId: bigint, i: number, all: any) => {
            const isFirst = i === 0;
            const isLast = i === all.length - 1;
            return (
              <Fragment key={nounId}>
                {!isFirst && <>, </>}
                {!isFirst && isLast && <>and </>}
                Noun {Number(nounId)}
              </Fragment>
            );
          })}{" "}
          to <em>{t.receiverAddress}</em>
        </>
      );

    case "function-call":
    case "unparsed-function-call":
    case "payable-function-call":
    case "unparsed-payable-function-call":
      return (
        <>
          {t.value > 0 ? (
            <>
              <em>{formatUnits(t.value, 18)}</em> payable function call
            </>
          ) : (
            "Function call"
          )}{" "}
          to contract
          {/* TODO: figure out where to annotate with proxyImplementationAddress */}
          {/* {t.proxyImplementationAddress != null ? "proxy contract" : "contract"}{" "} */}
          <em>{t.target}</em>
        </>
      );

    default:
      // @ts-ignore
      throw new Error(`Unknown transaction type: "${t.type}"`);
  }
};

export const FunctionCallCodeBlock = ({
  target,
  name,
  inputs,
  value,
  inputTypes,
}: {
  target: `0x${string}`;
  name: string;
  inputs: any[];
  value: bigint;
  inputTypes: readonly AbiParameter[];
}) => (
  <pre className="bg-neutral-100 rounded p-2 text-sm text-neutral-500">
    {truncateAddress(target)}.<span className="text-blue-500">{name}</span>(
    {inputs.length > 0 && (
      <>
        <br />
        {inputs.map((input, i, inputs) => {
          const inputType = inputTypes[i].type;
          return (
            <Fragment key={i}>
              &nbsp;&nbsp;
              {Array.isArray(input) ? (
                <>
                  [
                  {input.map((item, i, items) => (
                    <Fragment key={i}>
                      <span data-argument>
                        {inputType === "address[]"
                          ? String(item)
                          : formatSolidityArgument(item)}
                      </span>
                      {i < items.length - 1 && <>, </>}
                    </Fragment>
                  ))}
                  ]
                </>
              ) : (
                <span data-argument>
                  {inputType === "address"
                    ? input
                    : formatSolidityArgument(input)}
                </span>
              )}
              {i !== inputs.length - 1 && <>,</>}
              <br />
            </Fragment>
          );
        })}
      </>
    )}
    )
    {value > 0 && (
      <>
        <br />
        <span>value</span>: <span>{value.toString()}</span>
        <span>
          {" // "}
          {formatUnits(value, 18)} ETH
          {/* <FormattedEthWithConditionalTooltip value={value} /> */}
        </span>
      </>
    )}
  </pre>
);

const UnparsedFunctionCallCodeBlock = ({
  transaction: t,
}: {
  transaction: {
    target: `0x${string}`;
    value: bigint;
    signature?: string | null;
    calldata?: string | null;
  };
}) => (
  <pre className="bg-neutral-100 rounded p-2 text-sm text-neutral-500">
    <span>target</span>: <span>{t.target}</span>
    {t.signature != null && (
      <>
        <br />
        <span>signature</span>: <span>{t.signature}</span>
      </>
    )}
    {t.calldata != null && (
      <>
        <br />
        <span data-identifier>calldata</span>:{" "}
        <span data-argument>{t.calldata}</span>
      </>
    )}
    {BigInt(t.value) > 0 && (
      <>
        <br />
        <span>value</span>: <span>{t.value.toString()}</span>
        <span>
          {" // "}
          {formatUnits(BigInt(t.value), 18)} ETH
          {/* <FormattedEthWithConditionalTooltip value={t.value} /> */}
        </span>
      </>
    )}
  </pre>
);

const ActionSummary = ({ action }: { action: Action }) => {
  switch (action.type) {
    case "one-time-payment":
      return (
        <>
          Transfer{" "}
          <em>
            {/* <FormattedNumber
              value={parseFloat(a.amount)}
              minimumFractionDigits={minimumFractionDigits}
              maximumFractionDigits={maximumFractionDigits}
            /> */}
            {action.amount} {action.currency.toUpperCase()}
          </em>{" "}
          to{" "}
          <em>
            {action.target}
            {/* <AddressDisplayNameWithTooltip address={a.target} /> */}
          </em>
        </>
      );

    case "streaming-payment": {
      return (
        <>
          Stream{" "}
          <em>
            {/* <FormattedNumber
              value={parseFloat(a.amount)}
              minimumFractionDigits={minimumFractionDigits}
              maximumFractionDigits={maximumFractionDigits}
            />{" "} */}
            {action.amount} {action.currency.toUpperCase()}
          </em>{" "}
          to{" "}
          <em>
            {action.target}
            {/* <AddressDisplayNameWithTooltip address={a.target} /> */}
          </em>{" "}
          between{" "}
          <em>
            {/* <FormattedDate
              value={a.startTimestamp}
              day="numeric"
              month="short"
              year={
                getDateYear(a.startTimestamp) === getDateYear(a.endTimestamp)
                  ? undefined
                  : "numeric"
              }
            /> */}
            {new Date(action.startTimestamp).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </em>{" "}
          and{" "}
          <em>
            {new Date(action.endTimestamp).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {/* <FormattedDate
              value={a.endTimestamp}
              day="numeric"
              month="short"
              year="numeric"
            /> */}
          </em>
        </>
      );
    }
    case "custom-transaction":
      return (
        <TransactionExplanation
          transaction={resolveActionTransactions(action, { chainId: 1 })[0]}
        />
      );

    default:
      return <div>Unknown Action</div>;
  }
};

const TransactionCodeBlock = ({
  transaction,
}: {
  transaction: ReadableTransaction;
}) => {
  //   const t = useEnhancedParsedTransaction(transaction);
  const t = transaction;

  switch (t.type) {
    case "transfer":
    case "payer-top-up":
    case "unparsed-function-call":
    case "unparsed-payable-function-call":
      return <UnparsedFunctionCallCodeBlock transaction={t} />;

    default: {
      if (
        ("target" in t && t.target == null) ||
        ("functionName" in t && t.functionName == null) ||
        !Array.isArray("functionInputTypes" in t && t.functionInputTypes) ||
        !Array.isArray("functionInputs" in t && t.functionInputs)
      )
        throw new Error(`Invalid transaction "${t.type}"`);

      return (
        <FunctionCallCodeBlock
          target={t.target}
          name={t.functionName}
          inputs={t.functionInputs}
          inputTypes={t.functionInputTypes}
          value={"value" in t ? t.value : BigInt(0)}
        />
      );
    }
  }
};

const ActionListItem = ({ action }: { action: Action }) => {
  const [expanded, setExpanded] = useState(false);
  const chainId = 1;
  const actionTransactions = resolveActionTransactions(action, { chainId });

  const renderTransactionComment = (t: any) => {
    switch (t.type) {
      case "one-time-payment":
        return (
          <>
            <p>No comment</p>
          </>
        );
      case "stream":
        return <>This transaction initiates a new stream contract.</>;

      case "weth-stream-funding":
        return (
          <>
            After the deposit is done, the funds are transfered to the stream
            contract.
          </>
        );
      case "proxied-function-call":
      case "function-call":
      case "payable-function-call":
      case "proxied-payable-function-call":
      case "transfer":
      case "usdc-approval":
      case "weth-transfer":
      case "weth-approval":
      case "payer-top-up":
      case "treasury-noun-transfer":
      case "escrow-noun-transfer":
      case "prop-house-create-and-fund-round":
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <ActionSummary action={action} />
      </div>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Hide" : "Show"} Transaction
      </button>
      {expanded && (
        <ul className="space-y-4">
          {actionTransactions.map((t, i) => {
            const comment = renderTransactionComment(t);
            return (
              <li key={i}>
                <TransactionCodeBlock transaction={t} />
                {comment != null && (
                  <div className="text-sm text-neutral-500 mt-1">{comment}</div>
                )}
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
