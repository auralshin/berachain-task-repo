// app.js
import express from 'express';
import processRoutes from './routes/processRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/process', processRoutes);

export default app;
