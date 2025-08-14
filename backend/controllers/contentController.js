import { ValidationError } from '../middleware/errorHandler.js';
import databaseService from '../services/databaseService.js';

// Get all topics
export const getTopics = async (req, res) => {
  try {
    const topics = await databaseService.getTopics();
    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    throw new ValidationError(`Failed to fetch topics: ${error.message}`);
  }
};

// Get all content
export const getAllContent = async (req, res) => {
  try {
    const content = await databaseService.getAllContent();
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    throw new ValidationError(`Failed to fetch content: ${error.message}`);
  }
};

// Get content by topic
export const getContentByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const content = await databaseService.getContentByTopic(topic);
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    throw new ValidationError(`Failed to fetch content for topic ${req.params.topic}: ${error.message}`);
  }
};

// Get content by ID
export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await databaseService.getContentById(id);
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    throw new ValidationError(`Failed to fetch content: ${error.message}`);
  }
};

// Add new content
export const addContent = async (req, res) => {
  try {
    const { topic, title, description, content_type, difficulty_level, pdf_url, video_url } = req.body;
    
    // Validate required fields
    if (!topic || !title || !content_type) {
      throw new ValidationError('Topic, title, and content_type are required');
    }
    
    // Validate content_type
    if (!['pdf', 'video', 'both'].includes(content_type)) {
      throw new ValidationError('Content type must be pdf, video, or both');
    }
    
    // Validate difficulty_level
    if (difficulty_level && !['easy', 'medium', 'hard'].includes(difficulty_level)) {
      throw new ValidationError('Difficulty level must be easy, medium, or hard');
    }
    
    // Prepare content data
    const contentData = {
      topic,
      title,
      description: description || '',
      content_type,
      difficulty_level: difficulty_level || 'medium'
    };
    
    // Handle PDF URL
    if (pdf_url) {
      contentData.pdf_url = pdf_url;
      contentData.pdf_filename = pdf_url.split('/').pop() || 'document.pdf';
    }
    
    // Handle video URL
    if (video_url) {
      contentData.video_url = video_url;
    }
    
    // Validate that URLs are present based on content_type
    if (content_type === 'pdf' && !contentData.pdf_url) {
      throw new ValidationError('PDF URL is required for pdf content type');
    }
    
    if (content_type === 'video' && !contentData.video_url) {
      throw new ValidationError('Video URL is required for video content type');
    }
    
    if (content_type === 'both' && (!contentData.pdf_url || !contentData.video_url)) {
      throw new ValidationError('Both PDF URL and video URL are required for both content type');
    }
    
    const newContent = await databaseService.addContent(contentData);
    
    res.status(201).json({
      success: true,
      message: 'Content added successfully',
      data: newContent
    });
  } catch (error) {
    throw new ValidationError(`Failed to add content: ${error.message}`);
  }
};

// Update content
export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;
    
    const updatedContent = await databaseService.updateContent(id, updates);
    
    res.json({
      success: true,
      message: 'Content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    throw new ValidationError(`Failed to update content: ${error.message}`);
  }
};

// Delete content (soft delete)
export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    await databaseService.deleteContent(id);
    
    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    throw new ValidationError(`Failed to delete content: ${error.message}`);
  }
};

// User progress methods
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const progress = await databaseService.getUserProgress(userId);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    throw new ValidationError(`Failed to fetch user progress: ${error.message}`);
  }
};

export const getContentProgress = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { contentId } = req.params;
    const progress = await databaseService.getContentProgress(userId, contentId);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    throw new ValidationError(`Failed to fetch content progress: ${error.message}`);
  }
};

export const markContentCompleted = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { contentId } = req.params;
    const { timeSpent } = req.body;
    
    const progress = await databaseService.markContentCompleted(userId, contentId, timeSpent);
    
    res.json({
      success: true,
      message: 'Content marked as completed',
      data: progress
    });
  } catch (error) {
    throw new ValidationError(`Failed to mark content as completed: ${error.message}`);
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const stats = await databaseService.getUserStats(userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    throw new ValidationError(`Failed to fetch user stats: ${error.message}`);
  }
};

export const getTopicStats = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const stats = await databaseService.getTopicStats(userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    throw new ValidationError(`Failed to fetch topic stats: ${error.message}`);
  }
}; 