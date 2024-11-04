import { ActionDialog as HeadlessActionDialog } from "../headless/ActionDialog";

const ActionDialog = ({ onSubmit }: { onSubmit: (action: any) => void }) => {
  return (
    <HeadlessActionDialog onSubmit={onSubmit}>
      <HeadlessActionDialog.TypeSelect className="border p-2" />
      <HeadlessActionDialog.FormBody />
      <HeadlessActionDialog.Button className="bg-blue-500 text-white rounded w-full py-1">
        Submit
      </HeadlessActionDialog.Button>
    </HeadlessActionDialog>
  );
};

export default ActionDialog;
