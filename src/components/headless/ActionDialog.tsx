import {
  useForm,
  FormProvider,
  SubmitHandler,
  useFormContext,
} from "react-hook-form";
import { TransferAction, StreamAction, CustomAction } from "../../config";

// ideally this will come from context provider
const ACTIONS = [TransferAction, StreamAction, CustomAction];

/**
 * Action types are the top level actions you can select from the UI.
 * Selecting an action will render a form that will help build a transaction.
 */
const actionTypes = [
  "one-time-payment",
  "streaming-payment",
  "custom-transaction",
];

export const ActionDialog = ({
  onSubmit,
  children,
}: {
  onSubmit: (action: any) => void;
  children: React.ReactElement | React.ReactElement[];
}) => {
  const methods = useForm<any>();
  const { handleSubmit } = methods;

  const onFormSubmit: SubmitHandler<any> = async (data) => {
    let action;
    for (const actionType of ACTIONS) {
      if (data.type === actionType.type) {
        action = await actionType.toAction(data);
      }
    }
    onSubmit(action);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)}>{children}</form>
    </FormProvider>
  );
};

/*
onChange --
- set default values for the given type
- clear out the old values for the other types
- I don't think this matters a whole lot
 */
const TypeSelect = ({ className }: { className?: string }) => {
  const { register } = useFormContext();
  return (
    <select className={className} {...register("type")}>
      {actionTypes.map((actionType) => (
        <option key={actionType} value={actionType}>
          {actionType}
        </option>
      ))}
    </select>
  );
};

const FormBody = () => {
  const { watch } = useFormContext();
  const type = watch("type");

  const renderFormForType = (type: string) => {
    for (const actionType of ACTIONS) {
      if (type === actionType.type) {
        const Form = actionType.form;
        return <Form />;
      }
    }
  };

  return <>{renderFormForType(type || actionTypes[0])}</>;
};

const Button = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactElement | React.ReactElement[] | string;
}) => {
  return (
    <button className={className} type="submit">
      {children}
    </button>
  );
};

ActionDialog.TypeSelect = TypeSelect;
ActionDialog.FormBody = FormBody;
ActionDialog.Button = Button;
