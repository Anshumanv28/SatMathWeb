import React, { useState, useEffect } from 'react';
import { Content, apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkCompletionStatus();
  }, [content.id]);

  const checkCompletionStatus = async () => {
    if (!user) return;
    
    try {
      const progress = await apiService.getContentProgress(user.id, content.id);
      setIsCompleted(progress?.completed || false);
    } catch (error) {
      console.error('Error checking completion status:', error);
    }
  };

  const handleMarkCompleted = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await apiService.markContentCompleted(content.id, 0);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error marking content as completed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'both': return '📚';
      default: return '📄';
    }
  };

  const handlePdfClick = () => {
    if (content.pdf_url) {
      window.open(content.pdf_url, '_blank');
    }
  };

  const handleVideoClick = () => {
    if (content.video_url) {
      window.open(content.video_url, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{getContentTypeIcon(content.content_type)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{content.title}</h3>
              <p className="text-sm text-gray-600">{content.topic}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty_level)}`}>
            {content.difficulty_level}
          </span>
        </div>

        {/* Description */}
        {content.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{content.description}</p>
        )}

        {/* Content Actions */}
        <div className="space-y-2 mb-4">
          {content.pdf_url && (
            <button
              onClick={handlePdfClick}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <span className="mr-2">📄</span>
              View PDF
            </button>
          )}
          
          {content.video_url && (
            <button
              onClick={handleVideoClick}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              <span className="mr-2">🎥</span>
              Watch Video
            </button>
          )}
        </div>

        {/* Completion Status */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center">
            {isCompleted ? (
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Completed</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Not started</span>
              </div>
            )}
          </div>
          
          {!isCompleted && (
            <button
              onClick={handleMarkCompleted}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Marking...' : 'Mark Complete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;

