export const fetchEtherscanContractInfo = (address: `0x${string}`) =>
  fetch(`/api/contract-info?address=${address}`).then(async (res) => {
    if (!res.ok) {
      try {
        const body = await res.json();
        return Promise.reject(new Error(body.code ?? "unknown-error"));
      } catch (e) {
        return Promise.reject(new Error("unknown-error"));
      }
    }
    const body = await res.json();
    return body.data;
  });
