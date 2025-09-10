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