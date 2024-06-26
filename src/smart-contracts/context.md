---
title: Context
description: Execution Context in Contracting.
---

# Context

## Execution Context in Contracting.


When you are running a contract, you often want to know who is running it. For example, if someone who isn't an account owner tries to spend their money, you need to have some way of identifying who that person is and prevent that from happening. This is where Context, or `ctx` inside of smart contracts, comes into play.

There are six types of `ctx` variables.

| Variable  | Functionality                                           | Details                                                                                                                                                         |
|-----------|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ctx.caller` | The identity of the person or smart contract calling the function. | Changes when a new function is evoked to the name of the smart contract that evoked that function. This allows for gating.                                      |
| `ctx.this`  | The identity of the smart contract where this variable is used.    | Constant. Never changed. Use for giving smart contracts rights and accounts.                                                                                    |
| `ctx.signer` | The top-level signer of the transaction. This is constant throughout the transaction's execution |                                                                                                                                       |
| `ctx.owner`  | The owner of the contract, which is an optional field that can be set on time of submission. | If this field is set, only the `ctx.owner` can call any of the functions on the smart contract. This allows for a parent-child model. |
| `ctx.entry`  | The entry function and contract as a tuple. | ctx.entry can help you distinguish a caller (either user or contract) and if the caller is a contract, it will inform you about the method from which that contract called your contract. |
| `ctx.submission_name`  | The name of the submission contract, usually 'submission'. |                                                                                                                                       |


:::tip A note on account & contract addresses
- In Contracting, account addresses are 32-byte hexadecimal strings.
- For these examples, accounts are represented as shortened versions, e.g.  `db21a73137672f075f9a8ee142a1aa4839a5deb28ef03a10f3e7e16c87db8f24` will be represented as `db21a731`.
- Contract addresses, with the exception of system contracts always start with `con_`, e.g. `con_direct`.
:::

## ctx.caller

This is the most complex Context variable, but also the most useful. The `ctx.caller` is the same as the transaction signer (`ctx.signer`) at the beginning of execution. If the smart contract that is initially invoked calls a function on another smart contract, the `ctx.caller` then changes to the name of the smart contract calling that function, and so on and so forth until the end of the execution.

:::tip `con_direct` **smart-contract**
```python
@export
def who_am_i():
    return ctx.caller
```

`con_indirect` **smart-contract**
```python
import con_direct

@export
def call_direct():
    return con_direct.who_am_i()
```
:::

:::info Assume the two contracts above exist in state space.
- If `2fadab39` calls `who_am_i` on the `con_direct` contract, `2fadab39` will be returned because `con_direct` does not call any functions in any other smart contracts.
- However, if `2fadab39` calls `call_direct` on the `con_indirect` contract, `con_indirect` will be returned because `con_indirect` is now the caller of this function.

:::

```txt
                   con_direct     
    ctx.signer    +----------------+       
                  |   calling      |        
    2fadab39 ---> |   who_am_I( )  |        
                  |                |        
                  +----------------+        
                  ctx.caller = 2fadab39    
 
                  con_indirect           con_direct                        
    ctx.signer    +---------------+      +----------------+                     
                  |               |      |   calling      |        
    2fadab39 ---> |               | ---> |   who_am_I( )  |        
                  |               |      |                |        
                  +---------------+      +----------------+        
                                         ctx.caller = con_indirect
```
A good example of how to use this would be in a token contract.

:::tip `con_token` smart-contract
```python
balances = Hash()
@construct
def seed():
    balances['2fadab39'] = 100
    balances['contract'] = 99

@export
def send(amount, to):
    assert balances[ctx.caller] >= amount

    balances[ctx.caller] -= amount
    balances[to] += amount
```

`con_contract` **smart-contract**
```python
import con_token

@export
def withdraw(amount):
    assert ctx.caller == '2fadab39'

    con_token.send(amount, ctx.caller)
```
:::

:::info In the above example:
 - `2fadab39` has 100 tokens directly on the `token` contract. 
 - She can send them, because his account balance is looked up based on the `ctx.caller` when the send function is called.
 - `con_contract` also has 99 tokens. 
 - When `con_contract` imports `con_token` and calls `send`, `ctx.caller` is changed to `con_contract`, and its balance is looked up and changed accordingly.
:::
### ctx.this

This is a very simple reference to the name of the smart contract. Use cases are generally when you need to identify a smart contract itself when doing some sort of transaction, such as sending payment through an account managed by the smart contract but residing in another smart contract.

:::tip `con_registrar` **smart-contract**
```python
names = Hash()

@export
def register(name, value):
    if names[name] is None:
        names[name] = value
```

`con_controller` **smart-contract**
```python
import registrar

@export
def register():
    registrar.register(ctx.this, "some_value")
```
:::

:::info In the above example:
The arguments passed to `register` on `con_registrar` will be `con_controller` and `some_value`.
:::

## ctx.signer

This is the absolute signer of the transaction regardless of where the code is being executed in the call stack. This is good for creating blacklists of users from a particular contract.

:::tip `con_blacklist` **smart-contract**
```python
not_allowed = ['2fadab39', 'db21a731']

@export
def some_func():
    assert ctx.signer not in not_allowed
    return 'You are not blacklisted!'
```

`con_indirect` **smart-contract**
```python
import con_blacklist

@export
def try_to_bypass():
    return con_blacklist.some_func()
```
:::
:::info In the above example: 
`2fadab39` calls the `try_to_bypass` function on `con_indirect`.

 The transaction will still fail because `ctx.signer` is used for gating instead of `ctx.caller`.
:::
:::warning NOTE
Never use `ctx.signer` for account creation or identity. Only use it for security guarding and protection. `ctx.caller` should allow behavior based on the value. `ctx.signer` should block behavior based on the value.
:::
### ctx.owner

On submission, you can specify the owner of a smart contract. This means that only the owner can call the `@export` functions on it. This is for advanced contract pattern types where a single controller is desired for many 'sub-contracts'. Using `ctx.owner` inside of a smart contract can only be used to change the ownership of the contract itself. Be careful with this method!

:::tip `con_ownable` **smart-contract**
```python
@export
def change_ownership(new_owner):
    ctx.owner = new_owner
```
:::


:::info In the above example:
The contract is not callable unless the `ctx.caller` is the `ctx.owner`. 
Therefore, you do not need to do additional checks to make sure that this is the case.
:::

## ctx.entry

When someone calls a contract through another contract, you might want to know what contract and function it was that called it in the first place.

`ctx.entry` returns a tuple containing the name of the contract and the function that was called.

:::tip `con_contract` **smart-contract**
```python
@export
def function():
    # Output when someone used con_other_contract: ("con_other_contract","call_contract")
    return ctx.entry  
```

`con_other_contract` **smart-contract**
```python
import con_contract

@export
def call_contract():
    con_contract.function()
```
:::

:::info In the above example : 
The output of `con_contract.function()` will be `("con_other_contract", "call_contract")`.

