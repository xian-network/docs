---
title: Testing and Feedback
description: As smart contracts get more and more complex, you need to be able to test them to make sure that they are doing what they are supposed to do. This becomes especially important once you start adding storage variables and functions that execute based on the person who is calling them. 
---

# {{$frontmatter.title}}

{{$frontmatter.description}}

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


## Setup Guide

## Contract Dev Container

*This is a standardised environment for developing and testing smart contracts on Xian.*

:::info Installation
1. Install Docker
  - [MacOS](https://docs.docker.com/desktop/install/mac-install/)
  - [Windows](https://docs.docker.com/desktop/install/windows-install/)
  - Linux
      - `curl -fsSL https://get.docker.com -o get-docker.sh`
      - `sudo sh get-docker.sh`
      - `sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
      - `sudo chmod +x /usr/local/bin/docker-compose`
2. `git clone https://github.com/xian-network/contract-dev-environment.git`
3. `cd contract-dev-environment`
4. `make build`
:::
:::info Usage
1. Run `make test-shell` from cli
   - This will open a command shell inside the container
2. Develop your contracts & tests in `/contracts`
3. To execute your tests :
   - `pytest tests/test.py` from the shell
4. To exit the test shell type `exit`
5. Happy coding !
:::

## Using the in-browser Sandbox

:::tip
*You will need to create a **free** account with codesandbox.com to interact with the sandbox.*
:::


<img height="100%" width="100%" alt="Edit xian-network/dice-game/sandbox" src="../examples/uber-dice-example-sandbox.png">

[![Edit xian-network/dice-game/sandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/github/xian-network/dice-game/sandbox?embed=1&file=%2FREADME.md)