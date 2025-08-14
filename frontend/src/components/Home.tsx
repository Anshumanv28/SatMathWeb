import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Home.css";

const Home: React.FC = () => {
  const { user } = useAuth();

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
              <p className="text-gray-600">Access your personalized study materials</p>
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
          <h2>SAT Math Topics</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <div className="topic-icon">📐</div>
              <h3>Algebra</h3>
              <p>Linear equations, inequalities, functions, and systems of equations</p>
              <ul>
                <li>Linear equations and inequalities</li>
                <li>Functions and their graphs</li>
                <li>Systems of equations</li>
                <li>Quadratic functions</li>
              </ul>
            </div>

            <div className="topic-card">
              <div className="topic-icon">📏</div>
              <h3>Geometry</h3>
              <p>Lines, angles, triangles, circles, and coordinate geometry</p>
              <ul>
                <li>Lines and angles</li>
                <li>Triangles and polygons</li>
                <li>Circles and arcs</li>
                <li>Coordinate geometry</li>
              </ul>
            </div>

            <div className="topic-card">
              <div className="topic-icon">🔢</div>
              <h3>Advanced Math</h3>
              <p>Complex numbers, trigonometry, and advanced functions</p>
              <ul>
                <li>Complex numbers</li>
                <li>Trigonometric functions</li>
                <li>Polynomial functions</li>
                <li>Exponential and logarithmic functions</li>
              </ul>
            </div>

            <div className="topic-card">
              <div className="topic-icon">📊</div>
              <h3>Problem Solving & Data Analysis</h3>
              <p>Statistics, probability, and data interpretation</p>
              <ul>
                <li>Statistics and data analysis</li>
                <li>Probability concepts</li>
                <li>Ratios and proportions</li>
                <li>Percentages and rates</li>
              </ul>
            </div>
          </div>
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