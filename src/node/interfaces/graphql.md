# GraphQL

## Overview

The `Blockchain Data Service (BDS)` indexes all transaction data, state & history in a Postgres DB which can be queried with using the `GraphQL` interface.

## Graphiql Query Builder

You can access the query builder @

testnet : https://testnet.xian.org/graphiql

mainnet : https://node.xian.org/graphiql


## Example Queries

### Querying State

In this example we query the balance of the address `e9e8aad29ce8e94fd77d9c55582e5e0c57cf81c552ba61c0d4e34b0dc11fd931`

**Query :**

```graphql
query QueryState {
  allStates(condition: {key: "currency.balances:some_address"}) {
    edges {
      node {
        key
        value
      }
    }
  }
}
```

**Response : **

```json
{
  "data": {
    "allStates": {
      "edges": [
        {
          "node": {
            "key": "currency.balances:some_address",
            "value": "991631.066314054990895930799999999998"
          }
        }
      ]
    }
  }
}
```

## Querying Events

In this example we want to get all events where any token is sent to address `1565ff3ef4e54a73e5782f5c1c30c7106142370f90495ef3bb6dd6c2e17dc158` 

**Query :**

```graphql
query TransferEventQuery {
  allEvents(
    filter: {dataIndexed: {contains: {to: "1565ff3ef4e54a73e5782f5c1c30c7106142370f90495ef3bb6dd6c2e17dc158"}}}
    condition: {event: "Transfer"}
  ) {
    edges {
      node {
        id
        dataIndexed
        data
        contract
        event
        txHash
      }
    }
  }
}
```

**Response : **

```json
{
  "data": {
    "allEvents": {
      "edges": [
        {
          "node": {
            "dataIndexed": {
              "to": "1565ff3ef4e54a73e5782f5c1c30c7106142370f90495ef3bb6dd6c2e17dc158",
              "from": "e9e8aad29ce8e94fd77d9c55582e5e0c57cf81c552ba61c0d4e34b0dc11fd931"
            },
            "data": {
              "amount": "1000"
            },
            "contract": "con_logevent_test_token",
            "event": "Transfer",
            "txHash": "8B876509D632C8308D67BAD7A99C206FCE5103FF5EF03BA782DCCE920085D370"
          }
        }
      ]
    }
  }
}
```

## Javascript Example (Browser)

```tsx
const endpoint = 'https://testnet.xian.org/graphql';
// mainnet : 'https://node.xian.org/graphql

const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
});

const json = await response.json();
```

## Javascript Example (Node)

```tsx
// If using older Node versions, first:
// import fetch from 'node-fetch';

const endpoint = 'https://testnet.xian.org/graphql';
// mainnet : 'https://node.xian.org/graphql

const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
});

const json = await response.json();
```

## Python Example

```python
import requests

endpoint = 'https://testnet.xian.org/graphql';
# mainnet : 'https://node.xian.org/graphql

response = requests.post(
    endpoint,
    json={"query": query},
    headers={"Content-Type": "application/json"}
)
json_data = response.json()
```