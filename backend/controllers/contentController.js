import { ValidationError } from '../middleware/errorHandler.js';
import databaseService from '../services/databaseService.js';

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
    const { topic, title, description, content_type } = req.body;
    
    // Validate required fields
    if (!topic || !title || !content_type) {
      throw new ValidationError('Topic, title, and content_type are required');
    }
    
    // Validate content_type
    if (!['pdf', 'video', 'both'].includes(content_type)) {
      throw new ValidationError('Content type must be pdf, video, or both');
    }
    
    // Prepare content data
    const contentData = {
      topic,
      title,
      description: description || '',
      content_type
    };
    
    // Handle PDF file upload
    if (req.files && req.files.pdf) {
      const pdfFile = req.files.pdf;
      contentData.pdf_data = pdfFile.data;
      contentData.pdf_filename = pdfFile.name;
    }
    
    // Handle video URL
    if (req.body.video_url) {
      contentData.video_url = req.body.video_url;
    }
    
    // Validate that files are present based on content_type
    if (content_type === 'pdf' && !contentData.pdf_data) {
      throw new ValidationError('PDF file is required for pdf content type');
    }
    
    if (content_type === 'video' && !contentData.video_url) {
      throw new ValidationError('Video URL is required for video content type');
    }
    
    if (content_type === 'both' && (!contentData.pdf_data || !contentData.video_url)) {
      throw new ValidationError('Both PDF file and video URL are required for both content type');
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

// Get PDF file
export const getPdfFile = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await databaseService.getContentById(id);
    
    if (!content.pdf_data) {
      throw new ValidationError('PDF file not found for this content');
    }
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${content.pdf_filename || 'document.pdf'}"`);
    
    // Send PDF data
    res.send(content.pdf_data);
  } catch (error) {
    throw new ValidationError(`Failed to get PDF file: ${error.message}`);
  }
};

// Get video URL
export const getVideoUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await databaseService.getContentById(id);
    
    if (!content.video_url) {
      throw new ValidationError('Video URL not found for this content');
    }
    
    res.json({
      success: true,
      data: {
        video_url: content.video_url
      }
    });
  } catch (error) {
    throw new ValidationError(`Failed to get video URL: ${error.message}`);
  }
}; 