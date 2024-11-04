import { useDecodedFunctionData } from "./routes/decode-function-data";

export const useEnhancedParsedTransaction = async (transaction: any) => {
  const { type, target, calldata, value } = transaction;
  // @TODO
  const isUnparsed = [
    "unparsed-function-call",
    "unparsed-payable-function-call",
  ].includes(type);

  const decodedFunctionData = await useDecodedFunctionData({
    target,
    calldata,
    // @TODO -- pass isUnparsed
  });

  if (decodedFunctionData == null) return transaction;

  const enhancedType = [
    // @ts-ignore
    decodedFunctionData?.proxy ? "proxied" : null,
    type === "unparsed-payable-function-call" ? "payable" : null,
    "function-call",
  ]
    .filter(Boolean)
    .join("-");

  return {
    target,
    // @ts-ignore
    proxyImplementationAddress: decodedFunctionData?.proxyImplementationAddress,
    type: enhancedType,
    functionName: decodedFunctionData.name,
    functionInputs: decodedFunctionData.inputs,
    functionInputTypes: decodedFunctionData.inputTypes,
    value,
  };
};
