import OneTimePaymentForm, {
  dataToAction as oneTimeDataToAction,
} from "./NounsOneTimePayment";
import StreamingPaymentForm, {
  dataToAction as streamDataToAction,
} from "./NounsStreamingPayment";
import CustomTransactionForm, {
  dataToAction as customDataToAction,
} from "./CustomTransaction";

enum ActionType {
  OneTimePayment = "one-time-payment",
  StreamingPayment = "streaming-payment",
  CustomTransaction = "custom-transaction",
}

const TransferAction = {
  type: ActionType.OneTimePayment,
  form: OneTimePaymentForm,
  toAction: oneTimeDataToAction,
};

const StreamAction = {
  type: ActionType.StreamingPayment,
  form: StreamingPaymentForm,
  toAction: streamDataToAction,
};

const CustomAction = {
  type: ActionType.CustomTransaction,
  form: CustomTransactionForm,
  toAction: customDataToAction,
};

export { TransferAction, StreamAction, CustomAction };
