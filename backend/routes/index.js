import express from 'express';
import authRoutes from './authRoutes.js';
import generalRoutes from './generalRoutes.js';
import contentRoutes from './contentRoutes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/content', contentRoutes);
router.use('/', generalRoutes);

export default router; 