import { forwardRef } from "react";

const DefaultTextInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type="text"
      className="border p-2 rounded-lg w-full mb-4"
    />
  );
});

DefaultTextInput.displayName = "DefaultTextInput";

const DefaultNumberInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type="number"
      className="border p-2 rounded-lg w-full mb-4"
    />
  );
});

DefaultNumberInput.displayName = "DefaultNumberInput";

const DefaultAddressInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type="text"
      className="border p-2 rounded-lg w-full mb-4"
    />
  );
});

DefaultAddressInput.displayName = "DefaultAddressInput";

export { DefaultTextInput, DefaultNumberInput, DefaultAddressInput };
