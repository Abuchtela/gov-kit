import { useFormContext } from "react-hook-form";
import { useGovKitContext } from "../../components/GovKitProvider";
import { TransferENSFromTreasuryAction } from "./types";

export const dataToAction = (data: any) => {
  return {
    type: "transfer-ens-from-treasury" as const,
    receiver: data.receiver,
    amount: data.amount,
  };
};

const TransferENSFromTreasuryForm = () => {
  const methods = useFormContext<TransferENSFromTreasuryAction>();
  const { NumberInput, AddressInput } = useGovKitContext();
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col">
        <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
          Amount
        </label>
        <NumberInput {...methods.register("amount")} />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
          Reciever
        </label>
        <AddressInput {...methods.register("receiver")} />
      </div>
    </div>
  );
};

export default TransferENSFromTreasuryForm;
