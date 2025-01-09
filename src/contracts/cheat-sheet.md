---
title: Cheat Sheet
description: Here is a reference contract showcasing many of the syntax and features of Contracting.
---

# Cheat Sheet

## Reference Contract

This reference contract demonstrates the key features and syntax of Contracting.


```python
random.seed() # Seed the random number generator

# Variable is a way to define a state variable in the contract
simple_var = Variable() 
# Hash is a way to define a key-value store in the contract
storage = Hash(default_value=0)

submission_time = Variable()
submission_block_num = Variable()
submission_block_hash = Variable()
random_number = Variable()

# ForeignHash is a way to get a read-only view of
# a Hash object from another contract
xian_balances = ForeignHash(
    foreign_contract='currency', foreign_name='balances'
) 
# ForeignVariable is a way to get a read-only view of
# a Variable object from another contract
foundation_owner = ForeignVariable(
    foreign_contract='foundation', foreign_name='owner'
) 

# The construct decorator is optional and can be used to define
# initialization logic for the contract. It's called on contract submission
@construct 
def seed():
    # Initialize the contract with a variable
    simple_var.set(0)
    # now is a built-in variable that returns the current datetime
    submission_time.set(now) 
    random_number.set(random.randint(0, 100))
    # block_num is a built-in variable that returns the current block number
    submission_block_num.set(block_num) 
    # block_hash is a built-in variable that returns the current block hash
    submission_block_hash.set(block_hash) 

# This function is private and cannot be called from outside the contract
def private_function(): 
    return "This is a private function"

# The export decorator is used to define functions that can be called from 
# outside the contract
@export 
def call_private_function():
    # Call the private function
    return private_function()

# This function is public and can be called from outside the contract
@export
def public_function():
    return "This is a public function"

# Increment the variable by 1
@export
def increment():
    simple_var.set(simple_var.get() + 1)

# Decrement the variable by 1
@export
def decrement():
    simple_var.set(simple_var.get() - 1)

# Set a key-value pair in the storage
@export
def set_storage_pair(key: str, value: int):
    storage[key] = value

# Get the value of a key in the storage
@export
def get_storage_pair(key: str):
    return storage[key]

# Set a nested key-value pair in the storage
@export
def set_nested_storage_pair(key: str, nested_key: str, value: int):
    storage[key, nested_key] = value

@export
# Get the value of a nested key in the storage
def get_nested_storage_pair(key: str, nested_key: str):
    return storage[key, nested_key]

# Import another contract dynamically
@export
def interact_with_other_contract(contract: str, args: dict):
    c = importlib.import_module(contract) 

    forced_interface = [
        # Func is a way to enforce the existence 
        # of a function with specific arguments
        importlib.Func('do_something', args=('amount', 'to')), 
        # Var is a way to enforce the existence 
        # of a variable with a specific type
        importlib.Var('balances', Hash) 
    ] 

    # Enforce the interface of the other contract
    assert importlib.enforce_interface(c, forced_interface) 

    # Interact with another contract
    c.do_something(**args)

# Check if the submission time is older than a specific date
@export 
def is_older_than_date(date: datetime.datetime):
    return submission_time.get() < date

@export
def get_contract_name():
    return ctx.this

@export
def am_i_a_masternode():
    nodes = ForeignVariable(
        foreign_contract='masternodes', foreign_name='nodes'
    ) # nodes is a list
    return ctx.caller in nodes

@export
def xian_balance():
    # Return value from a previously retrieved Hash object
    return xian_balances[ctx.caller]

@export
def get_foundation_owner():
    # Return value from a previously retrieved Variable object
    return foundation_owner.get()

# The actual caller that called this function. 
# Could be a contract or an account
@export
def who_am_i():
    return ctx.caller 

# First signer in the call chain (the original signer). 
# This is the account that initiated the transaction even 
# if the transaction was forwarded by another contract
@export
def get_top_level_signer():
    return ctx.signer 

# Exception handling
@export
def calculate():
    some_value = 0

    # This will not work. The transaction will result in an error
    # because it's not allowed to use exceptions in smart contracts.
    try:
        return 100 / some_value
    except:
        return "Cannot divide by 0"

    # Instead, use asserts
    assert some_value != 0, "Cannot divide by 0"

    # Or use IF statements
    if some_value == 0:
        return "Cannot divide by 0"
```
