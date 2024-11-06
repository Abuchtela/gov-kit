import { useFormContext } from "react-hook-form";
import { useGovKitContext } from "../../GovKitProvider";

type NounsOneTimePaymentAction = {
  type: string;
  currency: string;
  amount: bigint;
  target: `0x${string}`;
};

export const dataToAction = (data: any): NounsOneTimePaymentAction => {
  return {
    type: data.type,
    currency: data.currency,
    amount: data.amount,
    target: data.receiverAddress,
  };
};

const OneTimePaymentForm = () => {
  const methods = useFormContext();
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
          Currency
        </label>
        <select {...methods.register("currency")} className="border p-1">
          <option value="eth">ETH</option>
          <option value="usdc">USDC</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
          Reciever
        </label>
        <AddressInput {...methods.register("receiverAddress")} />
      </div>
    </div>
  );
};

export default OneTimePaymentForm;
