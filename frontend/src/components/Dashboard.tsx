import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Topic, Content, UserStats } from '../services/api';
import TopicCard from './TopicCard';
import ContentCard from './ContentCard';
import ProgressStats from './ProgressStats';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      loadContentByTopic(selectedTopic);
    } else {
      loadAllContent();
    }
  }, [selectedTopic]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [topicsData, statsData] = await Promise.all([
        apiService.getTopics(),
        apiService.getUserStats()
      ]);
      setTopics(topicsData);
      setStats(statsData);
      await loadAllContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadAllContent = async () => {
    try {
      const contentData = await apiService.getAllContent();
      setContent(contentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    }
  };

  const loadContentByTopic = async (topic: string) => {
    try {
      const contentData = await apiService.getContentByTopic(topic);
      setContent(contentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topic content');
    }
  };

  const handleTopicSelect = (topicName: string) => {
    setSelectedTopic(selectedTopic === topicName ? null : topicName);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your SAT Math dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error loading dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SAT Math Web</h1>
              <p className="text-gray-600">Master SAT Mathematics with structured content</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500">Signed in</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Stats */}
      {stats && <ProgressStats stats={stats} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Topics Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedTopic ? `${selectedTopic} Content` : 'Choose a Topic'}
            </h2>
            {selectedTopic && (
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
              >
                ← Back to all topics
              </button>
            )}
          </div>

          {!selectedTopic && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {topics.map((topic) => (
                <TopicCard
                  key={topic.name}
                  topic={topic}
                  onClick={() => handleTopicSelect(topic.name)}
                />
              ))}
            </div>
          )}

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedTopic ? `${selectedTopic} Materials` : 'All Content'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {content.length} item{content.length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            {content.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
                <p className="text-gray-600">
                  {selectedTopic 
                    ? `No content has been added for ${selectedTopic} yet.`
                    : 'No content has been added yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {content.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 