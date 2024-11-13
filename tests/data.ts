import { encodeAbiParameters, parseUnits } from "viem";
import {
  TransferENSFromTreasuryAction,
  TransferENSTransaction,
} from "../lib/actions/TransferENSFromTreasury/types";

export const SEND_FROG_1_ETH_RAW = {
  targets: ["0x65A3870F48B5237f27f674Ec42eA1E017E111D63"] as `0x${string}`[],
  signatures: [""] as string[],
  calldatas: ["0x"] as `0x${string}`[],
  values: ["1000000000000000000"],
};

export const SEND_FROG_1_USDC_RAW = {
  targets: ["0xd97bcd9f47cee35c0a9ec1dc40c1269afc9e8e1d"] as `0x${string}`[],
  signatures: ["sendOrRegisterDebt(address,uint256)"] as string[],
  calldatas: [
    encodeAbiParameters(
      [{ type: "address" }, { type: "uint256" }],
      ["0x65A3870F48B5237f27f674Ec42eA1E017E111D63", 1000n]
    ),
  ] as `0x${string}`[],
  values: ["0"],
};

export const SEND_FROG_10_ENS_RAW = {
  target: "0x323a76393544d5ecca80cd6ef2a560c6a395b7e3" as `0x${string}`,
  signature: "transfer(address,uint256)",
  calldata: encodeAbiParameters(
    [{ type: "address" }, { type: "uint256" }],
    [
      "0x65a3870f48b5237f27f674ec42ea1e017e111d63".toLowerCase() as `0x${string}`,
      parseUnits("10", 18),
    ]
  ) as `0x${string}`,
  value: "0",
};

export const SEND_FROG_10_ENS_ACTION: TransferENSFromTreasuryAction = {
  type: "transfer-ens-from-treasury",
  receiver: "0x65a3870f48b5237f27f674ec42ea1e017e111d63",
  amount: "10",
};

export const SEND_FROG_10_ENS_TRANSACTION: TransferENSTransaction = {
  type: "transfer-ens",
  target: "0x323a76393544d5ecca80cd6ef2a560c6a395b7e3",
  receiver: "0x65a3870f48b5237f27f674ec42ea1e017e111d63",
  value: parseUnits("10", 18),
};
