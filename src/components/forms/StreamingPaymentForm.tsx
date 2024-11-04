import { useFormContext } from "react-hook-form";
import fetchPredictedStreamContractAddress from "../../../lib/hooks/useFetchPredictedStreamContractAddress";

export const dataToAction = async (data: any) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  const predictedStreamContractAddress =
    await fetchPredictedStreamContractAddress({
      receiverAddress: data.receiverAddress,
      currency: data.currency,
      amount: data.amount,
      startDate: start,
      endDate: end,
    });

  return {
    type: data.type,
    currency: data.currency,
    amount: data.amount,
    target: data.receiverAddress,
    startTimestamp: start.getTime(),
    endTimestamp: end.getTime(),
    predictedStreamContractAddress: predictedStreamContractAddress,
  };
};
const StreamingPaymentForm = () => {
  const methods = useFormContext();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col">
        <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
          Start date
        </label>
        <input
          type="date"
          {...methods.register("startDate")}
          className="border p-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
          End date
        </label>
        <input
          type="date"
          {...methods.register("endDate")}
          className="border p-1"
        />
      </div>
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
          <option value="weth">WETH</option>
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

export default StreamingPaymentForm;
