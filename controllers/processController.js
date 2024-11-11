// controllers/processController.js
import processService from '../services/processService.js';

export const initiateProcess = async (req, res) => {
  try {
    const { slot, validatorIndex } = req.body; // Extract slot and validatorIndex from the request body
    const processId = processService.startProcess(slot, validatorIndex); // Start process and get processId
    res.status(200).json({ message: 'Process started successfully!', processId });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating process', error: error.message });
  }
};

export const getProcessStatus = (req, res) => {
  const { processId } = req.params;
  const status = processService.getStatus(processId);
  res.status(200).json(status);
};
