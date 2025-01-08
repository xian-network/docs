# Events

LogEvents are used to track & index when your smart contract performs an operation.

Emitted events are automatically recorded & indexed by the `Blockchain Data Service Node (BDS)` & queryable via the [GraphQL API](../node/interfaces/graphql).

# Use-cases

In many situations in your app, you will want to track when something happens in your smart contract.

Here are some example situations when you may want to emit an event from your contract :

- When a swap occurs on a DEX.
- When an NFT is minted.
- When a transfer is received by a specific account.
- When a transfer is sent from a specific account.
- When an account approves tokens to be used by a smart contract. 

# Usage

### Smart Contract

```python
"""
Declare the event at the top of the contract code.
"""

TransferEvent = LogEvent(
    event="Transfer",
    params={
        "from": {'type': str, 'idx': True},
        "to": {'type': str, 'idx': True},
        "amount": {'type': (int, float, decimal)}
    }
)

"""
At the end of the function in the operation you want to track,
call the event.
"""

@export
def transfer(amount: float, to: str):
    ...
    balances[ctx.caller] -= amount
    balances[to] += amount

    TransferEvent({
        "from": ctx.caller,
        "to": to,
        "amount": amount
    })
```

For info on how to query events, see the [GraphQL](../node/interfaces/graphql) docs.