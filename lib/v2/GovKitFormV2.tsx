import {
  useForm,
  FormProvider,
  SubmitHandler,
  useFormContext,
} from "react-hook-form";
import { useGovKitContext } from "./GovKitProviderV2";

export const GovKitForm = ({
  onSubmit,
  children,
}: {
  onSubmit: (action: any) => void;
  children: React.ReactElement | React.ReactElement[];
}) => {
  const methods = useForm<any>();
  const { handleSubmit } = methods;

  const onFormSubmit: SubmitHandler<any> = async (data) => {
    // maybe we have some sort of validation step using zod, built into the action?
    let action = data;
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
  const { actions, TextInput, NumberInput, AddressInput, Select } =
    useGovKitContext();
  const methods = useFormContext();
  const type = methods.watch("type");
  const actionTypes = actions.map((action) => action.type);

  const renderFormForType = (type: string) => {
    for (const actionConfig of actions) {
      if (type === actionConfig.type) {
        const formValues = actionConfig.getFormValues();
        return (
          <div className="flex flex-col space-y-4">
            {formValues.map((value) => (
              <div className="flex flex-col" key={value.key}>
                <label className="text-sm font-bold text-neutral-500 mb-1 ml-1">
                  {value.label}
                </label>
                {value.type === "text" ? (
                  <TextInput {...methods.register(value.key)} />
                ) : value.type === "number" ? (
                  <NumberInput {...methods.register(value.key)} />
                ) : value.type === "address" ? (
                  <AddressInput {...methods.register(value.key)} />
                ) : value.type === "select" && value.options ? (
                  <Select
                    {...methods.register(value.key)}
                    options={value.options}
                  />
                ) : null}
              </div>
            ))}
          </div>
        );
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
