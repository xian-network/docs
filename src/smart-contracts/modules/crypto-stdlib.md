# Crypto Standard Library

In this example, the `verify_signature` function is an exported function in a Xian smart contract. It takes a verification key `vk`, a message `msg`, and a signature `signature`. It uses the `verify` function from the crypto module to check if the signature is valid for the given message and verification key. The result (True or False) is then returned. This can be used to ensure data integrity and authenticity in transactions within the smart contract environment.

This module uses the `PyNaCl` library under the hood, employing the `Ed25519` signature scheme.

```python
@export
def verify_signature(vk: str, msg: str, signature: str):
    # Use the verify function to check if the signature is valid for the given message and verification key
    is_valid = crypto.verify(vk, msg, signature)
    
    # Return the result of the verification
    return is_valid
```

:::tip Additional methods for signing & verifying messages off-chain can be found in  :
- [xian-js](/tools/xian-js#sign-a-message)
- [xian-py](/tools/xian-py#sign-message-with-private-key)
:::
