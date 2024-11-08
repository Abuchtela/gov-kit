import { Fragment } from "react";
import { formatUnits, AbiParameter } from "viem";
import { truncateAddress, formatSolidityArgument } from "../utils/ethereum";

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
