# Submitting a Contract

## Using Python
:::tip Using the `xian-py` library
[xian-py](/tools/xian-py)

```python
from xian_py.wallet import Wallet
from xian_py.xian import Xian


with open('./contracts/con_uberdice.py', 'r') as file:
    code = file.read()

# Give your contract a name to be submitted as, must start with `con_`
contract_name = 'con_my_cool_contract'

wallet = Wallet('<wallet_private_key>')
xian = Xian('https://testnet.xian.org', wallet=wallet)

# Constructor arguments // do not include in `submit_contract`
# if the seed() function has no arguments in your contract.
arguments = {
    'some_arg': '12345'
}

# Deploy contract to network and pass arguments to it
submit = xian.submit_contract(
    contract_name,
    code,
    # args=arguments
)

print(f'success: {submit["success"]}')
print(f'tx_hash: {submit["tx_hash"]}')
print(f'view tx in explorer: https://explorer.xian.org/tx/{submit["tx_hash"]}')
```
:::

## Using Javascript / Typescript

:::tip Using the `xian-js` library
[xian-js](/tools/xian-js)

```typescript
import Xian from "xian-js";
import type { I_NetworkSettings, I_TxInfo } from "xian-js";

const hosts = [
    "https://testnet.xian.org",
]

let network_info: I_NetworkSettings = {
    chain_id: "xian-testnet-5",
    masternode_hosts: hosts
};

const masternode_api = new Xian.MasternodeAPI(network_info);

// let seed_wallet = Xian.Wallet.create_wallet();
let wallet = Xian.Wallet.create_wallet({ sk: "<your_private_key>" });

const code = `
# LST001
balances = Hash(default_value=0)

# LST002
metadata = Hash()

@construct
def seed():
    # LST001 - MINT SUPPLY to wallet that submits the contract
    balances[ctx.caller] = 1_000_000

    # LST002
    metadata['token_name'] = "Rocketswap Test Token"
    metadata['token_symbol'] = "RSWP"
    # metadata['token_logo_url'] = 'https://some.token.url/test-token.png'
    metadata['operator'] = ctx.caller

# LST002
@export
def change_metadata(key: str, value: Any):
    assert ctx.caller == metadata['operator'], 'Only operator can set metadata!'
    metadata[key] = value

...
`

let tx_info: I_TxInfo = {
    senderVk: wallet.vk,
    chain_id: network_info.chain_id,
    contractName: "submission",
    methodName: "submit_contract",
    kwargs: {
        name: `con_my_cool_token`,
        code: code
    }
};
const tx = new Xian.TransactionBuilder(network_info, tx_info);
const send_res = await tx.send(wallet.sk)
console.log({send_res})


```
:::

## Using Telegram

:::tip Using the Xian Network Bot
- Simply drop your file into a chat where the bot (`@xian_network_bot`) is, or in DM.
- The bot can be found in the [Xian Network group](https://t.me/xian_network).
- The bot will send a message back with a link to the transaction in the explorer.
<div style="text-align: center; height: 70%; width: 100%; padding: 5%">
<img src="./submitting-a-contract-tg.png" alt="Submitting a contract through the Xian Network Bot" />
</div>
:::

## Browser Wallet

:::tip Using the Browser Wallet IDE
Installation info @ [Browser Wallet](/tools/browser-wallet)
- Paste your contract code into the IDE.
- Hit "Deploy Contract" to submit your contract to the network.
- Once submitted, you can view your transaction in the explorer.
<div style="text-align: center; height: 70%; width: 100%; padding: 5%">
<img src="./submitting-a-contract-browser-ide.png" alt="Submitting a contract through the Browser Wallet IDE" />
</div>

:::
