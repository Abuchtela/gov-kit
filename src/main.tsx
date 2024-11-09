import React from "react";
import ReactDOM from "react-dom/client";
// import { GovKitProvider } from "gov-kit-react";
// import {
//   TransferENS,
//   OneTimePayment,
//   CustomTransaction,
// } from "gov-kit-react/actions";

import { GovKitProvider } from "../lib";
import { TransferENS, OneTimePayment, CustomTransaction } from "../lib/actions";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GovKitProvider
      config={{
        chainId: 1,
        etherscanApiKey: "123",
        actions: [TransferENS, OneTimePayment, CustomTransaction],
      }}
    >
      <App />
    </GovKitProvider>
  </React.StrictMode>
);
