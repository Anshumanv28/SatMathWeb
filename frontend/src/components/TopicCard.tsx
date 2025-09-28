import React, { useState, useEffect } from 'react';
import { Topic } from '../services/api';
import { awsS3PdfService } from '../services/awsS3PdfService';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const [pdfCount, setPdfCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    console.log('TopicCard clicked for:', topic.name);
    onClick();
  };

  useEffect(() => {
    loadPDFCount();
  }, [topic.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPDFCount = async () => {
    try {
      setLoading(true);
      const pdfs = await awsS3PdfService.getPDFsByTopic(topic.name);
      setPdfCount(pdfs.length);
    } catch (error) {
      console.error('Error loading PDF count:', error);
      setPdfCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 hover:border-gray-300"
      style={{ borderLeftColor: topic.color, borderLeftWidth: '4px' }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="text-3xl mr-3">{topic.icon}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
            <p className="text-sm text-gray-600">{topic.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Click to explore
            </span>
            {!loading && pdfCount !== null && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {pdfCount} PDF{pdfCount !== 1 ? 's' : ''}
              </span>
            )}
            {loading && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600 mr-1"></div>
                Loading...
              </div>
            )}
          </div>
          <div className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;

