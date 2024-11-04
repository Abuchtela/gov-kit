import { useState } from "react";
import ActionDialog from "./components/example/ActionDialog";
import ActionList from "./components/ActionList";
import { Action } from "../lib/types";
import { resolveAction as resolveActionTransactions } from "../lib/transactions";
import { GovKitProvider } from "./components/GovKitProvider";

function App() {
  const [actions, setActions] = useState<Action[]>([]);

  const addAction = (action: Action) => {
    setActions((actions) => [...actions, action]);
  };

  const submit = () => {
    const transactions = actions.flatMap((a) =>
      resolveActionTransactions(a, { chainId: 1 })
    );
  };

  return (
    <GovKitProvider>
      <div className="h-screen w-screen bg-neutral-100 p-4">
        <h1 className="text-center">GovKit</h1>
        <section className="grid grid-cols-2 mt-4 gap-4">
          <div className="bg-white rounded p-4 border">
            <ActionDialog onSubmit={addAction} />
          </div>
          <div className="bg-white rounded p-4 border">
            <ActionList actions={actions} />
          </div>
        </section>
      </div>
    </GovKitProvider>
  );
}

export default App;
