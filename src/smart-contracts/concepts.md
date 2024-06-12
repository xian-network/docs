---
title: Concepts
description: Concepts in Contracting.
---

<!-- <script>
import execute_img from '$lib/img/execute.png'
import import_img from '$lib/img/import.png'
</script> -->

# {{$frontmatter.title}}

{{$frontmatter.description}}

## Stamps

A stamp is a single unit of computational work in a smart contract. Stamps are paid for with Xian. This is what enforces rate limiting and incentivizes the development of the network.

To calculate work, the code is ran through an optimized tracer. Each Python VM opcode has a specific cost. Each step of the code deducts from the number of stamps attached to the transaction.

If all of the stamps are deducted before the transaction is done, the transaction reverts states and fails. If there are left over stamps from the transaction execution, they are returned to the sender.

### Read / Write Costs
* Cost to read one byte from state: 3 stamps
* Cost to write one byte to state: 25 stamps

## Contract Submission

When a smart contrat is submitted, it goes through a special `submission` smart contract that is seeded at the beginning of the software's lifecycle.

The submission contract is something that bypasses the traditional linting and compilation processes and thus provides a gateway between deeper levels of the Contracting protocol and the 'whitelisted' interfaces of the execution environment.

### submission.s.py
```python
@__export('submission')
def submit_contract(name, code, owner=None, constructor_args={}):
    __Contract().submit(name=name, code=code, owner=owner, constructor_args=constructor_args)
```

The main concept is that generally \_\_ variables are private and not allowed. However, this code is injected into the state space before the software starts up. Once it is in the state, the `__Contract` object can never be submitted in another smart contract by the user because it will fail.

Calling on the `submit_contract` function will then call `__Contract` which is a special ORM object. `__Contract`'s only job is to submit contracts.

```python
class Contract:
    def __init__(self, driver: ContractDriver=driver):
        self._driver = driver

    def submit(self, name, code, owner=None, constructor_args={}):

        c = ContractingCompiler(module_name=name)

        code_obj = c.parse_to_code(code, lint=True)

        scope = env.gather()
        scope.update({'__contract__': True})
        scope.update(rt.env)

        exec(code_obj, scope)

        if scope.get(config.INIT_FUNC_NAME) is not None:
            scope[config.INIT_FUNC_NAME](**constructor_args)

        self._driver.set_contract(name=name, code=code_obj, owner=owner, overwrite=False)
```

The code that is submitted is put through the `ContractingCompiler` with the `lint` flag set as true. This causes the code to be run through all of the checks and transformed into pure Contracting code, which has slight variations to the code that the user submits but is used internally by the system.

`__Contract` will then gather the working environment and execute it on the submitted code. This encapsulates the execution environment completely within the new code module without potential leakage or exposure. The `__contract__` flag is also set to indicate to the Python import system that this code cannot use any builtins at runtime.

`__Contract` will then try to see if there is a `@construct` function available on the code. If this is the case, it will execute this function and pass the constructor arguments into it if any are provided.

Finally, the code string, as compiled, is stored in the state space so that other contracts can import it and users can transact upon it.

### Linter

The Contracting Linter is a `NodeVisitor` from the Python AST module. It takes a string of code and turns it into an abstract syntax tree which it then traverses. Upon visiting of each type of node, the linter will do certain checks to make sure that the code is inline with what is allowed in the Contracting execution environment. You can see some of the things it checks for in the 'Valid Code' section under 'Violations'.

If there are no violations, the code is then passed to the compiler which does the final checks.

### Compiler

The Contracting Compiler takes the linted code and uses a `NodeTransformer` object from the Python AST module to turn the code into a lower representation of what it should be so that Contracting can directly execute functions against it.

Some of these transforms include appending `__` to `@export` decorators and variables, renaming the `@construct` function to `____`, and inserting the correct keyword arguments into the ORM initialization functions.

Here is an example of what code looks like before and after it goes through the compiler.

#### Before
```python
balances = Hash()

@construct
def seed():
    balances['stu'] = 1000000

@export
def transfer(amount, to):
    sender = ctx.signer
    assert balances[sender] >= amount

    balances[sender] -= amount

    if balances[to] is None:
        balances[to] = amount
    else:
        balances[to] += amount

@export
def balance(account):
    return balances[account]
```
#### After
```python
__balances = Hash(contract='__main__', name='balances')


def ____():
    __balances['stu'] = 1000000


@__export('__main__')
def transfer(amount, to):
    sender = ctx.signer
    assert __balances[sender] >= amount
    __balances[sender] -= amount
    if __balances[to] is None:
        __balances[to] = amount
    else:
        __balances[to] += amount


@__export('__main__')
def balance(account):
    return __balances[account]
```

## Model
Contracting is 100% compatible Python code with a few modifications to make it more deterministic on different machines and safer in untrusted environments. You need to have knowledge of Python to be able to use Contracting.


### What is a smart contract, anyways?

Let's define what a smart contract is, and what one isn't.

| A smart contract is:                                | A smart contract isn't:              |
|-----------------------------------------------------|--------------------------------------|
| Immutable                                           | A full application                   |
| Open-Sourced                                        | A database                           |
| Accessible through strict API                       | Able to act without interaction      |
| A set of rules enforced by consensus                | Able to draw data from the web arbitrarily |
| A function of its inputs                            |                                      |


Therefore, we have to make some considerations and alterations to what is allowed in a smart contract. We do not add any additional features to Python that make the code incompatible. Contracting is a strict subset.

### How Code Executes Usually
In Python, you write code, run it, and it executes. It is either something that happens in sequence and then finishes, or is a long running asynchronous application such as a web server that runs in an event loop and processes requests over a long period of time.

Smart contracts do neither of these things!

### How Smart Contract Code Executes
Smart contracts define an explicit API that one can call. To execute code, you pass the contract and function name into the executor along with the keyword arguments for the specific function. To submit a new smart contract, you actually invoke a smart contract call specifically developed for submitting smart contracts.

```python
from contracting.execution.executor import Executor

contract_code = '''
@export
def ping(pong):
    return pong
'''

e = Executor(metering=False)

e.execute(sender='stu',
		  contract_name='submission',
		  function_name='submit_contract',
		  kwargs={
			  'name': 'my_contract',
			  'code': contract_code
		  })
```

The above method uses the raw executor instead of the `ContractingClient` used in the 'Quick Start' section. This shows you exactly how smart contract functions are called. The client takes care of this in a more elegant way and makes it feel more Pythonic to the developer.

Metering is set to false so that the executor does not use any stamps when executing this function. This is preferable in development environments.

### Step 1: Submit Transaction
<execute_img/>

<center><img src='../../../../img/execute.png' width=75%></center>

Executor retrieves the module for the smart contract if it exists.

### Step 2: Execution
<center><img src='../../../../img/execute.png' width=75%></center>

The executor attempts to execute a function on the smart contract. If it fails due to Python errors or invalid inputs, the executor will get a response. Otherwise, the function is called and the results of the execution are returned to the executor and which can be passed to the operator.

### Post-Submission Code

The rest of the guide is about what code is valid for submission of a smart contract. Once the smart contract is submitted, functions will generally not fail unless the inputs throw assertion errors that are raised inside of the contracts themselves.

It is the job of the smart contract developer to test and confirm the functionality of their contract before submission. After it has been submitted, the contract cannot be changed.

## Valid Code

### No Classes Allowed!
Contracting maintains a strict 'no classes' model. This forces you as the developer to create more procedural code that is explicit and completely self-contained. Contracts must be easy to read and understand for validity. Instead of thinking of your code in classes, think of each contract as a 'module' that exposes certain functions to it's users.

All `class` keywords will fail your contract on submission. Even if you try to use classes for object oriented code, you will have to find another way to express your structures.

For example:

```python
class Car:
	def __init__(self, make, model):
		self.make = make
		self.model = model
```

This is illegal. Instead, describe objects in dictionary formats. If you tend to use classes to encapsulate data, simply use Python dictionaries instead. This is especially useful because of Contracting's storage model that makes it easy to store dictionaries.

```python
cars = Hash()
cars['balthasar'] = {
	'make': 'Ford',
	'model': 'Contour'
}
```

Read more about storage in the Storage section.

### Restricted Builtins

Certain builtins such as `exec`, `eval`, and `compile` are obviously dangerous. We do not want to allow any arbitrary execution of code.

Here is a list of most Python3.11 builtin functions versus the ones we allow in Contracting. NOTE: All exceptions except the base Exception class are removed from Contracting.

| Built-Ins    | Python3.11 | Contracting | Reason for Restriction                                                                                   |
|--------------|------------|-------------|---------------------------------------------------------------------------------------------------------|
| `abs()`      | ✓          | ✓           |                                                                                                         |
| `all()`      | ✓          | ✓           |                                                                                                         |
| `any()`      | ✓          | ✓           |                                                                                                         |
| `ascii()`    | ✓          | ✓           |                                                                                                         |
| `bin()`      | ✓          | ✓           |                                                                                                         |
| `bool()`     | ✓          | ✓           |                                                                                                         |
| `bytearray()`| ✓          | ✓           |                                                                                                         |
| `bytes()`    | ✓          | ✓           |                                                                                                         |
| `callable()` | ✓          | ✘           | Functions are not passed as objects in Contracting.                                                     |
| `chr()`      | ✓          | ✓           |                                                                                                         |
| `classmethod()`| ✓        | ✘           | Classes are disabled in Contracting.                                                                    |
| `compile()`  | ✓          | ✘           | Arbitrary code execution is a high security risk.                                                       |
| `complex()`  | ✓          | ✘           | Complex numbers are potentially non-deterministic. This is a consensus failure risk.                    |
| `copyright`  | ✓          | ✘           | Unnecessary.                                                                                            |
| `credits`    | ✓          | ✘           | Unnecessary.                                                                                            |
| `delattr()`  | ✓          | ✘           | Arbitrary removal of Python attributes could allow unauthorized access to private objects and methods.  |
| `dict()`     | ✓          | ✓           |                                                                                                         |
| `dir()`      | ✓          | ✘           | Allows exploration path into security exploit development.                                              |
| `divmod()`   | ✓          | ✓           |                                                                                                         |
| `enumerate()`| ✓          | ✘           | Potentially safe. Evaluating to make sure.                                                              |
| `eval()`     | ✓          | ✘           | Arbitrary code execution is a high security risk.                                                       |
| `exec()`     | ✓          | ✘           | Arbitrary code execution is a high security risk.                                                       |
| `filter()`   | ✓          | ✓           |                                                                                                         |
| `float()`    | ✓          | ✘           | Floating point precision issues can lead to consensus failures.                                         |
| `format()`      | ✓          | ✓           |                                                                                                         |
| `frozenset()`   | ✓          | ✓           |                                                                                                         |
| `getattr()`     | ✓          | ✘           | Arbitrary access to attributes could allow private function execution.                                  |
| `globals()`     | ✓          | ✘           | Access to global scope methods allows modification of private methods and direct storage mechanisms.    |
| `hasattr()`     | ✓          | ✘           | Allows exploration path into security exploit development.                                              |
| `hash()`        | ✓          | ✘           | Potentially non-deterministic outcomes. Consensus failure risk.                                         |
| `help()`        | ✓          | ✘           | Unnecessary.                                                                                            |
| `hex()`         | ✓          | ✓           |                                                                                                         |
| `id()`          | ✓          | ✘           | Potentially non-deterministic outcomes. Consensus failure risk.                                         |
| `input()`       | ✓          | ✘           | User input not supported.                                                                               |
| `int()`         | ✓          | ✓           |                                                                                                         |
| `isinstance()`  | ✓          | ✓           |                                                                                                         |
| `issubclass()`  | ✓          | ✓           |                                                                                                         |
| `iter()`        | ✓          | ✘           | Potential mutation of objects that are only supposed to be interfaced with through particular methods. |
| `len()`         | ✓          | ✓           |                                                                                                         |
| `license`       | ✓          | ✘           | Unnecessary.                                                                                            |
| `list()`        | ✓          | ✓           |                                                                                                         |
| `locals()`      | ✓          | ✘           | See globals()                                                                                           |
| `map()`         | ✓          | ✓           |                                                                                                         |
| `max()`         | ✓          | ✓           |                                                                                                         |
| `memoryview()`  | ✓          | ✘           | Potentially non-deterministic outcomes. Consensus failure risk.                                         |
| `min()`         | ✓          | ✓           |                                                                                                         |
| `next()`        | ✓          | ✘           | See iter()                                                                                              |
| `object()`      | ✓          | ✘           | See callable()                                                                                          |
| `oct()`         | ✓          | ✓           |                                                                                                         |
| `open()`        | ✓          | ✘           | File I/O not supported.                                                                                 |
| `ord()`         | ✓          | ✓           |                                                                                                         |
| `pow()`         | ✓          | ✓           |                                                                                                         |
| `print()`       | ✓          | ✓           |                                                                                                         |
| `property()`    | ✓          | ✘           | Property creation not supported because classes are disabled.                                           |
| `range()`       | ✓          | ✓           |                                                                                                         |
| `repr()`        | ✓          | ✘           | Unnecessary and non-deterministic due to memory address as output of this function. This is a consensus failure risk. |
| `reversed()`    | ✓          | ✓           |                                                                                                         |
| `round()`       | ✓          | ✓           |                                                                                                         |
| `set()`         | ✓          | ✓           |                                                                                                         |
| `setattr()`     | ✓          | ✘           | Arbitrary setting and overwriting of Python attributes has storage corruption and private method access implications. |
| `slice()`       | ✓          | ✘           | Unnecessary.                                                                                            |
| `sorted()`      | ✓          | ✓           |                                                                                                         |
| `staticmethod()`| ✓          | ✘           | Static methods are not supported because classes are disabled.                                          |
| `str()`         | ✓          | ✓           |                                                                                                         |
| `sum()`         | ✓          | ✓           |                                                                                                         |
| `super()`       | ✓          | ✘           | Super is not supported because classes are disabled.                                                    |
| `tuple()`       | ✓          | ✓           |                                                                                                         |
| `type()`        | ✓          | ✓           |                                                                                                         |
| `vars()`        | ✓          | ✘           | Allows exploration path into security exploit development.                                              |
| `zip()`         | ✓          | ✓           |                                                                                                         |


### Illegal AST Nodes

Similarly, some of the AST (abstract syntax tree) nodes that make up deeper levels of the Python syntax are not allowed. Mainly, the nodes around the async/await features are restricted.

| AST Node | Reason for Restriction |
|----------|------------------------|
| [ast.AsyncFor](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#AsyncFor) | All async code is invalid in Contracting. |
| [ast.AsyncFunctionDef](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#AsyncFunctionDef) | All async code is invalid in Contracting. |
| [ast.AsyncWith](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#AsyncWith) | All async code is invalid in Contracting. |
| ast.AugLoad | AST Node never used in current CPython implementation. |
| ast.AugStore | AST Node never used in current CPython implementation. |
| [ast.Await](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#Await) | All async code is invalid in Contracting. |
| [ast.ClassDef](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#ClassDef) | Classes are disabled in Contracting. |
| [ast.Ellipsis](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#Ellipsis) | Ellipsis should not be defined in a smart contract. They may be an effect of one. |
| [ast.GeneratorExp](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#GeneratorExp) | Generators hold state that is incompatible with Contracting's model. |
| [ast.Global](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#Global) | Scope modification could have security implications. |
| ast.Interactive | Only available in Python interpreters. Potential security risk. |
| [ast.MatMult](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#MatMult) | New AST feature. Not yet widely adopted. Potential security risk. |
| [ast.Nonlocal](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#Nonlocal) | Scope modification could have security implications. |
| ast.Suite | Similar to ast.Interactive |
| [ast.Yield](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#Yield) | Generator related code is not compatible with Contracting. |
| [ast.YieldFrom](https://greentreesnakes.readthedocs.io/en/latest/nodes.html#YieldFrom) | Generator related code is not compatible with Contracting. |

### Violations

The linter will check for several violations that will fail your smart contract automatically. Here is a list of the current violations and examples of code that will cause them.

#### S1- Illegal contracting syntax type used

Thrown when an AST type that is not allowed is visited by the linter.

```python
2 @ 2 # ast.MatMul code
```

#### S2- Illicit use of '\_' before variable

\_ is used for gating certain functionality. Using it as a prefix to any variable will cause failure

```python
_balances = Hash()
```

#### S3- Illicit use of Nested imports

`import` keywords found inside of functions, loops, etc. will fail.

```python
import this_wont_fail

@construct
def seed():
	import this_will
```
#### S4- ImportFrom compilation nodes not yet supported

Selective importing is not supported and will fail contracts.

```python
from token import send
```

#### S5- Contract not found in lib

Not currently used.

#### S6- Illicit use of classes

Classes are not supported in Contracting and their keywords will fail your contract.

```python
class Car:
    def __init__(self, make, model):
        self.make = make
        self.model = model
```

#### S7- Illicit use of Async functions

Any async related code will fail the contract.

```python
async def fail_me():
    pass
```

#### S8- Invalid decorator used

`@export` and `@construct` are the only two decorators allowed in Contracting.

```python
v = Variable()
@construct
def seed():
    v.set(100)

@export
def get_v():
    return v.get()

@unknown
def this_will_fail():
    pass
```

#### S9- Multiple use of constructors detected

Only a single `@construct` can be included in a contract.

```python
v = Variable()
@construct
def seed():
    v.set(123)

@construct
def seed_2():
    v.set(999)
```

#### S10- Illicit use of multiple decorators

Stacking decorators is not allowed.

```python
v = Variable()
@export
@construct
def seed():
    v.set(777)
```

#### S11- Illicit keyword overloading for ORM assignments

ORM arguments are injected into the \_\_init\_\_ function on runtime. Messing with these will fail your contract.

```python
v = Variable(contract='token')
w = Variable(driver=None)
x = Variable(another_kwarg='this will fail')

@export
def set():
    v.set(777)
    w.set(999)
    x.set(123)
```

#### S12- Multiple targets to ORM definition detected

Python allows multiple assignment. Trying to do a multiple assignment from an ORM object will fail your contract.

```python
x, y = Hash()
@export
def set():
    x['stu'] = 100
    y['stu'] = 999
```

#### S13- No valid contracting decorator found

A contract without a single `@export` decorator is invalid.

```python
@construct
def seed():
    pass
```

#### S14- Illegal use of a builtin

Referencing a builtin that is illegal will fail the contract.

```python
@export
def credits():
    return credits
```

#### S15- Reuse of ORM name definition in a function definition argument name

Reuse of any ORM names in any loops, functions, etc. will fail the contract.

```python
used_once = Variable()

@export
def override():
    used_once = 123
```
