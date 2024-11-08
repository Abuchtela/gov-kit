import { describe, it, expect } from "vitest";
import { encodeAbiParameters } from "viem";
import TransactionParser from "../lib/utils/parser";
import { OneTimePaymentActionConfig } from "../lib/actions/NounsOneTimePayment";
import { RawTransactions } from "../lib/types";

const SEND_FROG_1_ETH_RAW = {
  targets: ["0x65A3870F48B5237f27f674Ec42eA1E017E111D63"] as `0x${string}`[],
  signatures: [""] as string[],
  calldatas: ["0x"] as `0x${string}`[],
  values: ["1000000000000000000"],
};

const SEND_FROG_1_USDC_RAW = {
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

describe("TransactionParser", () => {
  it("should parse a simple ETH transfer", () => {
    const parser = new TransactionParser(1, [OneTimePaymentActionConfig]);
    const result = parser.parse(SEND_FROG_1_ETH_RAW);

    expect(result[0]).toEqual({
      type: "transfer",
      target: "0x65a3870f48b5237f27f674ec42ea1e017e111d63",
      value: 1000000000000000000n,
    });
  });

  it("should parse a USDC transfer for nouns", () => {
    const parser = new TransactionParser(1, [OneTimePaymentActionConfig]);
    const result = parser.parse(SEND_FROG_1_USDC_RAW);
    console.log(result);

    expect(result[0]).toEqual(
      expect.objectContaining({
        functionName: "sendOrRegisterDebt",
        receiverAddress: "0x65a3870f48b5237f27f674ec42ea1e017e111d63",
        target: "0xd97bcd9f47cee35c0a9ec1dc40c1269afc9e8e1d",
        type: "usdc-transfer-via-payer",
        usdcAmount: 1000n,
      })
    );
  });

  it("should parse multiple transactions", () => {
    const parser = new TransactionParser(1, [OneTimePaymentActionConfig]);
    const rawTransactions: RawTransactions = {
      targets: [
        ...SEND_FROG_1_ETH_RAW.targets,
        ...SEND_FROG_1_USDC_RAW.targets,
      ],
      signatures: [
        ...SEND_FROG_1_ETH_RAW.signatures,
        ...SEND_FROG_1_USDC_RAW.signatures,
      ],
      calldatas: [
        ...SEND_FROG_1_ETH_RAW.calldatas,
        ...SEND_FROG_1_USDC_RAW.calldatas,
      ],
      values: [...SEND_FROG_1_ETH_RAW.values, ...SEND_FROG_1_USDC_RAW.values],
    };
    const result = parser.parse(rawTransactions);
    console.log(result);
  });

  it("should unparse a transfer", () => {
    const parser = new TransactionParser(1, [OneTimePaymentActionConfig]);
    const result = parser.unparse([
      {
        type: "transfer",
        target: "0x65A3870F48B5237f27f674Ec42eA1E017E111D63",
        value: 1000000000000000000n,
      },
    ]);

    expect(result).toEqual(SEND_FROG_1_ETH_RAW);
  });

  it("should resolve actions", () => {
    const parser = new TransactionParser(1, [OneTimePaymentActionConfig]);
    const result = parser.resolveAction({
      type: "one-time-payment",
      target: "0x65A3870F48B5237f27f674Ec42eA1E017E111D63",
      currency: "eth",
      amount: "1000",
    });
  });

  it("should build actions", () => {
    const parser = new TransactionParser(1, [OneTimePaymentActionConfig]);
    const result = parser.buildActions([
      {
        type: "transfer",
        target: "0x65A3870F48B5237f27f674Ec42eA1E017E111D63",
        value: 1000000000000000000n,
      },
    ]);
  });
});
