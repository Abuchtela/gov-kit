import {
  Action,
  ReadableTransaction,
  RawTransaction,
  RawTransactions,
  ActionHandlerStatic,
} from "../types";

export class TransactionParser {
  private readonly chainId: number;
  private readonly globalActions: ActionHandlerStatic[];
  constructor(chainId: number, globalActions: ActionHandlerStatic[]) {
    this.chainId = chainId;
    this.globalActions = globalActions;
  }

  parse(transactions: RawTransactions) {
    const rawTransactions = transactions.targets.map((target, i) => ({
      target: target.toLowerCase() as `0x${string}`,
      signature: transactions.signatures[i],
      calldata: transactions.calldatas[i],
      value: BigInt(transactions.values[i]),
    }));

    const possibleTransactions = this.globalActions
      .map((action) => action.getTransactions())
      .flatMap((t) => t);

    return rawTransactions.map(({ target, signature, calldata, value }) => {
      const possibleTransaction = possibleTransactions.find(
        (t) =>
          !!t.parse(
            { target, signature, calldata, value },
            { chainId: this.chainId }
          )
      );

      // As long as CustomTransactionHandler exists in globalActions
      // it will always return a transaction...
      if (!possibleTransaction)
        throw new Error(
          "No transaction found, you likely need to include CustomTransactionHandler in your globalActions."
        );

      return possibleTransaction.parse(
        { target, signature, calldata, value },
        { chainId: this.chainId }
      );
    });
  }

  unparse(transactions: ReadableTransaction[]) {
    const possibleTransactions = this.globalActions
      .map((action) => action.getTransactions())
      .flatMap((t) => t);

    return transactions.reduce(
      (acc: RawTransactions, t: ReadableTransaction) => {
        const append = (t: RawTransaction) => ({
          targets: [...acc.targets, t.target],
          values: [...acc.values, t.value?.toString()],
          signatures: [...acc.signatures, t.signature],
          calldatas: [...acc.calldatas, t.calldata],
        });

        const possibleTransaction = possibleTransactions.find(
          (pt) => pt.type === t.type
        );

        if (!possibleTransaction) throw new Error("No transaction found");

        return append(
          possibleTransaction.unparse(t, { chainId: this.chainId })
        );
      },
      { targets: [], values: [], signatures: [], calldatas: [] }
    );
  }

  resolveAction(action: Action) {
    const actionConfig = this.globalActions.find(
      (ga) => ga.type === action.type
    );
    if (!actionConfig)
      throw new Error(
        `Action: ${action.type} not found in globalActions. Please make sure you have included the action in your globalActions, or in the ProviderConfig.`
      );
    const actionParserInstance = new actionConfig(action);
    return actionParserInstance.resolve(action);
  }

  buildActions(transactions: ReadableTransaction[]) {
    let transactionsLeft = [...transactions];
    let actions: Action[] = [];
    while (transactionsLeft.length > 0) {
      const [parsedActions, remainingTransactions] = this.globalActions.reduce(
        ([actionsFromReducer, remainingTransactionsFromReducer], action) => {
          const res = action.build(remainingTransactionsFromReducer);
          if (res != null) {
            actionsFromReducer.push(res.action);
            return [actionsFromReducer, res.remainingTransactions];
          }
          // might keep spinning if we don't narrow remainingTransactions if it returns null
          return [actionsFromReducer, remainingTransactionsFromReducer];
        },
        [[] as Action[], transactionsLeft]
      );

      transactionsLeft = remainingTransactions;
      actions = actions.concat(parsedActions);
    }

    return actions;
  }

  actionSummary(action: Action) {
    const actionConfig = this.globalActions.find(
      (ga) => ga.type === action.type
    );
    if (!actionConfig) throw new Error("No action config found");
    const actionParserInstance = new actionConfig(action);
    return actionParserInstance.summarize(action);
  }
}
