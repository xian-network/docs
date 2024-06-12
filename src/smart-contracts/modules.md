---
title: Modules
description: Modules available within the Contracting standard lib.
---

# {{$frontmatter.title}}

{{$frontmatter.description}}

## Crypto Standard Library

In this example, the verify_signature function is an exported function in a Xian smart contract. It takes a verification key (vk), a message (msg), and a signature (signature). It uses the verify function from the crypto module to check if the signature is valid for the given message and verification key. The result (True or False) is then returned. This can be used to ensure data integrity and authenticity in transactions within the smart contract environment.

This module uses the `PyNaCl` library under the hood, employing the `Ed25519` signature scheme.

```python
@export
def verify_signature(vk: str, msg: str, signature: str):
    # Use the verify function to check if the signature is valid for the given message and verification key
    is_valid = crypto.verify(vk, msg, signature)
    
    # Return the result of the verification
    return is_valid
```

## hashlib Standard Library

`hashlib` is an extremely small analog to the much more powerful Python hashlib equivalent. They do not share the same API. The Contracting version does not require setting up an object and updating it with bytes. The following functions are available on `hashlib`.

### hashlib.sha3(hex_str: str)

Accepts a valid hexidecimal string and returns a hexidecimal string representation of the SHA3 256 bit hash it produces. If the argument is not a valid hexidecimal string, it will encode the string to bytes and use that for the hash.

### hashlib.sha256(hex_str: str)

Equal functionality to `sha3` but uses the SHA2 256 hash instead. This cryptographic hashing algorithm is used in Bitcoin.

## random Standard Library

`random` is a pseudorandom number generator that derives a deterministic seed state from the current block number and block height. In Contracting, these environment variables are not automatically supplied. The `ContractingClient` also does not current have support for this feature, so you will have to automatically update your environment with a block height and hash that you would like to use.

Simply do the following:
```python
def random_contract():
	@export
	def uses_random_function():
		...

client = ContractingClient()
client.submit(random_contract)

rc = client.get_contract('random_contract')
rc.uses_random_function(environment={
	'block_height': 0,
	'block_hash': 'any_string'
	})
```

### random.seed()

This function is required to be run once per transaction. If it is not called, the contract will fail. You must seed every contract like so:

```python
random.seed()

@export
def random_one():
    ...

@export
def random_two():
    ...
```

### Available functions

Besides seeding, the rest of the module follows Python random 1:1. Here are the functions you can use and reference the [Python manual](https://docs.python.org/3.6/library/random.html) to read more about how each one behaves.

```python
random.shuffle(l: list)
random.getrandbits(k: int)
random.randrange(k: int)
random.randint(a: int, b: int)
random.choice(l: list)
random.choices(l: list, k: int)
```

## Storage
Contracting stores state in a key-value storage system where each smart contract has it's own data space that cannot be accessed by other smart contracts besides through the `@export` functions.

When you submit a smart contract, keys are created to store the code and compiled bytecode of the contract. For example:

```python
owner = Variable()

@construct
def seed():
    owner.set(ctx.caller)
```

When submitted will create the following in state space:

| Key                     | Value                              |
|-------------------------|------------------------------------|
| `contract.__compiled__` | Python Bytecode                    |
| `contract.__code__`     | Python Code                        |
| `contract.owner`        | `ctx.caller` at submission time    |

Storage follows a simple pattern such that each variable or hash stored is prefaced by the contract name and a period delimiter. If the variable has additional keys, they are appended to the end seperated by colons.

```
<contract_name>.<variable_name>
<contract_name>.<variable_name>:<key_0>:<key_1>:<key_2>...
```

### Encoding

Data is encoded as JSON in the state space. This means that you can store simple Python objects such as dictionaries, arrays, tuples, and even Datetime and Timedelta types (explained later.)

```python
player = Variable()
stats = {
	'name': 'Steve',
	'level': 100,
	'type': 'Mage',
	'health': 1000
}
player.set(stats)

steve = player.get()

steve['health'] -= 100
steve['health'] == 900 # True
```

```python
authorized_parties = Variable()
parties = ['steve', 'alex', 'stu', 'raghu', 'tejas']
authorized_parties.set(parties)

# This will fail if the contract sender isn't in the authorized parties list.
assert ctx.caller in authorized_parties.get()
```
### Storage Types

There are two types of storage: Variable and Hash. Variable only has a single storage slot. Hash allows for a dynamic amount of dimensions to be added to them. Hashes are great for data types such as balances or mappings.

```python
owner = Variable()
balances = Hash()

@export
def example():
    owner.set('hello')
    a = owner.get()

    balances['stu'] = 100
    a = balances['something']
```

### Variable API
```python
class Variable(Datum):
    def __init__(self, contract, name, driver: ContractDriver=driver, t=None):
        ...

    def set(self, value):
        ...

    def get(self):
        ...
```
#### \_\_init\_\_(self, contract, name, driver, t)
The \_\_init\_\_ arguments are automatically filled in for you during compilation and runtime. You do not have to provide any of them.

some_contract.py (Smart Contract)
```python
owner = Variable()
```

This translates into:
```python
owner = Variable(contract='some_contract', name='owner')
```

Driver is pulled from the Runtime (`rt`) module when the contract is being executed. If you provide a type to `t`, the Variable object will make sure that whatever is being passed into `set` is the correct type.

#### set(self, value)

some_contract.py (Smart Contract)
```python
owner = Variable()
owner.set('stu')
```

Executes on contract runtime and sets the value for this variable. The above code causes the following key/value pair to be written into the state.

| Key               | Value |
|-------------------|-------|
| some_contract.owner | stu   |

__NOTE:__ You have to use the `set` method to alter data. If you use standard `=`, it will just cause the object to be set to whatever you pass.

```python
owner = Variable()
owner
>> <Variable at 0x10577cda0>

owner = 5
owner
>> 5
```

#### get(self)

some_contract.py (Smart Contract)
```python
owner = Variable()
owner.set('stu')

owner.get() == 'stu' # True
```

Returns the value that is stored at this Variable's state location.

__NOTE:__ The converse applies to the `get` function. Simply setting a variable to the Variable object will just copy the reference, not the underlying data.

```python
owner = Variable()
owner.set('stu')
owner.get()
>> 'stu'

a = owner
a
>> <Variable at 0x10577cda0>
```

### Hash API

```python
class Hash(Datum):
    def __init__(self, contract, name, driver: ContractDriver=driver, default_value=None):
        ...

    def set(self, key, value):
        ...

    def get(self, item):
        ...

    def all(self, *args):
        ...

    def clear(self, *args):
       ...

    def __setitem__(self, key, value):
        ...

    def __getitem__(self, key):
        ...
```

#### \_\_init\_\_(self, contract, name, driver, default_value)

Similar to Variable's \_\_init\_\_ except that a different keyword argument `default_value` allows you to set a value to return when the key does not exist. This is good for ledgers or applications where you need to have a base value.

some_contract.py (Smart Contract)
```python
balances = Hash(default_value=0)
balances['stu'] = 1_000_000

balances['stu'] == 1_000_000 # True
balances['raghu'] == 0 # True
```

#### set(self, key, value)

Equivalent to Variable's `get` but accepts an additional argument to specify the key. For example, the following code executed would result in the following state space.

some_contract.py (Smart Contract)
```python
balances = Hash(default_value=0)
balances.set('stu', 1_000_000)
balances.set('raghu', 100)
balances.set('tejas', 777)
```

| Key                           | Value     |
|-------------------------------|-----------|
| `some_contract.balances:stu`  | 1,000,000 |
| `some_contract.balances:raghu`| 100       |
| `some_contract.balances:tejas`| 777       |

#### Multihashes

You can provide an arbitrary number of keys (up to 16) to `set` and it will react accordingly, writing data to the dimension of keys that you provided. For example:

subaccounts.py (Smart Contract)
```python
balances = Hash(default_value=0)
balances.set('stu', 1_000_000)
balances.set(('stu', 'raghu'), 1_000)
balances.set(('raghu', 'stu'), 555)
balances.set(('stu', 'raghu', 'tejas'), 777)
```

This will create the following state space:

| Key                                  | Value     |
|--------------------------------------|-----------|
| `subaccounts.balances:stu`           | 1,000,000 |
| `subaccounts.balances:stu:raghu`     | 1,000     |
| `subaccounts.balances:raghu:stu`     | 555       |
| `subaccounts.balances:stu:raghu:tejas` | 777     |

#### get(self, key)

Inverse of `set`, where the value for a provided key is returned. If it is `None`, it will set it to the `default_value` provided on initialization.

some_contract.py (Smart Contract)
```python
balances = Hash(default_value=0)
balances.set('stu', 1_000_000)
balances.set('raghu', 100)
balances.set('tejas', 777)

balances.get('stu') == 1_000_000 # True
balances.get('raghu') == 100 # True
balances.get('tejas') == 777 # True
```

The same caveat applies here 

#### Multihashes
Just like `set`, you retrieve data stored in multihashes by providing the list of keys used to write data to that location. Just like `get` with a single key, the default value will be returned if no value at the storage location is found.

subaccounts.py (Smart Contract)
```python
balances = Hash(default_value=0)
balances.set('stu', 1_000_000)
balances.set(('stu', 'raghu'), 1_000)
balances.set(('raghu', 'stu'), 555)
balances.set(('stu', 'raghu', 'tejas'), 777)

balances.get('stu') == 1_000_000 # True
balances.get(('stu', 'raghu')) == 1_000 # True
balances.get(('raghu', 'stu')) == 555 # True
balances.get(('stu', 'raghu', 'tejas')) == 777 # True

balances.get(('stu', 'raghu', 'tejas', 'steve')) == 0 # True
```

__NOTE:__ If storage returns a Python object or dictionary, modifications onto that dictionary will __not__ be synced to storage until you set the key to the altered value again. This is vitally important.
```python
owner = Hash(default_value=0)
owner.set('stu') = {
	'complex': 123,
	'object': 567
}

d = owner.get('stu') # Get the dictionary from storage
d['complex'] = 999 # Set a value on the retrieved dictionary
e = owner.get('stu') # Retrieve the same value for comparison

d['complex'] == e['complex'] # False
```

```python
owner = Hash(default_value=0)
owner.set('stu') = {
	'complex': 123,
	'object': 567
}

d = owner.get('stu') # Get the dictionary from storage
d['complex'] = 999 # Set a value on the retrieved dictionary

owner.set('stu', d) # Set storage location to the modified dictionary

e = owner.get('stu') # Retrieve the same value for comparison

d['complex'] == e['complex'] # True!
```


#### \_\_setitem\_\_(self, key, value):
Equal functionality to `set`, but allows slice notation for convenience. __This is less verbose and the preferred method of setting storage on a Hash.__

subaccounts.py (Smart Contract)
```python
balances = Hash(default_value=0)
balances['stu'] = 1_000_000
balances['stu', 'raghu'] = 1_000
balances['raghu', 'stu'] = 555
balances['stu', 'raghu', 'tejas'] = 777
```

__NOTE:__ The problem that occurs with Variable's set does not occur with Hashes.
```python
owner = Hash(default_value=0)
owner['stu'] = 100
owner['stu']
>> 100
```

#### \_\_getitem\_\_(self, key):
Equal functionality to `set`, but allows slice notation for convenience. __This is less verbose and the preferred method of setting storage on a Hash.__

subaccounts.py (Smart Contract)
```python
balances = Hash(default_value=0)
balances['stu'] = 1_000_000
balances['stu', 'raghu'] = 1_000
balances['raghu', 'stu'] = 555
balances['stu', 'raghu', 'tejas'] = 777

balances['stu'] == 1_000_000 # True
balances['stu', 'raghu'] == 1_000 # True
balances['raghu', 'stu'] == 555 # True
balances['stu', 'raghu', 'tejas'] == 777 # True

balances['stu', 'raghu', 'tejas', 'steve'] == 0 # True
```

#### all(self, \*args):

Returns all of the values in a particular hash. For multihashes, it returns all values in that 'subset' of hashes. Assume the following state space:

| Key                              | Value     |
|----------------------------------|-----------|
| `subaccounts.balances:stu`       | 1,000,000 |
| `subaccounts.balances:stu:raghu` | 1,000     |
| `subaccounts.balances:stu:tejas` | 555       |
| `subaccounts.balances:raghu`     | 777       |
| `subaccounts.balances:raghu:stu` | 10,000    |
| `subaccounts.balances:raghu:tejas` | 100,000  |


```python
balances.all()
>> [1000000, 1000, 555, 777, 10000, 100000]

balances.all('raghu')
>> [777, 10000, 100000]
```


#### clear(self, \*args)

Clears an entire hash or a section of a hash if the list of keys are provided. Assume the same state space:

| Key                                | Value     |
|------------------------------------|-----------|
| `subaccounts.balances:stu`         | 1,000,000 |
| `subaccounts.balances:stu:raghu`   | 1,000     |
| `subaccounts.balances:stu:tejas`   | 555       |
| `subaccounts.balances:raghu`       | 777       |
| `subaccounts.balances:raghu:stu`   | 10,000    |
| `subaccounts.balances:raghu:tejas` | 100,000   |


```python
balances.clear('stu')
balances.all() # None of Raghu's accounts are affected
>> [777, 10000, 100000]
```

```python
balances.clear()
balances.all() # All entries have been deleted
>> []
```

## datetime Standard Library

Every contract has a special `datetime` library available to it that mimicks some of the functionality of the Python equivalent. The following objects and constants are available:

### datetime.Datetime

```python
d = datetime.datetime(year, month, day, hour=0, minute=0, microsecond=0)
```

`datetime` is a pretty close mapping to the Python Datetime object. It requires the year, month, and day at the very least to initialize. All times are in UTC+0.

#### Comparisons

A valid `Datetime` comparison takes another `Datetime` on the right side of the comparison. All comparisons return `True` or `False`.

```python
d1 = datetime.datetime(year=2019, month=10, day=10)
d2 = datetime.datetime(year=2019, month=10, day=11)

# LESS THAN
d1 > d2 # False
d1 >= d2 # False

# GREATER THAN
d1 < d2 # True
d1 <= d2 # True

# EQUALITY
d1 == d2 # False
d1 != d2 # True
```

#### Operations

There are only two valid operations for `Datetime`. Addition takes a `Timedelta` and returns a new `Datetime` while subtraction takes another `Datetime` and returns a `Timedelta`.

_Use addition to add an interval of time to a `Datetime`._

_Use subtraction to calculate the interval of time between two `Datetime` objects._

```python
d = datetime.datetime(year=2019, month=10, day=10)
t = datetime.timedelta(days=1)

# ADDITION
new_d = d + t # Returns new Datetime
expected_new_d = datetime.datetime(year=2019, month=10, day=11)

new_d == expected_new_d # True

# SUBTRACTION
new_t = new_d - d # Returns a timedelta. Should reverse the above operation

new_t == t # True

# STRING TO DATETIME

date_string = "2019-10-10 10:10:10"
datetime_from_str = datetime.datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S")
```
### datetime.timedelta

```python
t = datetime.timedelta(weeks=0, days=0, hours=0, minutes=0, seconds=0)
```

`Timedelta` is also a pretty close mapping to Python's own Timedelta object. It represents an interval of time which can be used to determine expiration dates, etc.

For example, if a transaction occurs on a smart contract 2 weeks after it has been initialized, the transactino can fail. If the transaction occurs within the 2 week interval, it would succeed.

#### Comparisons

Comparisons are between two `Timedelta` objects.

```python
t1 = datetime.timedelta(weeks=1, days=1, hours=2)
t2 = datetime.timedelta(weeks=1, days=1, hours=3)

# LESS THAN
t1 > t2 # False
t1 >= t2 # False

# GREATER THAN
t1 < t2 # True
t1 <= t2 # True

# EQUALITY
t1 == t2 # False
t1 != t2 # True
```

#### Operations

`Timedelta` operations are between other `Timedeltas`, and in one case, `int`. `Timedelta` supports addition, subtraction, and multiplication.

_While it's technically possible to multiply `Timedelta` objects, it can produce strange results._

```python
t1 = datetime.timedelta(weeks=1)
t2 = datetime.timedelta(weeks=2)

t3 = t1 + t2
t3 == datetime.timedelta(weeks=3) # True

t4 = t2 - t1
t4 == datetime.timedelta(weeks=1) # True

t5 = t1 * 5
t5 == datetime.timedelta(weeks=5) # True

t6 = t1 * t2
t6 == datetime.timedelta(weeks=14) # True
```

### Constants

The following `Timedelta` constants are available for you to use.

```python
datetime.WEEKS   == datetime.timedelta(weeks=1)   # True
datetime.DAYS    == datetime.timedelta(days=1)    # True
datetime.HOURS   == datetime.timedelta(hours=1)   # True
datetime.MINUTES == datetime.timedelta(minutes=1) # True
datetime.SECONDS == datetime.timedelta(seconds=1) # True
```

### Now
In the Xian blockchain, a special variable called `now` is passed into the execution environment. Contracting on its own does not have this variable available. You would have to add it into the environment yourself.

If you always use the `ContractingClient` object you will not have to worry about this problem. The `ContractingClient` adds a `now` variable if you execute functions on an `AbstractContract` that is pulled from the state space.

However, if you use the raw `Executor` object, `now` will not be available. Proceed accordingly.

`now` is a `Datetime` object for when the block that the transaction is in has been submitted to the executors.

```python
EXPIRATION = datetime.timedelta(days=5)
submission_time = Variable()

@construct
def set_submission_time():
    submission_time.set(now) # Set's variable to when contract was submitted

@export
def has_expired():
    if now - submission_time.get() > EXPIRATION:
        return True
    return False
```

The above contract uses `now` in two distinct ways. First, it captures `now` when the contract is submitted and stored it into the state. Second, it references `now`, which will be the current time on subsequent contract executions, and compares it against the original `Datetime` stored.

If the result is greater than the expiration provided as a constant, the contract returns true.
