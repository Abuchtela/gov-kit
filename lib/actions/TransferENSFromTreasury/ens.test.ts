import { describe, it, expect } from "vitest";
import {
  TransferENSFromTreasuryActionHandler,
  TransferENSTransactionHandler,
} from "./";
import {
  SEND_FROG_10_ENS_TRANSACTION,
  SEND_FROG_10_ENS_RAW,
  SEND_FROG_10_ENS_ACTION,
} from "../../../tests/data";

describe("TransferENSTransactionHandler initialization", () => {
  it("should resolve raw ENS transfer action into readable transaction", () => {
    const transferTransaction = new TransferENSTransactionHandler(
      "raw",
      SEND_FROG_10_ENS_RAW
    );

    expect(transferTransaction.parsed).toEqual(
      expect.objectContaining({
        ...SEND_FROG_10_ENS_TRANSACTION,
      })
    );
  });

  it("should resolve ENS transfer action into raw transaction", () => {
    const transferTransaction = new TransferENSTransactionHandler(
      "parsed",
      SEND_FROG_10_ENS_TRANSACTION
    );

    expect(transferTransaction.raw).toEqual(
      expect.objectContaining({
        ...SEND_FROG_10_ENS_RAW,
      })
    );
  });
});

describe("TransferENSFromTreasuryActionHandler `resolve` method", () => {
  it("should resolve raw ENS transfer action into readable action", () => {
    const transferAction = new TransferENSFromTreasuryActionHandler(
      SEND_FROG_10_ENS_ACTION
    );

    const transactions = transferAction.resolve(SEND_FROG_10_ENS_ACTION);
    const parsed = transactions[0].parsed;

    expect(parsed).toEqual(
      expect.objectContaining({
        ...SEND_FROG_10_ENS_TRANSACTION,
      })
    );
  });
});
