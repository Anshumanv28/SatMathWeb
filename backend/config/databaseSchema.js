// Database schema for SAT Math Web application
// Updated to work with Supabase storage URLs and organized by SAT Math topics

const createTables = `
-- Create sat_content table with storage URLs
CREATE TABLE IF NOT EXISTS sat_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  pdf_url TEXT, -- Supabase storage URL for PDF
  pdf_filename VARCHAR(255),
  video_url TEXT, -- Video URL (YouTube, Vimeo, etc.)
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('pdf', 'video', 'both')),
  difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table for better organization
CREATE TABLE IF NOT EXISTS sat_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100), -- For UI icons
  color VARCHAR(20) DEFAULT '#3B82F6', -- For UI theming
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table for tracking completion
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID NOT NULL REFERENCES sat_content(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);
`;

const createIndexes = `
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sat_content_topic ON sat_content(topic);
CREATE INDEX IF NOT EXISTS idx_sat_content_content_type ON sat_content(content_type);
CREATE INDEX IF NOT EXISTS idx_sat_content_is_active ON sat_content(is_active);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content_id ON user_progress(content_id);
`;

const createRLSPolicies = `
-- Enable RLS on all tables
ALTER TABLE sat_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- sat_content policies
CREATE POLICY "sat_content_select_policy" ON sat_content
  FOR SELECT USING (is_active = true);

CREATE POLICY "sat_content_insert_policy" ON sat_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "sat_content_update_policy" ON sat_content
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "sat_content_delete_policy" ON sat_content
  FOR DELETE USING (auth.role() = 'authenticated');

-- sat_topics policies
CREATE POLICY "sat_topics_select_policy" ON sat_topics
  FOR SELECT USING (is_active = true);

CREATE POLICY "sat_topics_insert_policy" ON sat_topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "sat_topics_update_policy" ON sat_topics
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "sat_topics_delete_policy" ON sat_topics
  FOR DELETE USING (auth.role() = 'authenticated');

-- user_progress policies
CREATE POLICY "user_progress_select_policy" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_progress_insert_policy" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_update_policy" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_progress_delete_policy" ON user_progress
  FOR DELETE USING (auth.uid() = user_id);
`;

const insertSampleData = `
-- Insert SAT Math topics
INSERT INTO sat_topics (name, description, icon, color, sort_order) VALUES
('Algebra', 'Linear equations, inequalities, and functions', '📐', '#EF4444', 1),
('Geometry', 'Lines, angles, triangles, circles, and polygons', '📏', '#10B981', 2),
('Advanced Math', 'Quadratic equations, functions, and complex numbers', '🔢', '#F59E0B', 3),
('Problem Solving & Data Analysis', 'Ratios, percentages, statistics, and data interpretation', '📊', '#8B5CF6', 4),
('Trigonometry', 'Trigonometric functions and identities', '📐', '#06B6D4', 5),
('Full Length Tests', 'Complete SAT Math practice tests', '📝', '#84CC16', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert sample content (you'll replace these with your actual PDF URLs)
INSERT INTO sat_content (topic, title, description, pdf_url, pdf_filename, video_url, content_type, difficulty_level) VALUES
('Algebra', 'Linear Equations Fundamentals', 'Master the basics of linear equations and inequalities', 'https://your-project.supabase.co/storage/v1/object/public/sat-math-pdfs/algebra-linear-equations.pdf', 'algebra-linear-equations.pdf', 'https://www.youtube.com/watch?v=example1', 'both', 'easy'),
('Algebra', 'Systems of Equations', 'Learn to solve systems of linear equations', 'https://your-project.supabase.co/storage/v1/object/public/sat-math-pdfs/algebra-systems.pdf', 'algebra-systems.pdf', 'https://www.youtube.com/watch?v=example2', 'both', 'medium'),
('Geometry', 'Triangle Properties', 'Understanding triangle types and properties', 'https://your-project.supabase.co/storage/v1/object/public/sat-math-pdfs/geometry-triangles.pdf', 'geometry-triangles.pdf', 'https://www.youtube.com/watch?v=example3', 'both', 'medium'),
('Geometry', 'Circle Geometry', 'Circles, arcs, and sector problems', 'https://your-project.supabase.co/storage/v1/object/public/sat-math-pdfs/geometry-circles.pdf', 'geometry-circles.pdf', 'https://www.youtube.com/watch?v=example4', 'both', 'hard'),
('Advanced Math', 'Quadratic Functions', 'Graphing and solving quadratic equations', 'https://your-project.supabase.co/storage/v1/object/public/sat-math-pdfs/advanced-quadratics.pdf', 'advanced-quadratics.pdf', 'https://www.youtube.com/watch?v=example5', 'both', 'hard'),
('Problem Solving & Data Analysis', 'Statistics and Probability', 'Mean, median, mode, and probability concepts', 'https://your-project.supabase.co/storage/v1/object/public/sat-math-pdfs/stats-probability.pdf', 'stats-probability.pdf', 'https://www.youtube.com/watch?v=example6', 'both', 'medium'),
('Full Length Tests', 'SAT Math Practice Test 1', 'Complete 58-question practice test with solutions', 'https://your-project.supabase.co/storage/v1/object/public/sat-math-pdfs/practice-test-1.pdf', 'practice-test-1.pdf', NULL, 'pdf', 'medium'),
('Full Length Tests', 'SAT Math Practice Test 2', 'Complete 58-question practice test with solutions', 'https://your-project.supabase.co/storage/v1/object/public/sat-math-pdfs/practice-test-2.pdf', 'practice-test-2.pdf', NULL, 'pdf', 'medium')
ON CONFLICT DO NOTHING;
`;

const dropTables = `
-- Drop tables in reverse order (due to foreign key constraints)
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS sat_content CASCADE;
DROP TABLE IF EXISTS sat_topics CASCADE;
`;

export default {
  createTables,
  createIndexes,
  createRLSPolicies,
  insertSampleData,
  dropTables
}; 