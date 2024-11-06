import {
  useForm,
  FormProvider,
  SubmitHandler,
  useFormContext,
} from "react-hook-form";
import { useGovKitContext } from "./GovKitProvider";

export const GovKitForm = ({
  onSubmit,
  children,
}: {
  onSubmit: (action: any) => void;
  children: React.ReactElement | React.ReactElement[];
}) => {
  const methods = useForm<any>();
  const { handleSubmit } = methods;
  const { actions } = useGovKitContext();

  const onFormSubmit: SubmitHandler<any> = async (data) => {
    let action;
    for (const actionType of actions) {
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
  const { actions } = useGovKitContext();
  const actionTypes = actions.map((action) => action.type);

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
  const { actions } = useGovKitContext();
  const { watch } = useFormContext();
  const type = watch("type");
  const actionTypes = actions.map((action) => action.type);

  const renderFormForType = (type: string) => {
    for (const actionType of actions) {
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

GovKitForm.TypeSelect = TypeSelect;
GovKitForm.FormBody = FormBody;
GovKitForm.Button = Button;
