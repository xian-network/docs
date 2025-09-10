# tests/test_con_safe.py
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

def _safe_balance(client, safe, account: str) -> float:
    # Prefer the contract's read helper if present; fallback to raw state
    try:
        return safe.get_balance(account=account)
    except Exception:
        v = client.get_var("con_safe", "safe", account)
        return v or 0

def _cur_balance(client, currency, account: str) -> float:
    try:
        return currency.balance_of(account=account)
    except Exception:
        v = client.get_var("currency", "balances", account)
        return v or 0

def test_deposit_and_withdraw_happy_path(client, currency, safe):
    # mint and approve
    currency.mint(amount=10_000, to="alice")
    assert _cur_balance(client, currency, "alice") == 10_000

    currency.approve(amount=300, to="con_safe", signer="alice")

    # deposit 200
    safe.deposit(amount=200, signer="alice")
    assert _safe_balance(client, safe, "alice") == 200
    assert _cur_balance(client, currency, "alice") == 9_800
    assert _cur_balance(client, currency, "con_safe") == 200

    # withdraw 50
    safe.withdraw(amount=50, signer="alice")
    assert _safe_balance(client, safe, "alice") == 150
    assert _cur_balance(client, currency, "alice") == 9_850
    assert _cur_balance(client, currency, "con_safe") == 150

def test_withdraw_rejects_overdraft(client, currency, safe):
    currency.mint(amount=100, to="bob")
    currency.approve(amount=100, to="con_safe", signer="bob")
    safe.deposit(amount=60, signer="bob")
    assert _safe_balance(client, safe, "bob") == 60

    # Over-withdraw should raise from the contract assert
    with pytest.raises(AssertionError):
        safe.withdraw(amount=120, signer="bob")

    # State unchanged
    assert _safe_balance(client, safe, "bob") == 60
    assert _cur_balance(client, currency, "bob") == 40
    assert _cur_balance(client, currency, "con_safe") == 60

def test_deposit_requires_approval(client, currency, safe):
    currency.mint(amount=50, to="carol")
    # No approval: deposit should assert (inside currency.transfer_from via vault.deposit)
    with pytest.raises(AssertionError):
        safe.deposit(amount=30, signer="carol")

    # Balances unchanged
    assert _cur_balance(client, currency, "carol") == 50
    assert _cur_balance(client, currency, "con_safe") in (0, None)
    assert _safe_balance(client, safe, "carol") in (0, None)


if __name__ == "__main__":
    pytest.main([__file__])