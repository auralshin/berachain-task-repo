import { v4 as uuidv4 } from 'uuid';

/**
 * Manages background process statuses, providing tracking by ID.
 */
class ProcessManager {
    constructor() {
        this.processes = new Map();
    }

    /**
     * Creates a new process entry and returns its unique ID.
     * @returns {string} Newly created process ID.
     */
    createProcess() {
        const processId = uuidv4();
        this.processes.set(processId, { status: 'in-progress', result: null });
        return processId;
    }

    /**
     * Updates the status of a specified process ID.
     * @param {string} processId - The process identifier.
     * @param {string} status - New status.
     * @param {object} [result] - Optional result data.
     */
    updateProcess(processId, status, result = null) {
        if (!this.processes.has(processId)) return;
        this.processes.set(processId, { status, result });
    }

    /**
     * Retrieves the current status of a specified process.
     * @param {string} processId - The process identifier.
     * @returns {object} Status and result (if available).
     */
    getProcessStatus(processId) {
        return this.processes.get(processId) || { status: 'unknown', message: 'Invalid process ID' };
    }
}

export default new ProcessManager();
