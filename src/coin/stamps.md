# Stamps

A `stamp` is a single unit of computational work in a smart contract. Key points:

- Stamps are paid for with XIAN tokens (the native currency)
- Each transaction requires a stamps_supplied value 
- Python VM opcodes, reading/writing state, computation, etc. consume stamps
- Unused stamps are refunded
- Read operations are FREE (no stamp cost)
- Write operations cost 0.025 stamps per byte (25 stamps per byte at internal scale)
- If stamps run out during execution, transaction reverts
- Maximum stamps per transaction: 6,500

## **Calculation of Work**

The computational cost of executing smart contract code on the Xian network is determined through a tracing process that monitors Python Virtual Machine (VM) execution. Each operation (opcode) in the Python VM is assigned a specific stamp cost ranging from 1 to 1610 (internal scale) stamps. As the smart contract code executes, the corresponding number of stamps is deducted based on the operations performed. This method ensures a fair and transparent way to quantify computational work.

**Internal Stamp Scaling**: The system internally multiplies user-supplied stamps by 1000 for precise tracking. When execution completes, the used stamps are divided by 1000 and 5 stamps are added as a base transaction cost.

* **Execution and Deduction**: As a transaction executes, stamps are progressively deducted according to the computational steps taken. The tracer monitors each line of code execution and deducts stamps for the corresponding Python opcodes. This deduction continues until the transaction completes or the allotted stamps are exhausted.
* **Transaction Success or Failure**: If a transaction consumes all attached stamps before completion, it reverts to its initial state and is deemed unsuccessful with the error "The cost has exceeded the stamp supplied!". Conversely, if the transaction completes with stamps to spare, the remaining stamps are refunded to the sender, encouraging efficient code usage.
* **Additional Limits**: Beyond stamp limits, the system also enforces a memory usage limit of 500MB and a maximum call count of 800,000 to prevent infinite loops and excessive resource consumption.

## **Read and Write Costs**

The Xian network has an asymmetric cost model for state operations, heavily favoring reads over writes:

* **Reading from State**: Reading from the blockchain state is completely FREE and consumes no stamps. This design choice encourages developers to read state liberally without worrying about costs, making data queries and lookups very efficient.
* **Writing to State**: Writing data is resource-intensive, with each byte written (including both key and value) costing 0.025 stamps at the user level (25 stamps at the internal 1000x scale). This cost applies to the encoded JSON representation of the data, including type metadata for ContractingDecimal values.

**Example**: Writing `balances['alice'] = 1000.5` creates:
- Key: `"con_mycontract.balances:alice"` (29 bytes)
- Value: `{"__fixed__":"1000.5"}` (22 bytes)  
- Total: 51 bytes × 0.025 = 1.275 stamps

## **Stamp Pricing and Conversion**

* **Dynamic Conversion Rate**: The conversion rate between Xian coins and stamps is not fixed; instead, it's subject to change based on governance decisions. The DAO, representing the community's voice, has the authority to adjust the stamp pricing. This mechanism allows the network to adapt to changing conditions and ensures that stamp costs reflect the current value and demands on the network.

## **Opcode-Based Metering**

The stamp system uses detailed opcode-level metering where each Python VM instruction has a predetermined cost:

* **Opcode Costs**: Different Python operations have varying costs, from simple operations (1-2 stamps) to more complex ones (up to 1610 stamps for certain operations) (internal scale).
* **Instruction Tracing**: The system traces every line of code execution and maps it to the underlying Python bytecode instructions to calculate precise computational costs.
* **Caching**: The tracer caches instruction mappings for performance optimization during execution.
