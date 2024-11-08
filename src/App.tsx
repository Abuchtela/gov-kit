import { useState } from "react";
import { GovKitProvider, GovKitForm, ActionListItem } from "gov-kit-react";
import {
  TransferENS,
  OneTimePayment,
  CustomTransaction,
} from "gov-kit-react/actions";

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
    <div>
      <GovKitProvider
        config={{
          etherscanApiKey: "123",
          actions: [TransferENS, OneTimePayment, CustomTransaction],
        }}
      >
        <main className="flex justify-center items-center h-screen w-full">
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
                <div className="px-4 pb-4">
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
        </main>
      </GovKitProvider>
    </div>
  );
};

export default App;
