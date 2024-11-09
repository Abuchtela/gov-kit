import {} from "viem";
import {
  getAddress as checksumEncodeAddress,
  AbiFunction,
  AbiParameter,
  parseAbiItem,
  decodeAbiParameters,
} from "viem";

export const truncateAddress = (address_: `0x${string}`) => {
  const address = checksumEncodeAddress(address_);
  return [address.slice(0, 6), address.slice(-4)].join("...");
};

export const formatSolidityArgument = (a: string | any[] | any): string => {
  if (typeof a === "string") return `"${a}"`;
  if (Array.isArray(a)) return `[${a.map(formatSolidityArgument).join(",")}]`;

  const formattedInput = a.toString();

  if (formattedInput !== "[object Object]") return formattedInput;

  // @ts-ignore
  const formattedEntries = Object.entries(a).reduce((acc, [key, value]) => {
    const formattedValue = formatSolidityArgument(value);
    if (acc == null) return `${key}: ${formattedValue}`;
    return `${acc}, ${key}: ${formattedValue}`;
  }, null);

  return `(${formattedEntries})`;
};

export const normalizeSignature = (s: string) => {
  if (s == null) return null;
  return s.replace(/\s+/g, " ").replace(/,\s*/g, ", ");
};

export const decodeCalldataWithSignature = ({
  signature,
  calldata,
}: {
  signature: string;
  calldata: `0x${string}`;
}): {
  name: string;
  inputs: any[];
  inputTypes: readonly AbiParameter[];
  calldataDecodingFailed: boolean;
  signatureDecodingFailed: boolean;
} => {
  try {
    const { name, inputs: inputTypes } = parseAbiItem(
      `function ${signature}`
    ) as AbiFunction;
    if (inputTypes.length === 0)
      return {
        name,
        inputs: [],
        inputTypes: [],
        signatureDecodingFailed: false,
        calldataDecodingFailed: false,
      };

    try {
      const inputs = decodeAbiParameters(inputTypes, calldata) as any;
      return {
        name,
        inputs,
        inputTypes,
        signatureDecodingFailed: false,
        calldataDecodingFailed: false,
      };
    } catch (e) {
      return {
        name,
        calldataDecodingFailed: true,
        signatureDecodingFailed: false,
        inputs: [],
        inputTypes: [],
      };
    }
  } catch (e) {
    return {
      name: signature,
      signatureDecodingFailed: true,
      calldataDecodingFailed: true,
      inputs: [],
      inputTypes: [],
    };
  }
};
