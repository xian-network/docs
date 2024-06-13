
# Valid Code

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
