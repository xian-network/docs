# Stamps Explained

In the Xian blockchain ecosystem, "stamps" serve as a fundamental concept, pivotal to understanding how computational work is quantified, limited, and incentivized within smart contracts. This mechanism not only promotes efficient code development but also ensures the network's sustainability by enforcing rate limiting. Here, we delve into the intricacies of stamps, their role in the Xian network, and how they are utilized to balance network load and incentivize the ecosystem's growth.

## **What are Stamps?**

A stamp represents a single unit of computational work required by a smart contract on the Xian network. When users wish to execute a smart contract, they must convert a portion of their Xian cryptocurrency into stamps. This conversion process is crucial for several reasons:

* **Rate Limiting**: By requiring stamps for computational work, the Xian network effectively implements a rate-limiting mechanism. This ensures that the network can manage demand, prevent spam transactions, and allocate resources efficiently.
* **Network Incentivization**: Stamps provide a direct incentive for developers to optimize their smart contracts. Efficient contracts that require fewer stamps lower the cost for users and reduce the network's computational load.

## **Calculation of Work**

The computational cost of executing smart contract code on the Xian network is determined through an optimized tracing process. Each operation (opcode) in the Python Virtual Machine (VM) is assigned a specific stamp cost. As the smart contract code executes, the corresponding number of stamps is deducted based on the operations performed. This method ensures a fair and transparent way to quantify computational work.

* **Execution and Deduction**: As a transaction executes, stamps are progressively deducted according to the computational steps taken. This deduction continues until the transaction completes or the allotted stamps are exhausted.
* **Transaction Success or Failure**: If a transaction consumes all attached stamps before completion, it reverts to its initial state and is deemed unsuccessful. Conversely, if the transaction completes with stamps to spare, the remaining stamps are refunded to the sender, encouraging efficient code usage.

## **Read and Write Costs**

The Xian network specifies distinct costs for reading from and writing to the blockchain state, emphasizing the importance of optimizing data storage and access:

* **Reading from State**: Each byte read from the blockchain state costs 3 stamps. This encourages developers to minimize unnecessary state reads.
* **Writing to State**: Writing data is more resource-intensive, with each byte written costing 25 stamps. This higher cost reflects the greater computational and storage resources required for state modifications.

## **Dynamic Stamp Pricing**

The conversion rate between Xian coins and stamps is not fixed; instead, it's subject to change based on governance decisions. The DAO, representing the community's voice, has the authority to adjust the stamp pricing. This mechanism allows the network to adapt to changing conditions and ensures that stamp costs reflect the current value and demands on the network.

* **Governance and Stamp Pricing**: The ability of the DAO to vote on stamp pricing underscores the decentralized nature of the Xian network. It ensures that key economic parameters can be adjusted to maintain network health and user fairness.