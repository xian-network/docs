# Stamps

A `stamp` is a single unit of computational work in a smart contract. Key points:

- Stamps are paid for with Xian tokens
- Each transaction requires a stamps_supplied value 
- Reading/writing state, computation, etc. consume stamps
- Unused stamps are refunded
- Read operations cost 3 stamps per byte
- Write operations cost 25 stamps per byte
- If stamps run out during execution, transaction reverts

## **Calculation of Work**

The computational cost of executing smart contract code on the Xian network is determined through a tracing process. Each operation (opcode) in the Python Virtual Machine (VM) is assigned a specific stamp cost. As the smart contract code executes, the corresponding number of stamps is deducted based on the operations performed. This method ensures a fair and transparent way to quantify computational work.

* **Execution and Deduction**: As a transaction executes, stamps are progressively deducted according to the computational steps taken. This deduction continues until the transaction completes or the allotted stamps are exhausted.
* **Transaction Success or Failure**: If a transaction consumes all attached stamps before completion, it reverts to its initial state and is deemed unsuccessful. Conversely, if the transaction completes with stamps to spare, the remaining stamps are refunded to the sender, encouraging efficient code usage.

## **Read and Write Costs**

The Xian network specifies distinct costs for reading from and writing to the blockchain state, emphasizing the importance of optimizing data storage and access:

* **Reading from State**: Each byte read from the blockchain state costs 3 stamps. This encourages developers to minimize unnecessary state reads.
* **Writing to State**: Writing data is more resource-intensive, with each byte written costing 25 stamps. This higher cost reflects the greater computational and storage resources required for state modifications.

## **Dynamic Stamp Pricing**

The conversion rate between Xian coins and stamps is not fixed; instead, it's subject to change based on governance decisions. The DAO, representing the community's voice, has the authority to adjust the stamp pricing. This mechanism allows the network to adapt to changing conditions and ensures that stamp costs reflect the current value and demands on the network.

* **Governance and Stamp Pricing**: The ability of the DAO to vote on stamp pricing underscores the decentralized nature of the Xian network. It ensures that key economic parameters can be adjusted to maintain network health and user fairness.
