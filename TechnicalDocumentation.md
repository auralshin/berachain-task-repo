# Validator Proof Contract Explanation

This proect verifies weather a certain validator is active or not, at any given slot. It uses Beacon Block Root and Merkle proofs of Beacon state and Validators to prove the activeness of Validators.

## Concepts

### EIP-4788: Beacon Block Root in the EVM

EIP-4788 introduces a new field, `parent_beacon_block_root`, to Ethereum's execution block headers. This 32-byte field stores the hash tree root of the parent beacon block and is accessible in a dedicated smart contract at `0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02`. This contract keeps a ring buffer of the 8191 most recent beacon block roots and provides `get` and `set` functions for retrieving beacon block roots based on timestamp.


## Walkthrough

### Purpose

The purpose of `Validator Proof` is to verify that a validator on the Beacon chain has not been slashed. This is useful for applications that require trustless confirmation of a validator's status on-chain.

### Key Components

1. **Validator Construction**:
   - Each validator on the Beacon chain has a specific structure containing data like `pubkey`, `withdrawal_credentials`, `effective_balance`, and `slashed` status. We use this data to construct a `hash_tree_root`, which is a root hash of the Merkle tree representing the validator's attributes.
   
2. **Merkle Proofs**:
   - We use Merkle proofs to verify the validator’s status through several stages:
     - **Validator Proof**: Ensures that the constructed validator is part of the Beacon state's validator set.
     - **Beacon State Proof**: Ensures that the validators list is part of the Beacon state.
     - **Beacon Block Proof**: Ensures that the derived Beacon state root is part of a canonical Beacon block.

3. **SSZ**:
    - It is a serialization format specifically designed for Ethereum 2.0. It is a compact, deterministic, and efficient way to serialize structured data, making it well-suited for blockchain applications that require consistency across many nodes. SSZ is used extensively within the Ethereum 2.0 protocol to encode data structures, enabling efficient data transfer, storage, and Merkle proof generation.

## Prove

To prove a validator, we require to create a proof
The Beacon Root is merkle root of several other merkle roots
First we need to construct Merkle tree root for validator, root is merkle root of hash of all values inside the validator object.

To generate proofs for the validator, beacon state, and beacon block, using the Lodestar package can simplify the process, as Lodestar provides tools for working with Ethereum 2.0 data structures and Merkle proofs. Here’s an outline of how to achieve this:

- Validator Proof: This proof is of a specific validator is included in the validator registry within the beacon state. We need the validator’s hash tree root, Merkle proof, and position within the tree.
- Beacon State Proof: This proof verifies that the validator registry root is part of the beacon state. This requires Merkleizing the beacon state and generating a proof that includes the validator’s registry.
- Beacon Block Proof: This proof confirms that the beacon state root is included in the beacon block. This links the validator’s data to a specific beacon block, validating the data against the canonical blockchain state.

![merkle tree](https://raw.githubusercontent.com/auralshin/berachain-task-repo/main/image.png)
