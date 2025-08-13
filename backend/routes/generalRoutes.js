import express from 'express';
import { healthCheck } from '../controllers/generalController.js';

const router = express.Router();

// General routes
router.get('/health', healthCheck);

export default router; 