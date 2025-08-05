---
title: Testing and Feedback
description: As smart contracts get more and more complex, you need to be able to test them to make sure that they are doing what they are supposed to do. This becomes especially important once you start adding storage variables and functions that execute based on the person who is calling them. 
---

# Testing and Feedback

 As smart contracts get more and more complex, you need to be able to test them to make sure that they are doing what they are supposed to do. This becomes especially important once you start adding storage variables and functions that execute based on the person who is calling them. 

## Basic Smart Contract

We can write a simple smart contract and test to make sure it works.

contract.py (Smart Contract)
```python
@export
def call_this(a):
    return complex_function(a)

def complex_function(a):
    if a > 50:
        return 'Quack!'
    elif a < 10:
        return 'Oink!'
    elif a == 15:
        return 'Woof!'
    else:
        return 'Meow!'
```

## Writing & Executing Tests

We will use Python's built-in `unittest` library. You can read how to use it [here](https://docs.python.org/3/library/unittest.html).

This is the first part of our test script.

test_contract.py
```python
from unittest import TestCase
from contracting.client import ContractingClient

class TestSmartContract(TestCase):
    def setUp(self):
        self.c = ContractingClient()
        self.c.flush()

        with open('contract.py') as f:
            code = f.read()
            self.c.submit(code, name='test_me')

        self.test_me = self.c.get_contract('test_me')

   def test_a_over_50_returns_quack(self):
        pass

    def tearDown(self):
        self.c.flush()

if __name__ == '__main__':
    unittest.main()
```

Key things that are happening:

* We import the client.
* We override the `setUp` and `tearDown` functions in `TestCase` which execute before and after every test respectively. This gives us a clean state to work upon for each test. 

Before each test, we completely flush and resubmit the contract. After each test, we flush again. This is for sanity.

Now let's write the actual test.
```python
    def test_a_over_50_returns_quack(self):
        self.assertEqual(self.test_me.call_this(a=51), 'Quack!')
```

The tests are pretty straightforward. Each branch of logic gets it's own test and the behavior is described. You can use whatever testing methods you'd like. We also include a negative test case as an example of how to test that something fails.

### Running the tests

For running tests, we recommend using the [Contract Dev Environment](/tools/contract-dev-environment).

## Returning Output of Transactions
When calling a contract method, add the argument `return_full_output=True`. This makes the call return a detailed dictionary containing the complete execution receipt:

*   **`status_code`** (integer):
    *   Indicates the outcome of the transaction.
    *   `0` means the execution was successful.
    *   `1` means the execution failed and an exception was raised.

*   **`result`** (any):
    *   If the transaction was successful (`status_code` is 0), this holds the actual return value from the contract method. For a `transfer` method that doesn't explicitly return anything, this will be `None`.
    *   If the transaction failed (`status_code` is 1), this holds the Python `Exception` object that was raised.

*   **`writes`** (dict):
    *   A dictionary containing all the state changes that occurred during the transaction.
    *   The keys are the full storage keys (e.g., `'currency.balances:bob'`) and the values are the new data written to that key. This shows you exactly what data was modified on the blockchain state.

*   **`reads`** (dict):
    *   A dictionary containing all the state data that was read from storage during the transaction.
    *   The keys are the storage keys, and the values are the data that was read. This is useful for understanding the data dependencies of a transaction.

*   **`events`** (list):
    *   A list of all event dictionaries that were emitted by the contract using `LogEvent`.
    *   If the contract doesn't emit any events for that method call, this will be an empty list.

*   **`stamps_used`** (integer):
    * A stamp is a single unit of computational work in a smart contract.
    * Indicates how much computational work was involved

Let's show how to use `return_full_output=True`
```python
    def test_a_over_50_returns_quack(self):
        output = self.test_me.call_this(a=51, return_full_output=True) # add the argument return_full_output=True
        print(f'###### txn output = {output} ######') #display all fields
```
## Determining Transaction Cost
To get the stamp usage for each contract method call in your test, we need to make some adjustments:

1.  Initialize the `ContractingClient` with `metering=True`. This enables the stamp calculation mechanism (also enforces the payment of stamps).
2. Set the `bypass_balance_amount` flag on the client's executor to True. This completely bypasses the initial check that verifies if the sender has enough funds to pay for the stamps.

from previous with modifications
```python
from unittest import TestCase
from contracting.client import ContractingClient

class TestSmartContract(TestCase):
    def setUp(self):
        self.c = ContractingClient(metering=True) # set metering to true
        self.c.executor.bypass_balance_amount = True # set the `bypass_balance_amount` flag on the client's executor to True
        self.c.flush()

#- - - - - - - - - - - - - - - - - -
#           TRUNCATED
#- - - - - - - - - - - - - - - - - -
    # test case
    def test_a_over_50_returns_quack(self):
        output = self.test_me.call_this(a=51, return_full_output=True)
        print(f'###### stamps used = {output['stamp_used']} ######') # print txn cost
```