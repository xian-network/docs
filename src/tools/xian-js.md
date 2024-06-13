---
title: xian-js
description: xian-js is a JavaScript / Typescript library for interacting with the Xian network.
---

# {{$frontmatter.title}}

{{$frontmatter.description}}

### Installation

`npm install xian-js`

### Wallet Functions

#### Create a Xian Keypair

```typescript
import Xian from "xian-js"

// Create a new wallet
const new_wallet = Xian.Wallet.new_wallet()

console.log(new_wallet)

>>  {
        vk: "ea2cee33f9478d767d67afe345592ef36446ee04f8d588fa76942e6569a53298",
        sk: "69a8db3fb7196debc2711fad1fa1935918d09f5d8900d84c3288ea5237611c03"
    }
```


### Create a new BIP39 / BIP 32 compatible wallet
- **BIP39** = 24 word mnemonic
- **BIP32** = derivation path

```javascript
let new_wallet_bip39 = Xian.Wallet.new_wallet_bip39()

console.log(new_wallet_bip39)
>> {
       sk: 'a6b72cb3d1160c26f9f39a8f1d4a3c7c0da2ac59d193b66ac5f919ec77f28915',
       vk: '53d016586ce35c5f6ea581cadf4693dd2850621dfad6a2261e8dd311c83e11d5',
       derivationIndex: 0,
       seed: '3626c59ee5bce833a8bf5024645eb10415b39c6f9fd0ff0fb1b00b8ca9fd6ff4b8a0ed7077296cdaff1b955f03318f244dfd3fead404d93f11a3f301c0e3e1c6',
       mnemonic: 'evidence rifle behave normal duty mean junk chicken salute relief raw chunk region ocean guard swarm taste toy loop ozone spell crumble apart echo'
   }

```

### Create a wallet from sk (private key)

```javascript
const sk = 'a6b72cb3d1160c26f9f39a8f1d4a3c7c0da2ac59d193b66ac5f919ec77f28915'

const wallet = Xian.Wallet.create_wallet({sk})

console.log(wallet)

>> {
       sk: 'a6b72cb3d1160c26f9f39a8f1d4a3c7c0da2ac59d193b66ac5f919ec77f28915',
       vk: '53d016586ce35c5f6ea581cadf4693dd2850621dfad6a2261e8dd311c83e11d5',
       derivationIndex: 0,
       seed: null,
       mnemonic: null
   }

```
### Restore a  BIP39 / BIP 32 compatible wallet
- **BIP39** = 24 word mnemonic
- **BIP32** = derivation path

```javascript
const seed = '3626c59ee5bce833a8bf5024645eb10415b39c6f9fd0ff0fb1b00b8ca9fd6ff4b8a0ed7077296cdaff1b955f03318f244dfd3fead404d93f11a3f301c0e3e1c6'
const derivationIndex = 0;
let wallet = Xian.Wallet.new_wallet_bip39(seed, derivationIndex)

console.log(wallet)
>> {
       sk: 'a6b72cb3d1160c26f9f39a8f1d4a3c7c0da2ac59d193b66ac5f919ec77f28915',
       vk: '53d016586ce35c5f6ea581cadf4693dd2850621dfad6a2261e8dd311c83e11d5',
       derivationIndex: 0,
       seed: null,
       mnemonic: null
   }
```


### Get a public key (vk) from a private key (sk)
Takes the sk as an argument and returns the vk
```javascript
let sk = "69a8db3fb7196debc2711fad1fa1935918d09f5d8900d84c3288ea5237611c03"
let vk = wallet.get_vk(sk)

console.log(vk)
>> 'ea2cee33f9478d767d67afe345592ef36446ee04f8d588fa76942e6569a53298'
```

### Sign a message
Signs a string payload
```javascript
const stringBuffer = Buffer.from('message')
let messageBytes = new Uint8Array(stringBuffer);
let sk = "69a8db3fb7196debc2711fad1fa1935918d09f5d8900d84c3288ea5237611c03"

let signedMessage = wallet.sign(sk, messageBytes)

console.log(signedMessage)
>> '982c204fe88e620f3319558aa6b11f9d8be75b99b3199f434f5edf2834a9c52059ba4ea3d623ac1d550170e532e919c364aad1333f757f8f22e0355cb1dd8c09'
```

#### Verify signature
verify a payload
```javascript
let validSignature = wallet.verify(vk, messageBytes, signedMessage)

console.log(validSignature)
>> true
```

## Create a Xian Transaction
Public Testnet masternode host is `https://testnet.xian.org`

Use `Xian.TransactionBuilder(network_info, tx_info)` to create a new Xian transaction.

### Create network_info object
create an object that describes the masternode/network that you are going to send the transcation to.
```typescript

let network_info: I_NetworkSettings = {
    chain_id: "xian-testnet-2",
    type: "testnet", // or "mainnet"
    masternode_hosts: ["https://testnet.xian.org"]
};
```

```typescript
// Sender and Receiver public keys
let senderVk = "ea2cee33f9478d767d67afe345592ef36446ee04f8d588fa76942e6569a53298"
let receiverVk = "bb0fab41b9118f0afdabf3721fa9a6caae3c93845ed409d3118841065ad1a197"

// Kwargs are the arugments you will send the contract method.  
// For example the "currency" contract's "transfer" method needs two arguments to create a transfter; the person reciving the XIAN and the amount to transfer.  So we create a kwargs object like so.
let kwargs = {
        to: receiverVk,
        amount: 1000
}

let txInfo: I_TxInfo = {
    senderVk,
    contractName: "currency",
    methodName: "transfer",
    kwargs,
    stampLimit: 50000, // Max stamps to be used. Could use less, won't use more.
}
```

### Create transaction
```javascript
let tx = new Xian.TransactionBuilder(networkInfo, txInfo)
```

### Send transaction
```typescript
let senderSk = "69a8db3fb7196debc2711fad1fa1935918d09f5d8900d84c3288ea5237611c03"

const res = await tx.send(senderSk)
