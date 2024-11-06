import { parseUnits } from "viem";
import { resolveIdentifier as getContractWithIdentifier } from "../../../../utils/contracts";
import { publicClient } from "../../../../viem";

const decimalsByCurrency = {
  eth: 18,
  weth: 18,
  usdc: 6,
};

const parseAmount = (
  amount: bigint,
  currency: keyof typeof decimalsByCurrency
) => {
  switch (currency.toLowerCase()) {
    case "eth":
    case "weth":
    case "usdc":
      return parseUnits(amount.toString(), decimalsByCurrency[currency]);
    default:
      throw new Error();
  }
};

const fetchPredictedStreamContractAddress = ({
  amount: amount_,
  currency,
  receiverAddress,
  startDate,
  endDate,
}: {
  amount: bigint;
  currency: "eth" | "weth" | "usdc";
  receiverAddress: `0x${string}`;
  startDate: Date;
  endDate: Date;
}) => {
  const chainId = 1;

  const executorContract = getContractWithIdentifier(chainId, "executor");
  const streamFactoryContract = getContractWithIdentifier(
    chainId,
    "stream-factory"
  );
  const paymentTokenContract = getContractWithIdentifier(
    chainId,
    `${currency}-token`
  );

  let amount = BigInt(0);
  try {
    amount = BigInt(amount_);
  } catch (e) {
    //
  }

  return publicClient.readContract({
    address: streamFactoryContract.address,
    abi: [
      {
        name: "predictStreamAddress",
        type: "function",
        stateMutability: "view",
        inputs: [
          { type: "address" },
          { type: "address" },
          { type: "address" },
          { type: "uint256" },
          { type: "address" },
          { type: "uint256" },
          { type: "uint256" },
        ],
        outputs: [{ type: "address" }],
      },
    ],
    functionName: "predictStreamAddress",
    args: [
      executorContract.address,
      executorContract.address,
      receiverAddress,
      parseAmount(amount, currency),
      paymentTokenContract.address,
      BigInt((startDate?.getTime() ?? 0) / 1000),
      BigInt((endDate?.getTime() ?? 0) / 1000),
    ],
  });
};

export default fetchPredictedStreamContractAddress;
