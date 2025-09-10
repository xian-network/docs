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