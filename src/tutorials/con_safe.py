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