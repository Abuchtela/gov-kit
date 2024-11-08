import { BaseAction, BaseReadableTransaction } from "../../types";

export interface TransferENSFromTreasuryAction extends BaseAction {
  type: "transfer-ens-from-treasury";
  receiver: `0x${string}`;
  amount: string;
}

export interface TransferENSTransaction extends BaseReadableTransaction {
  type: "transfer-ens";
  target: `0x${string}`;
  receiver: `0x${string}`;
  value: bigint;
}
