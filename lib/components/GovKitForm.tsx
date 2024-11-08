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
  const { actions } = useGovKitContext();
  const methods = useForm<any>();
  const { handleSubmit } = methods;
  const type = methods.watch("type");

  const onFormSubmit: SubmitHandler<any> = async (data) => {
    const actionConfig = actions.find((a) => a.type === type);
    if (!actionConfig) {
      throw new Error(`No action config found for type ${type}`);
    }

    const action = actionConfig.formdataToAction(data);
    onSubmit(action);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)}>{children}</form>
    </FormProvider>
  );
};

const TypeSelect = ({ className }: { className?: string }) => {
  const { register } = useFormContext();
  const { actions } = useGovKitContext();
  const actionTypes = actions.map((action) => action.type);

  return (
    <div>
      <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
        Action Type
      </label>
      <select {...register("type")} className={className}>
        {actionTypes.map((actionType) => (
          <option key={actionType} value={actionType}>
            {actionType}
          </option>
        ))}
      </select>
    </div>
  );
};

const FormBody = ({ className }: { className?: string }) => {
  const { actions } = useGovKitContext();
  const methods = useFormContext();
  const type = methods.watch("type");
  const actionTypes = actions.map((action) => action.type);

  const renderFormForType = (type: string) => {
    for (const actionConfig of actions) {
      if (type === actionConfig.type) {
        const Form = actionConfig.form;
        if (!Form) {
          throw new Error(`No form found for type ${type}`);
        }
        return <Form />;
      }
    }
  };

  return (
    <div className={className}>{renderFormForType(type || actionTypes[0])}</div>
  );
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
