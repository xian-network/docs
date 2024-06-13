
# Stamps

A `stamp` is a single unit of computational work in a smart contract. Stamps are paid for with Xian. This is what enforces rate limiting and incentivizes the development of the network.

To calculate work, the code is ran through an optimized tracer. Each Python VM `opcode` has a specific cost. Each step of the code deducts from the number of stamps attached to the transaction.

If all of the stamps are deducted before the transaction is done, the transaction reverts states and fails. If there are left over stamps from the transaction execution, they are returned to the sender.

## Price of Stamps

The `stamp_price`, the ratio of `xian` to `stamps` is decided by the quorum of validators on the network and is altered via a DAO proposal.

## Read / Write Costs
* Cost to read one byte from state: 3 stamps
* Cost to write one byte to state: 25 stamps
