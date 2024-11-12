import { useState } from "react";
// import { GovKitForm, ActionListItem, useGovKitContext } from "gov-kit-react";
import { GovKitForm, ActionListItem, useGovKitContext } from "../lib";

const exampleRawTransaction = {
  targets: ["0x323A76393544d5ecca80cd6ef2A560C6a395b7E3"] as `0x${string}`[],
  values: ["0"],
  signatures: ["transfer(address,uint256)"],
  calldatas: [
    "0x00000000000000000000000065a3870f48b5237f27f674ec42ea1e017e111d630000000000000000000000000000000000000000000000008ac7230489e80000",
  ] as `0x${string}`[],
};

const EditableAction = ({
  index,
  action,
  onUpdate,
}: {
  index: number;
  action: any;
  onUpdate: (action: any) => void;
}) => {
  const [editing, setEditing] = useState(false);

  const onSubmit = (updatedAction: any) => {
    onUpdate({ ...updatedAction, id: action.id });
    setEditing(false);
  };

  return (
    <div className="flex flex-col justify-between p-4 border rounded">
      <div className="flex justify-between items-center">
        <span>Action {index + 1}</span>
        <button
          className="self-start text-sm bg-gray-200 border border-gray-300 rounded-md px-1 py-0.5 ml-2"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="w-full mt-4">
        {editing ? (
          <GovKitForm onSubmit={onSubmit} initialValues={action}>
            <div className="flex flex-col mb-4">
              <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
                Type
              </label>
              <GovKitForm.TypeSelect className="border rounded p-2" />
            </div>
            <GovKitForm.FormBody />
            <GovKitForm.Button>Save</GovKitForm.Button>
          </GovKitForm>
        ) : (
          <ActionListItem action={action} />
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [actions, setActions] = useState<any[]>([]);
  const [showNewForm, setShowNewForm] = useState(true);
  const { parser } = useGovKitContext();

  const onSubmit = (action: any) => {
    const newAction = { ...action, id: Date.now() };
    setActions([...actions, newAction]);
    setShowNewForm(false);
  };

  const onUpdateAction = (updatedAction: any) => {
    setActions(
      actions.map((action) =>
        action.id === updatedAction.id ? updatedAction : action
      )
    );
  };

  return (
    <main className="h-screen w-full grid grid-cols-2">
      <div className="flex flex-col justify-center items-center border-r border-gray-200">
        <div className="w-[600px] border rounded-lg bg-white">
          <div className="bg-gray-100 p-4">Actions</div>
          <div className="max-h-[600px] overflow-y-auto">
            {actions.length > 0 && (
              <div className="p-4 space-y-4">
                {actions.map((action, idx) => (
                  <EditableAction
                    index={idx}
                    key={action.id}
                    action={action}
                    onUpdate={onUpdateAction}
                  />
                ))}
              </div>
            )}

            {showNewForm && (
              <div className="p-4">
                <div className="flex flex-col justify-between border rounded p-4 w-full">
                  <div className="flex justify-between items-center mb-4">
                    <span>Action {actions.length + 1}</span>
                    <button
                      className="self-start text-sm bg-gray-200 border border-gray-300 rounded-md px-1 py-0.5 ml-2"
                      onClick={() => setShowNewForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                  <GovKitForm onSubmit={onSubmit}>
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
                        Type
                      </label>
                      <GovKitForm.TypeSelect className="border p-2 rounded w-full mb-4" />
                    </div>
                    <GovKitForm.FormBody className="w-full flex flex-col" />
                    <GovKitForm.Button>Submit</GovKitForm.Button>
                  </GovKitForm>
                </div>
              </div>
            )}

            {!showNewForm && (
              <div className="p-4">
                <button
                  onClick={() => setShowNewForm(true)}
                  className="w-full bg-blue-500 text-white py-1 px-2 rounded-md"
                >
                  New action
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          className="w-[600px] bg-blue-500 text-white py-1 px-2 rounded-md mt-4"
          onClick={() => {
            const transactions = parser.resolveAction(actions[0]);
            const parsed = parser.unparse(transactions.map((t) => t.parsed));
            console.log(parsed);
          }}
        >
          Parse
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-[600px] border rounded-lg bg-white">
          <div className="bg-gray-100 p-4">Parsed transactions</div>
          <pre className="p-4 text-mono text-sm overflow-x-auto">
            {JSON.stringify(exampleRawTransaction, null, 2)}
          </pre>
        </div>
        <button
          className="bg-blue-500 text-white py-1 px-2 rounded-md mt-4 w-[600px]"
          onClick={() => {
            console.log(parser.parse(exampleRawTransaction));
          }}
        >
          Resolve
        </button>
      </div>
    </main>
  );
};

export default App;
