import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getAllContent,
  getContentByTopic,
  getTopics,
  getContentById,
  addContent,
  updateContent,
  deleteContent,
  getPdfFile,
  getVideoUrl
} from '../controllers/contentController.js';

const router = express.Router();

// Content routes
router.get('/', asyncHandler(getAllContent));
router.get('/topics', asyncHandler(getTopics));
router.get('/topics/:topic', asyncHandler(getContentByTopic));
router.get('/:id', asyncHandler(getContentById));

// File download routes
router.get('/:id/pdf', asyncHandler(getPdfFile));
router.get('/:id/video', asyncHandler(getVideoUrl));

// Content management routes (require authentication)
router.post('/', asyncHandler(addContent));
router.put('/:id', asyncHandler(updateContent));
router.delete('/:id', asyncHandler(deleteContent));

export default router; 