import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  signup,
  signin,
  signout,
  getCurrentUser,
  resetPassword,
  updatePassword,
  protectedRoute
} from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/signup', asyncHandler(signup));
router.post('/signin', asyncHandler(signin));
router.post('/signout', asyncHandler(signout));
router.get('/user', asyncHandler(getCurrentUser));
router.post('/reset-password', asyncHandler(resetPassword));
router.post('/update-password', asyncHandler(updatePassword));

// Protected route example
router.get('/protected', asyncHandler(protectedRoute));

export default router; 