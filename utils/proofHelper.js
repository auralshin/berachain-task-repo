import { createHash } from "crypto";

export function verifyProof(merkleRoot, nodeIndex, merkleProof, targetValue) {
  let currentHash = targetValue;

  for (const proofElement of merkleProof) {
    const hash = createHash("sha256");

    // Update the hash based on the current node's index (even/odd)
    if (nodeIndex % 2n === 0n) {
      hash.update(currentHash);
      hash.update(proofElement);
    } else {
      hash.update(proofElement);
      hash.update(currentHash);
    }

    currentHash = hash.digest();
    console.log("Intermediate hash:", toHex(currentHash));

    nodeIndex >>= 1n;

    if (nodeIndex === 0n) {
      throw new Error("Unexpected additional proof elements");
    }
  }

  console.log("Final computed root:", toHex(currentHash));

  if (nodeIndex !== 1n) {
    console.error("Proof verification failed: too few proof elements");
    return false;
  }

  if (toHex(merkleRoot) !== toHex(currentHash)) {
    console.error("Proof verification failed");
    return false;
  }

  console.log("Proof verified successfully");
  return true;
}

export function toHex(t) {
  return "0x" + Buffer.from(t).toString("hex");
}

export function log2(n) {
  return Math.ceil(Math.log2(Number(n))) || 1;
}
