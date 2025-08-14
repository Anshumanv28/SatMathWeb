import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getTopics,
  getAllContent,
  getContentByTopic,
  getContentById,
  addContent,
  updateContent,
  deleteContent,
  getUserProgress,
  getContentProgress,
  markContentCompleted,
  getUserStats,
  getTopicStats
} from '../controllers/contentController.js';

const router = express.Router();

// Topic routes
router.get('/topics', asyncHandler(getTopics));

// Content routes
router.get('/content', asyncHandler(getAllContent));
router.get('/content/topic/:topic', asyncHandler(getContentByTopic));
router.get('/content/:id', asyncHandler(getContentById));
router.post('/content', asyncHandler(addContent));
router.put('/content/:id', asyncHandler(updateContent));
router.delete('/content/:id', asyncHandler(deleteContent));

// User progress routes
router.get('/progress', asyncHandler(getUserProgress));
router.get('/progress/:contentId', asyncHandler(getContentProgress)); // Get specific content progress
router.post('/progress/:contentId/complete', asyncHandler(markContentCompleted));
router.get('/stats', asyncHandler(getUserStats));
router.get('/stats/topics', asyncHandler(getTopicStats));

export default router; 