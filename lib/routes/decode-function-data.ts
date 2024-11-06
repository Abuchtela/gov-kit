import { getAbiItem, decodeFunctionData, AbiFunction } from "viem";
import { getContractInfo } from "./contract-info";

const decodeCalldataWithAbi = ({
  abi,
  calldata,
}: {
  abi: any;
  calldata: any;
}) => {
  try {
    const { functionName, args } = decodeFunctionData({
      abi,
      data: calldata,
    });

    console.log(functionName, args);

    if (args == null) return { name: functionName, inputs: [] };

    const { inputs: inputTypes } = getAbiItem({
      abi,
      name: functionName,
    }) as AbiFunction;

    return {
      name: functionName,
      inputs: args,
      inputTypes,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const useDecodedFunctionData = async ({
  target,
  calldata,
  etherscanApiKey,
}: {
  target: `0x${string}`;
  calldata: string;
  etherscanApiKey: string;
}) => {
  const contractInfo = await getContractInfo(target, etherscanApiKey);
  if (contractInfo === "Error") return null;
  const abi = contractInfo?.abi;
  const proxyImplementation = contractInfo?.implementationAddress;

  const decodedFunctionData =
    abi == null ? null : decodeCalldataWithAbi({ abi, calldata });
  if (decodedFunctionData != null) return decodedFunctionData;
  if (proxyImplementation == null) return null;

  const decodedFunctionDataFromProxy = decodeCalldataWithAbi({
    abi: contractInfo?.implementationAbi,
    calldata,
  });

  if (decodedFunctionDataFromProxy == null) return null;

  return {
    proxy: true,
    proxyImplementationAddress: proxyImplementation,
    ...decodedFunctionDataFromProxy,
  };
};
