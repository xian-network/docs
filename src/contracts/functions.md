---
title: Functions
description: Functions in Contracting.
---

# Functions

##  Types of functions in Contracting

:::info Functions in Contracting are defined by the use of decorators 
Decorators are special keywords situated above a function definition that tell the system how to handle the function.

The decorators used in Contracting are:

- `@export`
    - A public function that can be called by any contract or person
- `@construct`
    - A function that is executed when the contract is submitted
- No decorator
    - A private function that can only be called by the smart contract itself
::: 
## @export
You have to define at least one `@export` decorated function in your smart contract. Otherwise, the smart contract has no functions for people to call.

```python
@export
def hello():
     return 1
```

This is probably one of the simplest contracts you can write. As long as there is a single `@export` function, you're good to go.

## Private Functions
Private functions are just functions without any decorators on them. They can be used internally by your smart contract, but cannot be called by people outside the system or by other smart contracts themselves.

```python
@export
def hello():
    return there()

def there():
    return 1
```

## @construct
If you want a smart contract to execute a piece of code once on submission, you can define a single function with the `@construct` decorator. The function you decorate can be called anything. Use this to set up an initial state for your smart contract.

```python
owner = Variable()

@construct
def init():
    owner.set('bill')

@export
def get_owner():
    return owner.get()
```

The `init` function will execute when the contract is submitted, but never again. Thus, the initial state is such that `owner` is set to `bill`. Because there are no other functions to change this variable in storage, this will stay static.

## Constructor Arguments
Sometimes, you may write a smart contract that you want to redeploy, or want to define the construction when you submit it. You can do this by providing keyword arguments to the `@construct` function you make.

```python
owner = Variable()
allowed = Variable()

@construct
def init(initial_owner, intial_allowed):
    owner.set(initial_owner)
    allowed.set(intial_allowed)

@export
def get_owner():
    return owner.get()

@export
def get_allowed():
    return allowed.get()
```

Now when you submit the contract, you can specify the initial arguments and they will be set dynamically on submission.
