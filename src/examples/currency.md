---
title: XSC003 Token Contract
description: This is the currency contract used on Xian, it features a cryptographic permit system for approvals as well as a streaming functionality to supoprt subscription type functionaly.
---

# XSC003 Token Contract
## Overview
Example Xian Smart Contract based Dice game with random functions and house edge. Range based dice with multiplier winnings based on range.
This example demonstrates :
- How to use the `crypto` module to verify signatures.
- How to use the `hashlib` module to generate hashes.
- How to use the `datetime` module to handle dates and times.

:::tip Source Code
- The source code, including tests for this project can be found here: [Xian GitHub](https://github.com/xian-network/XSC003)
:::

:::info Running Tests
- For running the tests in this example, we recommend using the [Contract Dev Environment](/tools/contract-dev-environment).
:::

## Contract Code

```python
balances = Hash(default_value=0)
metadata = Hash()
# XST002
permits = Hash()
# XST003
streams = Hash()


# XST001

@construct
def seed():
    balances[ctx.caller] = 1_000_000

    metadata['token_name'] = "TEST TOKEN"
    metadata['token_symbol'] = "TST"
    metadata['token_logo_url'] = 'https://some.token.url/test-token.png'
    metadata['token_website'] = 'https://some.token.url'
    metadata['operator'] = ctx.caller


@export
def change_metadata(key: str, value: Any):
    assert ctx.caller == metadata['operator'], 'Only operator can set metadata.'
    metadata[key] = value


@export
def transfer(amount: float, to: str):
    assert amount > 0, 'Cannot send negative balances.'
    assert balances[ctx.caller] >= amount, 'Not enough coins to send.'

    balances[ctx.caller] -= amount
    balances[to] += amount

    return f"Sent {amount} to {to}"


@export
def approve(amount: float, to: str):
    assert amount > 0, 'Cannot send negative balances.'
    balances[ctx.caller, to] += amount

    return f"Approved {amount} for {to}"


@export
def transfer_from(amount: float, to: str, main_account: str):
    assert amount > 0, 'Cannot send negative balances.'
    assert balances[main_account, ctx.caller] >= amount, f'Not enough coins approved to send. You have {balances[main_account, ctx.caller]} and are trying to spend {amount}'
    assert balances[main_account] >= amount, 'Not enough coins to send.'

    balances[main_account, ctx.caller] -= amount
    balances[main_account] -= amount
    balances[to] += amount

    return f"Sent {amount} to {to} from {main_account}"


@export
def balance_of(address: str):
    return balances[address]


# XST002 / Permit

@export
def permit(owner: str, spender: str, value: float, deadline: str, signature: str):
    deadline = strptime_ymdhms(deadline)
    permit_msg = construct_permit_msg(owner, spender, value, str(deadline))
    permit_hash = hashlib.sha3(permit_msg)

    assert permits[permit_hash] is None, 'Permit can only be used once.'
    assert now < deadline, 'Permit has expired.'
    assert crypto.verify(owner, permit_msg, signature), 'Invalid signature.'

    balances[owner, spender] += value
    permits[permit_hash] = True

    return f"Permit granted for {value} to {spender} from {owner}"


def construct_permit_msg(owner: str, spender: str, value: float, deadline: str):
    return f"{owner}:{spender}:{value}:{deadline}:{ctx.this}"


# XST003 / Streaming Payments


SENDER_KEY = "sender"
RECEIVER_KEY = "receiver"
STATUS_KEY = "status"
BEGIN_KEY = "begins"
CLOSE_KEY = "closes"
RATE_KEY = "rate"
CLAIMED_KEY = "claimed"
STREAM_ACTIVE = "active"
STREAM_FINALIZED = "finalized"
STREAM_FORFEIT = "forfeit"


# Creates a new stream to a receiver from ctx.caller
# Stream can begin at any point in past / present / future
# Wrapper for perform_create_stream
@export
def create_stream(receiver: str, rate: float, begins: str, closes: str):
    begins = strptime_ymdhms(begins)
    closes = strptime_ymdhms(closes)
    sender = ctx.caller

    stream_id = perform_create_stream(sender, receiver, rate, begins, closes)
    return stream_id


# Internal function used to create a stream from a permit or from a direct call from the sender
def perform_create_stream(sender: str, receiver: str, rate: float, begins: str, closes: str):
    stream_id = hashlib.sha3(f"{sender}:{receiver}:{begins}:{closes}:{rate}")

    assert streams[stream_id, STATUS_KEY] is None, 'Stream already exists.'
    assert begins < closes, 'Stream cannot begin after the close date.'
    assert rate > 0, 'Rate must be greater than 0.'

    streams[stream_id, STATUS_KEY] = STREAM_ACTIVE
    streams[stream_id, BEGIN_KEY] = begins
    streams[stream_id, CLOSE_KEY] = closes
    streams[stream_id, RECEIVER_KEY] = receiver
    streams[stream_id, SENDER_KEY] = sender
    streams[stream_id, RATE_KEY] = rate
    streams[stream_id, CLAIMED_KEY] = 0

    return stream_id


# Creates a payment stream from a valid signature of a permit message
# Wrapper for perform_create_stream
@export
def create_stream_from_permit(sender: str, receiver: str, rate: float, begins: str, closes: str, deadline: str, signature: str):
    begins = strptime_ymdhms(begins)
    closes = strptime_ymdhms(closes)
    deadline = strptime_ymdhms(deadline)

    assert now < deadline, 'Permit has expired.'
    permit_msg = construct_stream_permit_msg(sender, receiver, rate, begins, closes, deadline)
    permit_hash = hashlib.sha3(permit_msg)

    assert permits[permit_hash] is None, 'Permit can only be used once.'
    assert crypto.verify(sender, permit_msg, signature), 'Invalid signature.'

    permits[permit_hash] = True

    return perform_create_stream(sender, receiver, rate, begins, closes)


# Moves balance due from stream from sender to receiver.
# Called by `sender` or `receiver`
@export
def balance_stream(stream_id: str):
    assert streams[stream_id, STATUS_KEY], 'Stream does not exist.'
    assert streams[stream_id, STATUS_KEY] == STREAM_ACTIVE, 'You can only balance active streams.'
    assert now > streams[stream_id, BEGIN_KEY], 'Stream has not started yet.'

    sender = streams[stream_id, SENDER_KEY]
    receiver = streams[stream_id, RECEIVER_KEY]

    assert ctx.caller in [sender, receiver], 'Only sender or receiver can balance a stream.'

    closes = streams[stream_id, CLOSE_KEY]
    begins = streams[stream_id, BEGIN_KEY]
    rate = streams[stream_id, RATE_KEY]
    claimed = streams[stream_id, CLAIMED_KEY]

    # Calculate the amount of tokens that can be claimed
    
    outstanding_balance = calc_outstanding_balance(begins, closes, rate, claimed)
    
    assert outstanding_balance > 0, 'No amount due on this stream.'

    claimable_amount = calc_claimable_amount(outstanding_balance, sender)

    balances[sender] -= claimable_amount
    balances[receiver] += claimable_amount

    streams[stream_id, CLAIMED_KEY] += claimable_amount

    return f"Claimed {claimable_amount} tokens from stream"


# Sets a stream to expire at some point greater than or equal to the current time.
# If the new closes time is in the past, the stream is closed immediately
# If the new close time < begins, the stream is closed at begin time <invalidated>
# Called by `sender`
@export
def change_close_time(stream_id: str, new_close_time: str):
    new_close_time = strptime_ymdhms(new_close_time)

    assert streams[stream_id, STATUS_KEY], 'Stream does not exist.'
    assert streams[stream_id, STATUS_KEY] == STREAM_ACTIVE, 'Stream is not active.'

    sender = streams[stream_id, SENDER_KEY]

    assert ctx.caller == sender, 'Only sender can extend the close time of a stream.'

    if new_close_time < streams[stream_id, BEGIN_KEY] and now < streams[stream_id, BEGIN_KEY]:
        streams[stream_id, CLOSE_KEY] = streams[stream_id, BEGIN_KEY]
    elif new_close_time <= now:
        streams[stream_id, CLOSE_KEY] = now
    else:
        streams[stream_id, CLOSE_KEY] = new_close_time

    return f"Changed close time of stream to {streams[stream_id, CLOSE_KEY]}"


# Set the stream inactive.
# A stream must be balanced before it can be finalized.
# Closes must be <= now
# Once a stream is finalized, it cannot be re-opened.
# Called by : `sender` or `receiver`
@export
def finalize_stream(stream_id: str):
    assert streams[stream_id, STATUS_KEY], 'Stream does not exist.'
    assert streams[stream_id, STATUS_KEY] == STREAM_ACTIVE, 'Stream is not active.'

    sender = streams[stream_id, "sender"]
    receiver = streams[stream_id, "receiver"]

    assert ctx.caller in [sender, receiver], 'Only sender or receiver can finalize a stream.'

    begins = streams[stream_id, BEGIN_KEY]
    closes = streams[stream_id, CLOSE_KEY]
    rate = streams[stream_id, RATE_KEY]
    claimed = streams[stream_id, CLAIMED_KEY]

    assert now <= closes, 'Stream has not closed yet.'

    outstanding_balance = calc_outstanding_balance(begins, closes, rate, claimed)

    assert outstanding_balance == 0, 'Stream has outstanding balance.'

    streams[stream_id, STATUS_KEY] = STREAM_FINALIZED

    return f"Finalized stream {stream_id}"


# Convenience method to close a stream, balance it and finalize it
# Called by `sender`
@export
def close_balance_finalize(stream_id: str):
    change_close_time(stream_id=stream_id, new_close_time=str(now))
    balance_finalize(stream_id=stream_id)


# Convenience method to balance a stream and finalize it
# Called by `receiver` or `sender`
@export
def balance_finalize(stream_id: str):
    balance_stream(stream_id=stream_id)
    finalize_stream(stream_id=stream_id)

# Forfeit a stream to the sender
# Called by `receiver`
@export
def forfeit_stream(stream_id: str) -> str:
    assert streams[stream_id, STATUS_KEY], 'Stream does not exist.'
    assert streams[stream_id, STATUS_KEY] == STREAM_ACTIVE, 'Stream is not active.'

    receiver = streams[stream_id, RECEIVER_KEY]

    assert ctx.caller == receiver, 'Only receiver can forfeit a stream.'

    streams[stream_id, STATUS_KEY] = STREAM_FORFEIT
    streams[stream_id, CLOSE_KEY] = now

    return f"Forfeit stream {stream_id}"


def calc_outstanding_balance(begins: str, closes: str, rate: float, claimed: float) -> float:
    begins = begins
    closes = closes

    claimable_end_point = now if now < closes else closes
    claimable_period = claimable_end_point - begins
    claimable_seconds = claimable_period.seconds
    amount_due = (rate * claimable_seconds) - claimed
    return amount_due


def calc_claimable_amount(amount_due: float, sender:str) -> float:
    return amount_due if amount_due < balances[sender] else balances[sender]


def construct_stream_permit_msg(sender:str, receiver:str, rate:float, begins:str, closes:str, deadline:str) -> str:
    return f"{sender}:{receiver}:{rate}:{begins}:{closes}:{deadline}:{ctx.this}"

def strptime_ymdhms(date_string: str) -> datetime.datetime:
    return datetime.datetime.strptime(date_string, '%Y-%m-%d %H:%M:%S')
```