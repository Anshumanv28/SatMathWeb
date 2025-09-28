import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { awsS3PdfService } from "../services/awsS3PdfService";
import PDFList from "./PDFList";
import S3TopicCard from "./S3TopicCard";
import "./Home.css";

const Home: React.FC = () => {
  const { user } = useAuth();
  
  // S3 Topics state
  const [s3Topics, setS3Topics] = useState<string[]>([]);
  const [selectedS3Topic, setSelectedS3Topic] = useState<string | null>(null);
  const [s3TopicsLoading, setS3TopicsLoading] = useState(true);

  useEffect(() => {
    loadS3Topics();
  }, []);

  const loadS3Topics = async () => {
    try {
      setS3TopicsLoading(true);
      console.log('Loading S3 topics...');
      const topicsData = await awsS3PdfService.getAllTopics();
      setS3Topics(topicsData);
      console.log('S3 topics loaded:', topicsData);
    } catch (error) {
      console.error("Error loading S3 topics:", error);
      setS3Topics([]);
    } finally {
      setS3TopicsLoading(false);
    }
  };

  const handleS3TopicClick = (topicName: string) => {
    console.log('S3 Topic clicked:', topicName);
    setSelectedS3Topic(topicName);
  };

  const handleBackToTopics = () => {
    setSelectedS3Topic(null);
  };

  // Show S3 topic detail if selected
  if (selectedS3Topic) {
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
                  <div className="text-4xl">📚</div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {selectedS3Topic.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ')}
                    </h1>
                    <p className="text-gray-600">SAT Math PDFs and Resources</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PDFList topic={selectedS3Topic} />
        </div>
      </div>
    );
  }


  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to SAT Math Web</h1>
          <p className="hero-subtitle">
            Master SAT Mathematics with comprehensive resources, practice questions, and expert guidance.
            Whether you're aiming for a perfect score or building your foundation, we provide the tools you need to succeed.
          </p>
          {user ? (
            <div className="hero-cta">
              <p className="text-green-600 font-medium mb-2">✓ You're signed in!</p>
              <p className="text-gray-600">Access your personalized study materials below</p>
            </div>
          ) : (
            <div className="hero-cta">
              <Link to="/login" className="cta-button primary">
                Start Your SAT Math Journey
              </Link>
              <p className="text-sm text-gray-600 mt-2">Free access to all resources</p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="content-sections">
        {/* SAT Math Topics */}
        <div className="section">
          <div className="flex items-center justify-between mb-6">
            <h2>SAT Math Topics</h2>
            <button
              onClick={loadS3Topics}
              className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-md transition-colors"
              title="Refresh topics from S3 bucket"
            >
              🔄 Refresh
            </button>
          </div>
          
          {s3TopicsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading topics from S3 bucket...</p>
            </div>
          ) : s3Topics.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
              <p className="text-gray-600">Add folders to your S3 bucket to see topics here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {s3Topics.map((topicName) => (
                <S3TopicCard
                  key={topicName}
                  topicName={topicName}
                  onClick={() => handleS3TopicClick(topicName)}
                />
              ))}
            </div>
          )}
        </div>


        {/* Resources Section */}
        <div className="section">
          <h2>Free Revision Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <h3>📚 Practice Questions</h3>
              <p>Hundreds of SAT-style questions with detailed solutions and explanations</p>
              <ul>
                <li>Topic-specific practice sets</li>
                <li>Mixed difficulty levels</li>
                <li>Instant feedback and explanations</li>
                <li>Progress tracking</li>
              </ul>
            </div>

            <div className="resource-card">
              <h3>📄 Past Papers</h3>
              <p>Complete collection of official SAT Math practice tests</p>
              <ul>
                <li>Official College Board materials</li>
                <li>Timed practice sessions</li>
                <li>Detailed answer explanations</li>
                <li>Performance analytics</li>
              </ul>
            </div>

            <div className="resource-card">
              <h3>📝 Revision Notes</h3>
              <p>Comprehensive study materials covering all SAT Math concepts</p>
              <ul>
                <li>Concise topic summaries</li>
                <li>Key formulas and theorems</li>
                <li>Common pitfalls and tips</li>
                <li>Visual learning aids</li>
              </ul>
            </div>

            <div className="resource-card">
              <h3>🎥 Video Tutorials</h3>
              <p>Step-by-step video explanations for complex topics</p>
              <ul>
                <li>Concept explanations</li>
                <li>Problem-solving strategies</li>
                <li>Exam technique tips</li>
                <li>Interactive examples</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Study Plans Section */}
        <div className="section">
          <h2>Study Plans & Preparation</h2>
          <div className="plans-grid">
            <div className="plan-card">
              <h3>Beginner (3-6 months)</h3>
              <p>For students starting their SAT Math preparation</p>
              <ul>
                <li>Foundation building</li>
                <li>Basic concept mastery</li>
                <li>Regular practice sessions</li>
                <li>Progress monitoring</li>
              </ul>
            </div>

            <div className="plan-card">
              <h3>Intermediate (2-3 months)</h3>
              <p>For students with basic math skills</p>
              <ul>
                <li>Advanced topic coverage</li>
                <li>Problem-solving strategies</li>
                <li>Timed practice tests</li>
                <li>Weakness identification</li>
              </ul>
            </div>

            <div className="plan-card">
              <h3>Advanced (1-2 months)</h3>
              <p>For students aiming for top scores</p>
              <ul>
                <li>Advanced problem types</li>
                <li>Speed optimization</li>
                <li>Full-length mock tests</li>
                <li>Score improvement focus</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="section">
          <h2>Why Choose SAT Math Web?</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>🎯 Targeted Practice</h3>
              <p>Focus on your weak areas with personalized practice recommendations</p>
            </div>
            <div className="feature">
              <h3>📈 Progress Tracking</h3>
              <p>Monitor your improvement with detailed analytics and performance insights</p>
            </div>
            <div className="feature">
              <h3>🆓 Completely Free</h3>
              <p>Access all resources without any subscription or hidden costs</p>
            </div>
            <div className="feature">
              <h3>📱 Always Accessible</h3>
              <p>Study anywhere, anytime with our mobile-friendly platform</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;