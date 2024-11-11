import { ssz } from "@lodestar/types";
import {
  concatGindices,
  createProof,
  ProofType,
} from "@chainsafe/persistent-merkle-tree";
import { ethers } from "ethers";
import processManager from "./processManager.js";
import { toHex, verifyProof } from "../utils/proofHelper.js";
import { fromHexString, toHexString } from "@chainsafe/ssz";
import { getClient } from "@lodestar/api";
import { config } from "@lodestar/config/default";

const BeaconState = ssz.deneb.BeaconState;
const BeaconBlock = ssz.deneb.BeaconBlock;

const provider = new ethers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/Rr1orFKH4xrM32kZ0FKDj327hWQbmhPK"
);
const BEACON_ROOTS_CONTRACT = "0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02";
const coder = new ethers.AbiCoder();

class ProcessService {
  constructor() {
    this.client = null;
  }

  async initialize() {
    this.client = await initializeClient();
  }

  /**
   * Starts the background task for a specified slot and validator index.
   * @param {string|number} slot
   * @param {number} validatorIndex
   * @returns {string} Unique ID for tracking this process.
   */
  startProcess(slot, validatorIndex) {
    const processId = processManager.createProcess();

    // Background execution
    setTimeout(async () => {
      try {
        const result = await this.executeTask(slot, validatorIndex, processId);
        processManager.updateProcess(processId, "completed", result);
      } catch (error) {
        processManager.updateProcess(processId, "failed", {
          error: error.message,
        });
      }
    }, 0);

    return processId;
  }

  /**
   * Retrieves and verifies state information for a validator at a given slot.
   * @param {string|number} slot
   * @param {number} validatorIndex
   * @param {string} processId
   * @returns {object} Processed result data.
   */
  async executeTask(slot, validatorIndex, processId) {
    const client = getClient(
      { baseUrl: "https://lodestar-mainnet.chainsafe.io", timeoutMs: 60000 },
      { config }
    );
    const genesis = await client.beacon.getGenesis();
    if (!genesis.ok) throw new Error("Failed to load genesis time");

    const spec = await client.config.getSpec();
    if (!spec.ok) throw new Error("Failed to load spec configuration");

    processManager.updateProcess(processId, "Fetching beacon state...");
    const stateResponse = await client.debug.getStateV2(slot, "ssz");
    if (!stateResponse.ok) throw new Error("State retrieval failed");
    const stateView = BeaconState.deserializeToView(stateResponse.response);

    processManager.updateProcess(processId, "Fetching beacon block...");
    const blockResponse = await client.beacon.getBlockV2(slot);
    if (!blockResponse.ok) throw new Error("Block retrieval failed");
    const blockView = BeaconBlock.toView(blockResponse.response.data.message);
    const blockRoot = blockView.hashTreeRoot();

    processManager.updateProcess(processId, "Preparing Merkle proof...");
    const tree = blockView.tree.clone();
    tree.setNode(blockView.type.getPropertyGindex("stateRoot"), stateView.node);

    const gIndex = concatGindices([
      blockView.type.getPathInfo(["stateRoot"]).gindex,
      stateView.type.getPathInfo(["validators", validatorIndex]).gindex,
    ]);
    const proof = createProof(tree.rootNode, {
      type: ProofType.single,
      gindex: gIndex,
    });

    processManager.updateProcess(processId, "Verifying Merkle proof...");
    const blockRootHex = toHexString(blockRoot);
    const headerResponse = await client.beacon.getBlockHeaders({
      parentRoot: blockRootHex,
    });
    if (!headerResponse.ok) throw new Error("Failed to retrieve header data");

    const nextBlock = headerResponse.response.data[0]?.header;
    if (!nextBlock) throw new Error("Unable to fetch header for timestamp");

    const timestamp =
      genesis.response.data.genesisTime +
      slot * spec.response.data.SECONDS_PER_SLOT;
    const input = coder.encode(["uint256"], [timestamp]);

    processManager.updateProcess(
      processId,
      "Calling contract for beacon block root..."
    );
    const beaconBlockRoot = await provider.call({
      to: BEACON_ROOTS_CONTRACT,
      data: input,
    });

    processManager.updateProcess(processId, "Verifying final proof...");
    const verificationStatus = verifyProof(
      fromHexString(beaconBlockRoot),
      gIndex,
      proof.witnesses,
      stateView.validators.get(validatorIndex).hashTreeRoot()
    );

    processManager.updateProcess(processId, "completed");
    return {
      blockRoot: toHex(blockRoot),
      proof: proof.witnesses.map(toHex),
      validator: stateView.validators.type.elementType.toJson(
        stateView.validators.get(validatorIndex)
      ),
      validatorIndex,
      timestamp,
      verificationStatus: verificationStatus,
    };
  }

  /**
   * Retrieves the current status of a specified process.
   * @param {string} processId - The unique identifier for the process.
   * @returns {object} Status and result (if available).
   */
  getStatus(processId) {
    return processManager.getProcessStatus(processId);
  }
}

export default new ProcessService();
