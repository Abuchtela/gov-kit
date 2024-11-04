import { useFormContext } from "react-hook-form";

export const dataToAction = (data: any) => {
  return {
    type: data.type,
    currency: data.currency,
    amount: data.amount,
    target: data.receiverAddress,
  };
};

const OneTimePaymentForm = () => {
  const methods = useFormContext();
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col">
        <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
          Amount
        </label>
        <input
          type="number"
          {...methods.register("amount")}
          className="border p-1"
        />
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
        <input
          {...methods.register("receiverAddress")}
          className="border p-1"
        />
      </div>
    </div>
  );
};

export default OneTimePaymentForm;
