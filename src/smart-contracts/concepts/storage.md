## Storage Key Patterns

Xian uses a key-value store for contract state. Keys follow specific patterns to maintain organization and prevent collisions between contracts.

### Basic Pattern
All keys are prefixed with the contract name:
```python
# Basic pattern
<contract_name>.<variable_name>

# Example with Variable
token_name = Variable()
# Stored as: con_token.token_name

# Example with Hash 
balances = Hash()
balances['alice'] = 100
# Stored as: con_token.balances:alice
```

### Hash Storage
Hash keys support multiple dimensions separated by colons:
```python
# Single dimension
balances['alice'] = 100
# Stored as: con_token.balances:alice

# Multiple dimensions  
allowances['alice', 'bob'] = 500
# Stored as: con_token.balances:alice:bob

# Max 16 dimensions allowed
complex_data['user', 'game', 'inventory', 'weapons'] = {...}
# Stored as: con_token.complex_data:user:game:inventory:weapons
```

### System Keys
Contracts have special system keys for code and metadata:
```python
# Contract source code
<contract_name>.__code__

# Compiled bytecode
<contract_name>.__compiled__

# Contract owner (if set)
<contract_name>.__owner__

# Contract submission time
<contract_name>.__submitted__
```

### Limitations

* Total key length must be under 1024 bytes
* Hash keys limited to 16 dimensions
* Keys cannot contain periods (.) or colons (:) as these are delimiters
* Variable/Hash names cannot start with double underscore (__)
