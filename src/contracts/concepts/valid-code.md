
# Valid Code

## No Classes Allowed!
Contracting maintains a strict 'no classes' model. This forces you as the developer to create more procedural code that is explicit and completely self-contained. Contracts must be easy to read and understand for validity. Instead of thinking of your code in classes, think of each contract as a 'module' that exposes certain functions to its users.

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


### Notable Restricted Builtins

Here are some notable ones with reasons for their restriction:

| Built-In       | Reason for Restriction                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------|
| `callable()`   | Functions are not passed as objects in Contracting.                                                     |
| `classmethod()`| Classes are disabled in Contracting.                                                                    |
| `compile()`    | Arbitrary code execution is a high security risk.                                                       |
| `complex()`    | Complex numbers are potentially non-deterministic. This is a consensus failure risk.                    |
| `delattr()`    | Arbitrary removal of Python attributes could allow unauthorized access to private objects and methods.  |
| `dir()`        | Allows exploration path into security exploit development.                                              |
| `enumerate()`  | Not included in the allowed list.                                                                       |
| `eval()`       | Arbitrary code execution is a high security risk.                                                       |
| `exec()`       | Arbitrary code execution is a high security risk.                                                       |
| `float()`      | Floating point precision issues can lead to consensus failures.                                         |
| `getattr()`    | Arbitrary access to attributes could allow private function execution.                                  |
| `globals()`    | Access to global scope methods allows modification of private methods and direct storage mechanisms.    |
| `hasattr()`    | Allows exploration path into security exploit development.                                              |
| `hash()`       | Potentially non-deterministic outcomes. Consensus failure risk.                                         |
| `id()`         | Potentially non-deterministic outcomes. Consensus failure risk.                                         |
| `input()`      | User input not supported.                                                                               |
| `iter()`       | Potential mutation of objects that are only supposed to be interfaced with through particular methods.  |
| `locals()`     | Access to local scope methods allows modification of private methods.                                   |
| `memoryview()` | Potentially non-deterministic outcomes. Consensus failure risk.                                         |
| `next()`       | Related to iter(), not included in the allowed list.                                                    |
| `object()`     | Base class for all classes, not needed since classes are disabled.                                      |
| `open()`       | File I/O not supported.                                                                                 |
| `property()`   | Property creation not supported because classes are disabled.                                           |
| `repr()`       | Potentially non-deterministic due to memory address as output. Consensus failure risk.                  |
| `setattr()`    | Arbitrary setting of Python attributes has storage corruption and private method access implications.   |
| `staticmethod()`| Static methods are not supported because classes are disabled.                                         |
| `super()`      | Super is not supported because classes are disabled.                                                    |
| `vars()`       | Allows exploration path into security exploit development.                                              |

Note: All exceptions except the base Exception class are also removed from Contracting.

## Illegal AST Nodes

The Contracting linter restricts certain Python syntax by checking for specific AST (Abstract Syntax Tree) nodes. The following AST nodes are explicitly forbidden:

| AST Node | Reason for Restriction |
|----------|------------------------|
| `ast.AsyncFor` | All async code is invalid in Contracting. Async operations are non-deterministic. |
| `ast.AsyncFunctionDef` | All async code is invalid in Contracting. Async operations are non-deterministic. |
| `ast.AsyncWith` | All async code is invalid in Contracting. Async operations are non-deterministic. |
| `ast.Await` | All async code is invalid in Contracting. Async operations are non-deterministic. |
| `ast.ClassDef` | Classes are disabled in Contracting to enforce procedural programming. |
| `ast.Ellipsis` | Ellipsis should not be defined in a smart contract. They may be an effect of one. |
| `ast.GeneratorExp` | Generators hold state that is incompatible with Contracting's deterministic execution model. |
| `ast.Global` | Scope modification could have security implications by allowing access to variables outside the intended scope. |
| `ast.ImportFrom` | Selective importing is not supported to prevent importing potentially dangerous modules. |
| `ast.Interactive` | Only available in Python interpreters. Potential security risk. |
| `ast.Lambda` | Lambda functions can hide complex logic and make contracts harder to audit. |
| `ast.MatMult` | Matrix multiplication operator (@) is not supported. |
| `ast.Nonlocal` | Scope modification could have security implications by allowing access to variables outside the intended scope. |
| `ast.Suite` | Similar to ast.Interactive, not needed in contract code. |
| `ast.Try` | Exception handling can lead to non-deterministic execution paths. |
| `ast.With` | Context managers can have side effects that are difficult to predict. |
| `ast.Yield` | Generator related code is not compatible with Contracting's deterministic execution model. |
| `ast.YieldFrom` | Generator related code is not compatible with Contracting's deterministic execution model. |

## Violations

The linter will check for several violations that will fail your smart contract automatically. Here is a list of the current violations and examples of code that will cause them.

#### S1- Illegal contracting syntax type used

Thrown when an AST type that is not allowed is visited by the linter.

```python
2 @ 2  # ast.MatMult code
```

#### S2- Illicit use of '\_' before variable

\_ is used for gating certain functionality. Using it as a prefix to any variable will fail.

```python
_balances = Hash()
```

#### S3- Illicit use of Nested imports

`import` keywords found inside of functions, loops, etc. will fail.

```python
import this_wont_fail

@construct
def seed():
    import this_will  # This will fail
```

#### S4- ImportFrom compilation nodes not yet supported

Selective importing is not supported and will fail contracts.

```python
from token import send  # This will fail
```

#### S5- Contract not found in lib

Not currently used.

#### S6- Illicit use of classes

Classes are not supported in Contracting and their keywords will fail your contract.

```python
class Car:  # This will fail
    def __init__(self, make, model):
        self.make = make
        self.model = model
```

#### S7- Illicit use of Async functions

Any async related code will fail the contract.

```python
async def fail_me():  # This will fail
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

@unknown  # This will fail
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

@construct  # This will fail
def seed_2():
    v.set(999)
```

#### S10- Illicit use of multiple decorators

Stacking decorators is not allowed.

```python
v = Variable()
@export
@construct  # This will fail
def seed():
    v.set(777)
```

#### S11- Illicit keyword overloading for ORM assignments

ORM arguments are injected into the \_\_init\_\_ function on runtime. Messing with these will fail your contract.

```python
v = Variable(contract='token')  # This will fail
w = Variable(driver=None)  # This will fail
x = Variable(another_kwarg='this will fail')  # This will fail

@export
def set():
    v.set(777)
    w.set(999)
    x.set(123)
```

#### S12- Multiple targets to ORM definition detected

Python allows multiple assignment. Trying to do a multiple assignment from an ORM object will fail your contract.

```python
x, y = Hash()  # This will fail
@export
def set():
    x['bill'] = 100
    y['bill'] = 999
```

#### S13- No valid contracting decorator found

A contract without a single `@export` decorator is invalid.

```python
@construct
def seed():
    pass
# This will fail because there's no @export function
```

#### S14- Illegal use of a builtin

Referencing a builtin that is illegal will fail the contract.

```python
@export
def credits():
    return credits  # This will fail
```

#### S15- Reuse of ORM name definition in a function definition argument name

Reuse of any ORM names in any loops, functions, etc. will fail the contract.

```python
used_once = Variable()

@export
def override(used_once):  # This will fail
    return used_once
```

#### S16- Illegal argument annotation used

Only certain types are allowed for argument annotations. The allowed types are:
```
'dict', 'list', 'str', 'int', 'float', 'bool', 'datetime.timedelta', 'datetime.datetime', 'Any'
```

```python
@export
def invalid_annotation(x: complex):  # This will fail
    return x
```

#### S17- No valid argument annotation found

Missing argument annotations will fail the contract.

```python
@export
def missing_annotation(x):  # This will fail
    return x
```

#### S18- Illegal use of return annotation

Return annotations are not allowed in Contracting.

```python
@export
def invalid_return() -> int:  # This will fail
    return 42
```

#### S19- Illegal use of a nested function definition

Nested functions are not allowed in Contracting.

```python
@export
def outer_function():
    def inner_function():  # This will fail
        return 42
    return inner_function()
```
