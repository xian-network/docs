---
title: Interfaces
description: CometBFT offers the following events to which you can subscribe
---

# REST API

### 1. Transactions
#### Broadcast Transaction
Broadcasts a signed transaction to the network.

##### Request
- Method: GET
- URL: `/broadcast_tx_sync`
- Query Parameters:
  - `tx`: The transaction to broadcast (hex-encoded JSON string)

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The result of the broadcast
    - `code`: The result code (0 if successfully passed CheckTx)
    - `data`: Hex-encoded JSON string with CheckTx information
    - `hash`: The transaction hash
    - `log`: The transaction log
    - `codespace`: The transaction codespace

#### Get Transaction
Retrieves a transaction by its hash.

##### Request
- Method: GET
- URL: `/tx`
- Query Parameters:
  - `hash`: The transaction hash (prepend with `0x`)
  - `prove`: Whether to include a proof of the transaction (default: false)

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The transaction data
    - `hash`: The transaction hash
    - `height`: The block height
    - `index`: The transaction index
    - `tx_result`: The transaction result
      - `code`: The transaction result code
      - `data`: Hex-encoded JSON string with transaction data
      - `log`: The transaction log
      - `codespace`: The transaction codespace
    - `tx`: The transaction data
    - `proof`: The transaction proof
    - `proof_height`: The proof height

### 2. Wallets
#### Get Next Nonce
Retrieves the next nonce for a given address.

##### Request
- Method: GET
- URL: `/abci_query?path="/get_next_nonce/<address>"`

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The query result
    - `response`: The response data
      - `value`: Hex-encoded nonce

### 3. Get Values from State
#### Query State
Queries the data at a given path in the state store

##### Request
- Method: GET
- URL: `/abci_query?path="/get/<contract>.<hash>:<key>"`
- Alternate URL: `/abci_query?path="/get/<contract>.<variable>"`

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The query result
    - `response`: The response data
      - `value`: Hex-encoded value

#### Keys in a Hash
Retrieves the keys in a given hash

##### Request
- Method: GET
- URL: `/abci_query?path="/keys/<contract>.<hash>"`

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The query result
    - `response`: The response data
      - `value`: Hex-encoded JSON string with keys

#### Deployed Contracts
Retrieves the deployed contracts

##### Request
- Method: GET
- URL: `/abci_query?path="/contracts"`

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The query result
    - `response`: The response data
      - `value`: Hex-encoded JSON string with list of contracts

#### Contract Code
Retrieves the code for a given contract

##### Request
- Method: GET
- URL: `/abci_query?path="/contract/<contract>"`

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The query result
    - `response`: The response data
      - `value`: Hex-encoded code

#### Contract Methods
Retrieves the methods for a given contract

##### Request
- Method: GET
- URL: `/abci_query?path="/contract_methods/<contract>"`

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The query result
    - `response`: The response data
      - `value`: Hex-encoded JSON string with method data

### 4. Services
#### Estimate Stamps
Estimates the number of stamps required for a given transaction

##### Request
- Method: GET
- URL: `/abci_query?path="/estimate_stamps/<hex-encoded-signed-transaction>"`

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The query result
    - `response`: The response data
      - `value`: Hex-encoded JSON string with stamp estimate and tx result

#### Lint Code
Lints the code for a given contract

##### Request
- Method: GET
- URL: `/abci_query?path="/lint/<base64-encoded-urlsafe-code>"`

##### Response
- Content-Type: application/json
- Body: JSON object with the following fields:
  - `jsonrpc`: The JSON-RPC version
  - `id`: The request ID
  - `result`: The query result
    - `response`: The response data
      - `value`: Hex-encoded JSON string with lint result



# Subscribe to Events

CometBFT offers the following events to which you can subscribe via Websockets
```
EventNewBlock            = "NewBlock"
EventNewBlockHeader      = "NewBlockHeader"
EventNewBlockEvents      = "NewBlockEvents"
EventNewEvidence         = "NewEvidence"
EventTx                  = "Tx"
EventValidatorSetUpdates = "ValidatorSetUpdates"
```

The following example shows how to subsribe to them

Install dependency
```
pip install websockets
```

```python
import websockets
import asyncio
import json
import gc


class Event:
    def __init__(self, cfg):
        self.cfg = cfg

    async def init(self):
        asyncio.create_task(self.websocket_loop())

    async def websocket_loop(self):
        base_wait_time = self.cfg.get('base_wait_time', 1)
        max_retries = self.cfg.get('max_retries', 5)
        retry_attempts = 0

        while True:
            try:
                print(f'Initiating websocket connection...')
                uri = self.cfg.get('ws_masternode')
                async with websockets.connect(uri) as ws:
                    await self.on_open(ws)
                    try:
                        async for message in ws:
                            await self.on_message(ws, message)
                            # Reset retry attempts on successful message
                            retry_attempts = 0
                    except websockets.ConnectionClosed as e:
                        await self.on_close(ws, e.code, e.reason)
            except Exception as e:
                await self.on_error(e)
                gc.collect()

                retry_attempts += 1
                if retry_attempts > max_retries:
                    print(f'Max retries reached. Stopping websocket loop.')
                    break

                # Exponential backoff, cap at 60 seconds
                wait_secs = min(base_wait_time * (2 ** (retry_attempts - 1)), 60)
                print(f'Websocket reconnect after {wait_secs} seconds')
                await asyncio.sleep(wait_secs)

    async def on_message(self, ws, msg):
        print(f'New event --> {msg}')

    async def on_error(self, error):
        print(f'Websocket error: {error}')

    async def on_close(self, ws, status_code, msg):
        print(f'Websocket connection closed with code {status_code} and message {msg}')

    async def on_open(self, ws):
        print("Websocket connection opened")

        # Sending subscription message
        subscribe_message = {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "id": 0,
            "params": {
                "query": f"tm.event='{self.cfg.get('event')}'"
            }
        }

        await ws.send(json.dumps(subscribe_message))
        print("Sent subscription message")


if __name__ == '__main__':
    cfg = {
        # Replace with your WebSocket URI
        'ws_masternode': 'ws://127.0.0.1:26657/websocket',
        'base_wait_time': 1,
        'max_retries': 5,
        'event': 'Tx'
    }

    event = Event(cfg)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(event.init())
    loop.run_forever()
```
