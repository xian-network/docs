
# Model
Contracting is 100% compatible Python code with a few modifications to make it more deterministic on different machines and safer in untrusted environments. You need to have knowledge of Python to be able to use Contracting.


## What is a smart contract, anyways?

Let's define what a smart contract is, and what one isn't.

| A smart contract is:                                | A smart contract isn't:              |
|-----------------------------------------------------|--------------------------------------|
| Immutable                                           | A full application                   |
| Open-Sourced                                        | A database                           |
| Accessible through strict API                       | Able to act without interaction      |
| A set of rules enforced by consensus                | Able to draw data from the web arbitrarily |
| A function of its inputs                            |                                      |


Therefore, we have to make some considerations and alterations to what is allowed in a smart contract. We do not add any additional features to Python that make the code incompatible. Contracting is a strict subset.

## How Code Executes Usually
In Python, you write code, run it, and it executes. It is either something that happens in sequence and then finishes, or is a long running asynchronous application such as a web server that runs in an event loop and processes requests over a long period of time.

Smart contracts do neither of these things!

## How Smart Contract Code Executes
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

```txt
                                                    +----------------+
                                                    | Error returned |<------+
                                                    | to Executor    |       |
                                                    +----------------+       |
                                                        Module Loader        |
                                                    +----------------+       |
                                                    |     - - -      |       |
                                    Does this       |   -       -    |       |
  |-------------\                   smart contract  |   | - - - |    |       |
  | transaction  -\   +----------+  exist?          |   | state |-------No---+
  | submitted      -  | Executor |----------------->|    - - - -     |
  | to Executor  -/   +----------+                  |       |        |
  |-------------/                                   |      Yes       |
                                                    |       |        |
                                                    |       v        |
                                                    |   +-----+      |
                                                    |   |    |_\     |
                                                    |   |       |    |
                                                    |   |       |    |
                                                    |   |       |    |
                                                    |   +-------+    |
                                                    |       |        |
                         +----------------------+   +-------|--------+
                         |  Smart contract      |           |  
                         | returned to Executor |-----------+              
                         +----------------------+
```

Executor retrieves the module for the smart contract if it exists.

### Step 2: Execution
```txt
                                            +------------------------+
         +----------------------------------|  Error returned to     |<--------+ 
         |                                  |       Executor         |<-----+  |
         |                                  +------------------------+      |  |
         |                                         Python VM                |  |
         |                                  +--------------------------+    |  |
         |                                  |  +--------------------+  |    |  | 
         |                                  |  | Does the function  |----No-+  |
         |                                  |  |      exist?        |  |       |
         |                                  |  +--------------------+  |       |
         |                                  |            |             |       |
         |         Execute this function    |            v             |       |
         v         on this smart contract   |  +--------------------+  |       |
    +----------+   with these arguments     |  |   Are there enough |----No----+
    | Executor |--------------------------->|  |       stamps       |  |
    +----------+                            |  +--------------------+  |
         ^                                  |            |             |
         |                                  |            v             |
         |                                  |   +--------------------+ |                    
         |                                  |   |      Execute       | |                     
         |                                  |   +--------------------+ |
         |                                  +--------------------------+
         |                                                |
         |                                                |
         |    +------------------------+                  |
         +----| Results of Execution   |<-----------------+
              +------------------------+
```

The executor attempts to execute a function on the smart contract. If it fails due to Python errors or invalid inputs, the executor will get a response. Otherwise, the function is called and the results of the execution are returned to the executor and which can be passed to the operator.

## Post-Submission Code

The rest of the guide is about what code is valid for submission of a smart contract. Once the smart contract is submitted, functions will generally not fail unless the inputs throw assertion errors that are raised inside of the contracts themselves.

It is the job of the smart contract developer to test and confirm the functionality of their contract before submission. After it has been submitted, the contract cannot be changed.
