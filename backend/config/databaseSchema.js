// Simple Database Schema for SAT Math Website
// This file contains the SQL commands to create the necessary tables

export const createTables = `
-- Simple content table for storing PDFs and videos by topic
CREATE TABLE IF NOT EXISTS sat_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  pdf_data BYTEA, -- Store PDF as blob
  pdf_filename VARCHAR(255),
  video_url TEXT,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('pdf', 'video', 'both')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- Insert some sample topics with multiple content per topic
INSERT INTO sat_content (topic, title, description, content_type) VALUES
  ('Algebra', 'Linear Equations - Part 1', 'Introduction to linear equations and inequalities', 'pdf'),
  ('Algebra', 'Linear Equations - Part 2', 'Advanced linear equation solving techniques', 'pdf'),
  ('Algebra', 'Linear Equations Video Tutorial', 'Video explanation of linear equations', 'video'),
  ('Algebra', 'Quadratic Functions - Part 1', 'Introduction to quadratic equations', 'pdf'),
  ('Algebra', 'Quadratic Functions - Part 2', 'Advanced quadratic solving methods', 'pdf'),
  ('Algebra', 'Quadratic Functions Video', 'Complete video guide to quadratic functions', 'video'),
  ('Geometry', 'Triangle Properties - Part 1', 'Basic triangle properties and theorems', 'pdf'),
  ('Geometry', 'Triangle Properties - Part 2', 'Advanced triangle concepts', 'pdf'),
  ('Geometry', 'Triangle Video Tutorial', 'Visual explanation of triangle properties', 'video'),
  ('Geometry', 'Circle Geometry - Part 1', 'Basic circle properties and equations', 'pdf'),
  ('Geometry', 'Circle Geometry - Part 2', 'Advanced circle geometry concepts', 'pdf'),
  ('Geometry', 'Circle Geometry Video', 'Complete circle geometry tutorial', 'video'),
  ('Data Analysis', 'Statistics Basics - Part 1', 'Mean, median, mode concepts', 'pdf'),
  ('Data Analysis', 'Statistics Basics - Part 2', 'Standard deviation and variance', 'pdf'),
  ('Data Analysis', 'Statistics Video Tutorial', 'Complete statistics overview', 'video'),
  ('Data Analysis', 'Probability - Part 1', 'Basic probability concepts', 'pdf'),
  ('Data Analysis', 'Probability - Part 2', 'Advanced probability calculations', 'pdf'),
  ('Data Analysis', 'Probability Video Guide', 'Visual probability tutorial', 'video')
ON CONFLICT DO NOTHING;
`;

// Row Level Security (RLS) policies
export const createRLSPolicies = `
-- Enable RLS on tables
ALTER TABLE sat_content ENABLE ROW LEVEL SECURITY;

-- Content: Anyone can read, only admins can modify
CREATE POLICY "Content is viewable by everyone" ON sat_content FOR SELECT USING (true);
CREATE POLICY "Content is insertable by authenticated users" ON sat_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
`;

export default { createTables, createRLSPolicies }; 