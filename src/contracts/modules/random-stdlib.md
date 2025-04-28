
# random Standard Library

`random` is a pseudorandom number generator that derives a deterministic seed state from the current block number and block hash. In Contracting, these environment variables are not automatically supplied. The `ContractingClient` also does not current have support for this feature, so you will have to automatically update your environment with a block height and hash that you would like to use.

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

## random.seed()

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

## Available functions

Besides seeding, the rest of the module follows Python random 1:1. Here are the functions you can use and reference the [Python manual](https://docs.python.org/3.6/library/random.html) to read more about how each one behaves.

```python
random.shuffle(l: list)
random.getrandbits(k: int)
random.randrange(k: int)
random.randint(a: int, b: int)
random.choice(l: list)
random.choices(l: list, k: int)
```

## Limitations and Security Considerations

### Deterministic Randomness
Random outputs are seeded from publicly available data (`block_num`, `block_hash`).  
This means that while outputs appear random, they can be predicted if an attacker knows the block information.

### Front-Running Risk
A malicious actor could theoretically reproduce the random outputs off-chain and attempt to front-run transactions to achieve favorable outcomes.  
This is very difficult and unlikely for most applications but must be considered if randomness security is critical.

### Not Cryptographically Secure
Do not use `random` for generating secrets, encryption keys, or in scenarios where truly unpredictable randomness is required.

### Best Use Cases
Randomization for gaming, raffles, randomized shuffles, or non-critical randomized operations.
