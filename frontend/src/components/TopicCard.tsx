import React from 'react';
import { Topic } from '../services/api';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 hover:border-gray-300"
      style={{ borderLeftColor: topic.color, borderLeftWidth: '4px' }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="text-3xl mr-3">{topic.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
            <p className="text-sm text-gray-600">{topic.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Click to explore
            </span>
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

