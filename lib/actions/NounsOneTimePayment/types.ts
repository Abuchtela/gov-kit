import { BaseAction, BaseReadableTransaction } from "../../types";

export interface OneTimePaymentAction extends BaseAction {
  type: "one-time-payment";
  currency: "eth" | "usdc";
  amount: string;
  target: `0x${string}`;
}

export interface TransferTransaction extends BaseReadableTransaction {
  type: "transfer";
  target: `0x${string}`;
  value: bigint;
}

export interface UsdcTransferViaPayerTransaction
  extends BaseReadableTransaction {
  type: "usdc-transfer-via-payer";
  receiverAddress: `0x${string}`;
  usdcAmount: bigint;
  target: `0x${string}`;
}
