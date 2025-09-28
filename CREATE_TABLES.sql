-- Create SAT Math Database Tables
-- Run this in your Supabase SQL Editor FIRST

-- Create sat_topics table
CREATE TABLE IF NOT EXISTS sat_topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sat_content table
CREATE TABLE IF NOT EXISTS sat_content (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(100) NOT NULL REFERENCES sat_topics(name) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    pdf_url VARCHAR(500),
    pdf_filename VARCHAR(200),
    video_url VARCHAR(500),
    content_type VARCHAR(20) DEFAULT 'pdf' CHECK (content_type IN ('pdf', 'video', 'both')),
    difficulty_level VARCHAR(10) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id INTEGER REFERENCES sat_content(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sat_content_topic ON sat_content(topic);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content_id ON user_progress(content_id);

-- Enable Row Level Security (RLS)
ALTER TABLE sat_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sat_topics (public read access)
CREATE POLICY "Anyone can read topics" ON sat_topics
    FOR SELECT USING (true);

-- Create RLS policies for sat_content (public read access)
CREATE POLICY "Anyone can read content" ON sat_content
    FOR SELECT USING (true);

-- Create RLS policies for user_progress (users can only see their own progress)
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_sat_topics_updated_at BEFORE UPDATE ON sat_topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sat_content_updated_at BEFORE UPDATE ON sat_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
