# Websocket

## Subscribe to Events

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
