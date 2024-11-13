import { describe, it, expect } from "vitest";
import { TransactionParser } from "../lib/utils/parser";
import {
  TransferENSFromTreasuryActionHandler,
  TransferENSTransactionHandler,
} from "../lib/actions/TransferENSFromTreasury";
import { CustomTransactionActionHandler } from "../lib/actions/CustomTransaction";
import {
  SEND_FROG_10_ENS_RAW,
  SEND_FROG_1_ETH_RAW,
  SEND_FROG_10_ENS_ACTION,
  SEND_FROG_10_ENS_TRANSACTION,
} from "./data";
import { parseUnits } from "viem";

describe("TransactionParser `parse` method", () => {
  it("should parse an ENS transfer", () => {
    const parser = new TransactionParser(1, [
      TransferENSFromTreasuryActionHandler,
    ]);
    const result = parser.parse({
      targets: [SEND_FROG_10_ENS_RAW.target],
      values: [SEND_FROG_10_ENS_RAW.value],
      signatures: [SEND_FROG_10_ENS_RAW.signature],
      calldatas: [SEND_FROG_10_ENS_RAW.calldata],
    });

    expect(result[0]).toEqual(
      expect.objectContaining({
        functionName: "transfer",
        receiver: "0x65a3870f48b5237f27f674ec42ea1e017e111d63",
        target: "0x323a76393544d5ecca80cd6ef2a560c6a395b7e3",
        type: TransferENSTransactionHandler.type,
        value: parseUnits("10", 18),
      })
    );
  });

  it("should return a custom transaction readable transaction if no handler is found", () => {
    const parser = new TransactionParser(1, [
      TransferENSFromTreasuryActionHandler,
      CustomTransactionActionHandler,
    ]);

    const result = parser.parse(SEND_FROG_1_ETH_RAW);

    expect(result[0]).toEqual(
      expect.objectContaining({
        target: "0x65a3870f48b5237f27f674ec42ea1e017e111d63",
        type: "payable-function-call",
        value: 1000000000000000000n,
      })
    );
  });
});

describe("TransactionParser `unparse` method", () => {
  it("should unparse an an ENS transfer", () => {
    const parser = new TransactionParser(1, [
      TransferENSFromTreasuryActionHandler,
      CustomTransactionActionHandler,
    ]);

    const result = parser.unparse([SEND_FROG_10_ENS_TRANSACTION]);
    expect(result).toEqual({
      targets: [SEND_FROG_10_ENS_RAW.target],
      values: [SEND_FROG_10_ENS_RAW.value],
      signatures: [SEND_FROG_10_ENS_RAW.signature],
      calldatas: [SEND_FROG_10_ENS_RAW.calldata],
    });
  });
});

describe("TransactionParser `resolveAction` method", () => {
  it("should resolve ENS transfer action into readable transactions", () => {
    const parser = new TransactionParser(1, [
      TransferENSFromTreasuryActionHandler,
      CustomTransactionActionHandler,
    ]);

    const result = parser.resolveAction(SEND_FROG_10_ENS_ACTION);
    expect(result[0].parsed).toEqual(SEND_FROG_10_ENS_TRANSACTION);
  });
});

describe("TransactionParser `buildActions` method", () => {
  it("should build actions from list of ENS transfer readable transactions", () => {
    const parser = new TransactionParser(1, [
      TransferENSFromTreasuryActionHandler,
      CustomTransactionActionHandler,
    ]);

    const result = parser.buildActions([SEND_FROG_10_ENS_TRANSACTION]);
    expect(result).toEqual([SEND_FROG_10_ENS_ACTION]);
  });
});

// TODO
describe("TransactionParser `actionSummary` method", () => {
  it("should summarize action", () => {
    const parser = new TransactionParser(1, [
      TransferENSFromTreasuryActionHandler,
      CustomTransactionActionHandler,
    ]);

    const result = parser.actionSummary(SEND_FROG_10_ENS_ACTION);
    const text = result.props.children
      .map((child: any) =>
        typeof child === "string" ? child : child.props?.children
      )
      .join("");

    expect(text).toContain("Transfer");
    expect(text).toContain("10");
    expect(text).toContain("ENS");
    expect(text).toContain("0x65a3870f48b5237f27f674ec42ea1e017e111d63");
  });
});

//   it("should parse multiple transactions", () => {
//     const parser = new TransactionParser(1, [OneTimePaymentActionConfig]);
//     const rawTransactions: RawTransactions = {
//       targets: [
//         ...SEND_FROG_1_ETH_RAW.targets,
//         ...SEND_FROG_1_USDC_RAW.targets,
//       ],
//       signatures: [
//         ...SEND_FROG_1_ETH_RAW.signatures,
//         ...SEND_FROG_1_USDC_RAW.signatures,
//       ],
//       calldatas: [
//         ...SEND_FROG_1_ETH_RAW.calldatas,
//         ...SEND_FROG_1_USDC_RAW.calldatas,
//       ],
//       values: [...SEND_FROG_1_ETH_RAW.values, ...SEND_FROG_1_USDC_RAW.values],
//     };
//     const result = parser.parse(rawTransactions);
//     console.log(result);
//   });
