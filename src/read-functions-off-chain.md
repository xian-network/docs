# Read Functions Off-Chain

This document explains how to execute read functions (i.e. view or simulated transactions) to retrieve computed data from a smart contract without incurring transaction fees.

## Overview

In many blockchain environments, you can simulate transactions or call "read" functions to obtain data from a smart contract. This method avoids sending an on-chain transaction and therefore is free. The example below demonstrates how to read the balance for a specific address by calling the `balance_of` function of a contract.

The process works as follows:

1. **Payload Construction:**  
   A payload is constructed with:
   - **sender:** The caller's address.
   - **contract:** The target smart contract address.
   - **function:** The name of the function to be executed (`balance_of`).
   - **kwargs:** A JSON object with the function arguments (in this case, the `address` to check).

2. **Encoding:**  
   The payload is converted into a JSON string, encoded into bytes, and then converted to a hexadecimal string.

3. **RPC Query:**  
   The hex-encoded payload is appended to the RPC URL path for a simulated transaction query (using `https://node.xian.org/abci_query?path="/simulate_tx/<hex>"`).

4. **Response Handling:**  
   The response is received in Base64 encoding. It is then decoded

## Code Example

```javascript
async function execute_balance_of(contract, address) {
  let payload = {
    "sender": "",
    "contract": contract,
    "function": "balance_of",
    "kwargs": {
      "address": address
    }
  };
  let bytes = new TextEncoder().encode(JSON.stringify(payload));
  let hex = toHexString(bytes);
  let response = await fetch('https://node.xian.org/abci_query?path="/simulate_tx/' + hex + '"');
  let data = await response.json();
  let decoded = atob(data.result.response.value);
  result_decoded = JSON.parse(decoded)["result"];
  return result_decoded;
}
