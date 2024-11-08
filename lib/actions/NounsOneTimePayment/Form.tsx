import { useFormContext } from "react-hook-form";
import { useGovKitContext } from "../../components/GovKitProvider";
import { OneTimePaymentAction } from "./types";

export const dataToAction = (data: any) => {
  return {
    type: "one-time-payment" as const,
    currency: data.currency,
    amount: data.amount,
    target: data.target,
  };
};

const OneTimePaymentForm = () => {
  const methods = useFormContext<OneTimePaymentAction>();
  const { NumberInput, AddressInput, Select } = useGovKitContext();
  return (
    <div className="flex flex-col gap-4">
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
        <Select
          {...methods.register("currency")}
          options={[
            { value: "eth", label: "ETH" },
            { value: "usdc", label: "USDC" },
          ]}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
          Reciever
        </label>
        <AddressInput {...methods.register("target")} />
      </div>
    </div>
  );
};

export default OneTimePaymentForm;
