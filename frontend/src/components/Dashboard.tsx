import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Topic, Content, UserStats } from '../services/api';
import TopicCard from './TopicCard';
import ContentCard from './ContentCard';
import ProgressStats from './ProgressStats';
// import TopicDetail from './TopicDetail'; // Temporarily disabled for debugging
import StorageStatus from './StorageStatus';
import '../utils/testSupabase'; // Auto-run Supabase connection test

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<Topic | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      console.log('Loading dashboard data...');
      const [topicsData, statsData] = await Promise.all([
        apiService.getTopics(),
        apiService.getUserStats()
      ]);
      console.log('Topics loaded:', topicsData);
      console.log('Stats loaded:', statsData);
      setTopics(topicsData);
      setStats(statsData);
      await loadAllContent();
    } catch (err) {
      console.error('Error loading dashboard data:', err);
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

  // Note: handleTopicSelect is kept for potential future use

  const handleTopicClick = (topic: Topic) => {
    console.log('Topic clicked:', topic);
    setSelectedTopicDetail(topic);
  };

  const handleBackToTopics = () => {
    setSelectedTopicDetail(null);
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

  // Show topic detail view if a topic is selected
  if (selectedTopicDetail) {
    console.log('Rendering TopicDetail for:', selectedTopicDetail.name);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToTopics}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Back to topics"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{selectedTopicDetail.icon}</div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedTopicDetail.name}</h1>
                    <p className="text-gray-600">{selectedTopicDetail.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Topic Detail Page</h2>
            <p className="text-gray-600 mb-4">
              You successfully navigated to the {selectedTopicDetail.name} topic detail page!
            </p>
            <p className="text-sm text-gray-500">
              The full TopicDetail component will load PDFs and content here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* EMERGENCY DEBUG SECTION */}
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
        <h2 className="font-bold">🚨 EMERGENCY DEBUG</h2>
        <p>Topics loaded: {topics.length}</p>
        <p>Selected topic detail: {selectedTopicDetail ? (selectedTopicDetail as Topic).name : 'None'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
        
        <button
          onClick={() => {
            console.log('EMERGENCY BUTTON CLICKED');
            alert('Emergency button works!');
            if (topics.length > 0) {
              setSelectedTopicDetail(topics[0]);
            }
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          EMERGENCY TEST BUTTON
        </button>
      </div>

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

      {/* Storage Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StorageStatus />
      </div>

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
            
            {/* Debug: Test button */}
            {!selectedTopic && topics.length > 0 && (
              <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Debug: Test navigation</p>
                <button
                  onClick={() => {
                    console.log('Test button clicked, opening first topic:', topics[0]);
                    handleTopicClick(topics[0]);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Test: Open {topics[0]?.name || 'First Topic'}
                </button>
              </div>
            )}
          </div>

          {!selectedTopic && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {topics.map((topic) => {
                console.log('Rendering topic card for:', topic.name);
                return (
                  <div key={topic.name} className="space-y-4">
                    {/* Simple test button */}
                    <button
                      onClick={() => {
                        console.log('SIMPLE BUTTON CLICKED for:', topic.name);
                        alert(`Clicked ${topic.name}! This should work.`);
                        setSelectedTopicDetail(topic);
                      }}
                      className="w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
                    >
                      SIMPLE TEST: {topic.name}
                    </button>
                    
                    {/* Original TopicCard */}
                    <TopicCard
                      topic={topic}
                      onClick={() => {
                        console.log('Dashboard onClick called for:', topic.name);
                        handleTopicClick(topic);
                      }}
                    />
                  </div>
                );
              })}
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