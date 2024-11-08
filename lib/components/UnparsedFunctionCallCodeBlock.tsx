import { formatUnits } from "viem";

export const UnparsedFunctionCallCodeBlock = ({
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
