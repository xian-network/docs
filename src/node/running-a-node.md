# Operating Instructions

## Types of Nodes

Xian Network has **3 types of nodes**

::: tip Validator Nodes

* Validators are responsible for creating & validating blocks.
* A block is considered valid when **75%** of validators vote for a block.
:::

::: tip Full Nodes

* Full nodes keep a copy of the entire history & state of the blockchain.
* They are a key component to keeping the network healthy.

:::

::: tip Blockchain Data Service Nodes

Blockchain Data Service (`BDS`) nodes improve developer experience by providing : 
- Rich data & querying via REST & Websocket interfaces
- Stamp estimation, allowing a dAPP to know how many `stamps` a transaction will cost before submitting it to the network.
- A Validator __cannot__ also be a `BDS`
- Xian provides access to service nodes free of charge, although this service may be limited in the future, depending on use.
:::

## Recommended Server Specs
::: tip Server Specs
*These specs are subject to change depending on network growth & use.*

| Node Type            | RAM  | SSD   | CPU      |
|----------------------|------|-------|----------|
| Validator / Full Node| 8GB  | 256GB | 4 Cores  |
| BDS                  | 8GB  | 512GB | 4 Cores  |
- **OS** : Ubuntu 24.02
- **Architecture** : Intel / AMD x86
:::

## Generate a wallet.

- Create a wallet using the <a href="/tools/browser-wallet" target="_blank">browser wallet</a>
- Export the private key
    - Click `Settings`
    - Click `Export Private Key`

## Install prerequisites

1. Install make
```bash
sudo apt update
sudo apt install make
```
2. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
rm get-docker.sh
```

## Install Xian & Configure Node
### Install
```bash
git clone https://github.com/xian-network/xian-stack.git
cd xian-stack
make setup CORE_BRANCH=<branch-name> CONTRACTING_BRANCH=<branch-name>
# for RCNet, use `make setup CORE_BRANCH=rcnet CONTRACTING_BRANCH=rcnet`
# for Testnet, use `make setup CORE_BRANCH=devnet CONTRACTING_BRANCH=devnet`
```

### Build
* For a Validator / Regular Full-Node
```bash
make core-build
make core-up
make init
make configure CONFIGURE_ARGS='--moniker <your-moniker> --genesis-file-name genesis-rcnet.json --validator-privkey <priv-key> --seed-node 188.68.33.32 --copy-genesis'

```
* For a Blockchain Data Service Node
```bash
make core-bds-build
make core-bds-up
make init
make configure CONFIGURE_ARGS='--moniker <your-moniker> --genesis-file-name genesis-rcnet.json --validator-privkey <priv-key> --seed-node 188.68.33.32 --copy-genesis --service-node'
```

## Starting the Validator Node
* Headless Mode
```bash
make up
```
* Interactive Shell
```bash
make core-shell
make up
```

## Starting the Full Node / BDS
* Headless Mode
```bash
make up
```
* Interactive Shell
```bash
make core-bds-shell
make up-bds
```

* When finished
```bash
exit
```

## Viewing Logs
```bash
make core-shell
pm2 logs
```
* When finished
```bash
exit
```

## Stopping the node
* Headless mode
```bash
make down
```
* From Container Shell
```bash
make down
```

## Shutting down the node container
* Needed if rebuilding the container
```bash
make core-down
# or
make core-bds-down
```