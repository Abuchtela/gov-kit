import {
  Action,
  ReadableTransaction,
  RawTransaction,
  RawTransactions,
  TypedActionConfig,
} from "../types";

class TransactionParser {
  private readonly chainId: number;
  private readonly globalActions: TypedActionConfig[];

  constructor(chainId: number, globalActions: TypedActionConfig[]) {
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
      const possibleTransaction = possibleTransactions.find((t) =>
        t.parse(
          { target, signature, calldata, value },
          { chainId: this.chainId }
        )
      );

      if (!possibleTransaction) throw new Error("No transaction found");
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
    if (!actionConfig) throw new Error("No action config found");
    // TODO: type this better
    return actionConfig.resolveAction(action as any);
  }

  buildActions(transactions: ReadableTransaction[]) {
    const getTransactionIndex = (t: ReadableTransaction) =>
      transactions.findIndex((t_) => t_ === t);

    let transactionsLeft = [...transactions];
    let actions: Action[] = [];
    while (transactionsLeft.length > 0) {
      const [parsedActions, remainingTransactions] = this.globalActions.reduce(
        ([actionsFromReducer, remainingTransactionsFromReducer], action) => {
          const res = action.buildAction(remainingTransactionsFromReducer);
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
    // return sortBy("firstTransactionIndex", actions);
  }

  //   actionSummary(action: Action) {
  //     return this.globalActions.find((ga) => ga.actionSummary(action));
  //   }
}

export default TransactionParser;
