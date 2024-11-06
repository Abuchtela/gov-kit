# GovKit
GovKit is a react toolkit for creating and parsing Bravo Governor flavored proposal transactions (target, value, calldata). It is unopinionated about styling, and offers forms for creating proposals in human readable form (i.e. without having to manually create calldata) as well as utils and components for parsing and displaying raw proposal data in human readable form.

### Actions
Actions are specific: think "Nouns one time transfer". While ReadableTransactions are generic: think "transfer". Many actions could map to the same ReadableTransaction.


### ReadableTransactions
Parses action into readable transaction type, which is useful for creating a human readable form, or rendering a human readable UI element showing the details of the transaction.

While a transfer ReadableTransaction might look like this:
```
{
  type: "transfer";
  target: `0x${string}`;
  value: bigint;
}
```

The action for the same transaction looks like this:
```
{
  type: "one-time-payment";
  currency: "eth" | "usdc";
  amount: string;
  target: `0x${string}`;
}
```

#### Requires:
- TransactionComment
-

### Utils

`parse`
I'm not sure we ever use parse tbh.

`unparse`
Takes a ReadableTransaction and unparses it into a RawTransaction.

`buildActions`
Similar to `parse` but parses `ReadableTransaction` into an `Action`
used when we have raw transaction data, but want to get it into an action form so we can best translate it into human readable form.

`resolveAction`
Takes an `Action` and parses it into a `ReadableTransaction`
`return parse(unparse(getParsedTransactions(), { chainId }), { chainId });`
getParsedTransaction(action) => ReadableTransaction (without functionName, functionInputs, etc)
=> unparse(ReadableTransaction (without functionName etc)) => RawTransaction
=> parse(RawTransaction) => ReadableTransaction

Kinda like...
1. Start with an Action
2. Turn action into ReadableTransaction, but doesn't include actual contract specifics
3. Unparse ReadableTransaction to get actual contract specifics
4. Repackage with parse to bring back to fully readable form

Action is one object, one collection of metadata to describe the singular action. Something like "stream a payment to this address". But sometimes, like streaming for example, these actions are actually made up of a few transactions. (Create stream, deposit WETH into treasury, stream weth). So, the action is parsed into an array of ReadableTransactions which are human readable, but more closely tied to the actual specifics of the transactions.


Flow of types goes
RawTransaction -> ReadableTransaction -> Action

### Common Uses

1. Create a form to collect metadata required to build an action
a. Form collections fields -> builds them into action object
b. collection Action objects to render in human readable form
(Actions are highest signal, because if we have the action we understand the intent of the group of transactions)
c. create transactions from actions
```
const transactions = actions.flatMap((a) =>
    resolveActionTransactions(a, { chainId: 1 })
);
```
d. Unparse transactions to get raw data to pass to a contract
```
const rawTransactions = unparse(transactions, { chainId: 1 });
```

2. Parse raw transaction details into human readable form (from indexer or elsewhere)
a. collection list of raw transactions
b. `const humanReadable = parse(rawTransactions[])`

3. Visualize transactions in human readable form, either as output while building form, or from raw data
a. Get data into ReadableTransaction type (with contract metadata, comes from `parse` or `resolveActions` which calls `parse`)
b. call `TransactionCodeBlock` or `TransactionExplanation`
c. Alternatively, get data into Action format, then call `ActionListItem`
What does `ActionListItem` do? ...


### Thanks
This work would not be possible without the foundation build by the team at Camp.
