---
title: Uber Dice
description: Example Xian Smart Contract based Dice game with random functions and house edge. Range based dice with multiplier winnings based on range.
---

# Uber Dice
## Overview
Example Xian Smart Contract based Dice game with random functions and house edge. Range based dice with multiplier winnings based on range.
This example demonstrates :
- How to store data to the blockchain using the `Hash` data structure.
- How to use the `random` module to generate random numbers.
- How to import token contracts & use them within the context of a betting contract.

:::tip Source Code
- The source code, including tests for this project can be found here: [Xian GitHub](https://github.com/xian-network/dice-game/tree/main)
:::

:::info Running Tests
- For running the tests in this example, we recommend using the [Contract Dev Environment](/tools/contract-dev-environment).
:::

## Contract Code

```python
random.seed()

game = Hash()
rolls = Hash(default_value=False)

@construct
def seed():
    game['owner'] = ctx.caller
    game['total_wins'] = 0
    game['total_losses'] = 0
    game['total_rolls'] = 0
    game['allowed_tokens'] = ['currency']
    game['max_token_bet', 'currency'] = 1000
    game['house_edge'] = 0.03 # 3%

@export
def roll(bet_size: float, token_contract: str, roll_type: str, roll_target: int):
    balances = ForeignHash(foreign_contract=token_contract, foreign_name='balances')

    assert bet_size > 0, 'Bet size must be greater than 0'
    assert token_contract in game['allowed_tokens'], 'Token not allowed'
    assert bet_size <= game['max_token_bet', token_contract], 'Bet size exceeds the maximum allowed bet'
    
    assert roll_type in ['over', 'under'], 'Invalid roll type'
    
    if roll_type == 'over':
        assert 1 <= roll_target < 100, 'Roll target must be between 1 and 99 for over rolls'
    else:
        assert 2 <= roll_target <= 100, 'Roll target must be between 2 and 100 for under rolls'

    token = importlib.import_module(token_contract)
    token.transfer_from(amount=bet_size, to=ctx.this, main_account=ctx.caller)

    # Calculate the range of the roll
    roll_range = (1, roll_target) if roll_type == 'under' else (roll_target, 100)
    roll_range_size = roll_range[1] - roll_range[0] + 1

    # Fair multiplier calculation (100% payout based on range size)
    fair_multiplier = 100 / roll_range_size

    # House edge
    adjusted_multiplier = fair_multiplier * (1 - game['house_edge'])

    # Ensure the contract can cover potential payout
    assert balances[ctx.this] >= bet_size * adjusted_multiplier, 'Contract does not have enough funds to cover the bet'

    game['total_rolls'] += 1
    roll = random.randint(1, 100)
    rolls[ctx.caller, game['total_rolls']] = roll

    if (roll_type == 'over' and roll > roll_target) or (roll_type == 'under' and roll < roll_target):
        win_amount = bet_size * adjusted_multiplier
        token.transfer(amount=win_amount, to=ctx.caller)
        game['total_wins'] += 1
        return f'You rolled {roll}. You win {win_amount} {token_contract}!'
    else:
        game['total_losses'] += 1
        return f'You lose! You rolled {roll}'

@export
def change_owner(new_owner: str):
    assert ctx.caller == game['owner'], 'Only the owner can change the owner'
    game['owner'] = new_owner

@export
def change_allowed_tokens(tokens: list):
    assert ctx.caller == game['owner'], 'Only the owner can change the allowed tokens'
    game['allowed_tokens'] = tokens

@export
def change_max_token_bet(token_contract: str, max_bet: float):
    assert ctx.caller == game['owner'], 'Only the owner can change the max token bet'
    game['max_token_bet', token_contract] = max_bet

@export
def change_house_edge(new_edge: float):
    assert ctx.caller == game['owner'], 'Only the owner can change the house edge'
    assert 0 <= new_edge < 1, 'House edge must be between 0 and 1. For example, 0.03 represents 3%'
    game['house_edge'] = new_edge

@export
def withdraw(amount: float, token_contract: str):
    assert ctx.caller == game['owner'], 'Only the owner can withdraw'
    token = importlib.import_module(token_contract)
    token.transfer(amount=amount, to=ctx.caller)
```