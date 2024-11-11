// routes/processRoutes.js
import express from 'express';
import { initiateProcess, getProcessStatus } from '../controllers/processController.js';

const router = express.Router();

router.post('/start', initiateProcess);
router.get('/status/:processId', getProcessStatus); // New route for checking process status

export default router;
