# Your First Smart Contract on Xian

Build a **real‑world smart contract** end‑to‑end, and ship it with **automated tests**.
This guide uses the same **Savings Vault** contract we have on our homepage.
It lets users **deposit** and **withdraw** the network’s main currency (Check [Dynamic Imports](https://docs.xian.org/contracts/modules/imports#dynamic-imports) for more dynamic approach), while tracking individual balances.
This pattern fits custodial wallets, DeFi vaults, staking contracts, and more.
> **Why this first?** It shows core Xian patterns (state variables, external calls, assertions) without requiring complex business logic.

## Prerequisites

- Python 3.11 (exact version recommended)
- `xian-contracting` library (local runner & linter)
- Optional: `pytest` for tests

```bash
pip install git+https://github.com/xian-network/xian-contracting pytest
```

> You don’t need a node. Everything runs locally in an in‑memory sandbox via `ContractingClient`.

## Contract: `con_safe.py`

```python
import currency  # currency is the network's main token

safe = Hash(default_value=0)

@export
def deposit(amount: float):
    currency.transfer_from(
        amount=amount,
        to=ctx.this,
        main_account=ctx.caller,
    )
    safe[ctx.caller] += amount

@export
def withdraw(amount: float):
    assert safe[ctx.caller] >= amount, 'insufficient funds'
    currency.transfer(amount=amount, to=ctx.caller)
    safe[ctx.caller] -= amount


@export
def get_balance(account: str):
    return safe[account]
```

> **Behavior**
> - `deposit`: Pulls `amount` of the main currency from the caller into the contract (requires caller to `approve` this contract as spender), then credits their internal balance in `safe`.
> - `withdraw`: Checks the caller’s internal balance and sends funds back.
> - `get_balance`: Read helper to check an account’s internal balance.

## Local demo (no chain required)

The following script spins up an in‑memory sandbox with `ContractingClient`, deploys a minimal **currency stub** for tests, deploys `con_safe`, then exercises deposit/withdraw flows.

> We vend a small `currency` stub in tests because the real system contract isn’t present in the local sandbox by default. The stub implements `mint`, `approve`, `transfer`, and `transfer_from` with the expected semantics.

### `con_currency_stub.py`

```python
# Minimal currency stub for local tests
balances = Hash(default_value=0)
approvals = Hash(default_value=0)  # (owner, spender) -> amount

@export
def mint(amount: float, to: str):
    balances[to] += amount

@export
def balance_of(account: str):
    return balances[account]

@export
def approve(amount: float, to: str):
    approvals[ctx.caller, to] = amount

@export
def transfer(amount: float, to: str):
    assert balances[ctx.caller] >= amount, 'insufficient funds'
    balances[ctx.caller] -= amount
    balances[to] += amount

@export
def transfer_from(amount: float, to: str, main_account: str):
    allowed = approvals[main_account, ctx.caller] or 0
    assert allowed >= amount, 'not approved'
    assert balances[main_account] >= amount, 'insufficient funds'
    approvals[main_account, ctx.caller] = allowed - amount
    balances[main_account] -= amount
    balances[to] += amount
```

### `demo_safe.py`

```python
import os, sys
from contracting.client import ContractingClient

# cd to this file's directory so relative paths work
script_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
os.chdir(script_dir)

c = ContractingClient()
c.flush()

# 1) Load currency stub as 'currency'
with open('con_currency_stub.py', 'r', encoding='utf-8') as f:
    c.submit(f.read(), name='currency')

currency = c.get_contract('currency')

# 2) Deploy the vault
with open('con_safe.py', 'r', encoding='utf-8') as f:
    c.submit(f.read(), name='con_safe')
safe = c.get_contract('con_safe')

# 3) Mint some stub currency to a alice
currency.mint(amount=10_000, to='alice')
print('currency[alice] =', currency.balance_of(account='alice'))

# 4) Deposit & withdraw
# Approve is needed because safe.deposit calls currency.transfer_from
# which requires approval from alice to con_safe
currency.approve(amount=200, to='con_safe', signer='alice')
safe.deposit(amount=200, signer='alice')
print('safe[alice] =', safe.get_balance(account='alice')) # Should be 200

safe.withdraw(amount=50, signer='alice')
print('safe[alice] =', safe.get_balance(account='alice')) # Should be 150

```

Run the demo:

```bash
pip install git+https://github.com/xian-network/xian-contracting pytest
python demo_safe.py
```

## Tests (pytest)

Create a full test suite to lock in behavior and guard against regressions.

### `test_con_safe.py`

```python
import os
from pathlib import Path
import pytest
from contracting.client import ContractingClient

HERE = Path(__file__).resolve().parent

CURRENCY_PATH = HERE / "con_currency_stub.py"
SAFE_PATH = HERE / "con_safe.py"

@pytest.fixture
def client():
    c = ContractingClient()
    c.flush()
    # Load stub currency as 'currency'
    with open(CURRENCY_PATH, "r", encoding="utf-8") as f:
        c.submit(f.read(), name="currency")
    # Load the vault
    with open(SAFE_PATH, "r", encoding="utf-8") as f:
        c.submit(f.read(), name="con_safe")
    return c

@pytest.fixture
def currency(client):
    return client.get_contract("currency")

@pytest.fixture
def safe(client):
    return client.get_contract("con_safe")

def test_deposit_and_withdraw_happy_path(client, currency, safe):
    # mint and approve
    currency.mint(amount=10_000, to="alice")
    assert currency.balance_of(account="alice") == 10_000

    currency.approve(amount=300, to="con_safe", signer="alice")

    # deposit 200
    safe.deposit(amount=200, signer="alice")
    assert safe.get_balance(account="alice") == 200
    assert currency.balance_of(account="alice") == 9_800
    assert currency.balance_of(account="con_safe") == 200

    # withdraw 50
    safe.withdraw(amount=50, signer="alice")
    assert safe.get_balance(account="alice") == 150
    assert currency.balance_of(account="alice") == 9_850
    assert currency.balance_of(account="con_safe") == 150

def test_withdraw_rejects_overdraft(client, currency, safe):
    currency.mint(amount=100, to="bob")
    currency.approve(amount=100, to="con_safe", signer="bob")
    safe.deposit(amount=60, signer="bob")
    assert safe.get_balance(account="bob") == 60

    # Over-withdraw should raise from the contract assert
    with pytest.raises(AssertionError):
        safe.withdraw(amount=120, signer="bob")

    # State unchanged
    assert safe.get_balance(account="bob") == 60
    assert currency.balance_of(account="bob") == 40
    assert currency.balance_of(account="con_safe") == 60

def test_deposit_requires_approval(client, currency, safe):
    currency.mint(amount=50, to="carol")
    # No approval: deposit should assert (inside currency.transfer_from via vault.deposit)
    with pytest.raises(AssertionError):
        safe.deposit(amount=30, signer="carol")

    # Balances unchanged
    assert currency.balance_of(account="carol") == 50
    assert currency.balance_of(account="con_safe") == 0
    assert safe.get_balance(account="carol") == 0


if __name__ == "__main__":
    pytest.main([__file__])
```

Run tests:

```bash
pip install git+https://github.com/xian-network/xian-contracting pytest
pytest -q
```

---

## Production tips

- **Use tight assertions:** consider rejecting non‑positive `amount` via `assert amount > 0`.
- **Events:** emit events on deposit/withdraw to aid indexers and activity feeds.
- **Caps & fees:** production vaults often add per‑tx caps, pause switches, or fees; write tests first.

You now have a clean, reusable **Savings Vault** with realistic tests you can run locally. You can now deploy it to a testnet or mainnet using the Xian Wallet. Additionally, you can now build a [Web dApp UI](https://docs.xian.org/dapp-starters) to interact with it or use advanced transactions to interact with it in the wallet.

