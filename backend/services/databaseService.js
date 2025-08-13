import supabase from '../config/supabase.js';
import { createTables, createRLSPolicies } from '../config/databaseSchema.js';

class DatabaseService {
  // Initialize database tables
  async initializeDatabase() {
    try {
      console.log('🗄️  Initializing database tables...');
      
      // Create tables
      const { error: tablesError } = await supabase.rpc('exec_sql', {
        sql: createTables
      });
      
      if (tablesError) {
        console.error('❌ Error creating tables:', tablesError);
        console.log('📝 Please create the following tables in your Supabase dashboard:');
        console.log('- sat_content');
      } else {
        console.log('✅ Database tables created successfully');
      }
      
      // Create RLS policies
      const { error: policiesError } = await supabase.rpc('exec_sql', {
        sql: createRLSPolicies
      });
      
      if (policiesError) {
        console.error('❌ Error creating RLS policies:', policiesError);
      } else {
        console.log('✅ RLS policies created successfully');
      }
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error.message);
      throw error;
    }
  }

  // Get all content
  async getAllContent() {
    const { data, error } = await supabase
      .from('sat_content')
      .select('*')
      .eq('is_active', true)
      .order('topic', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch content: ${error.message}`);
    }

    return data;
  }

  // Get content by topic
  async getContentByTopic(topic) {
    const { data, error } = await supabase
      .from('sat_content')
      .select('*')
      .eq('topic', topic)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch content for topic ${topic}: ${error.message}`);
    }

    return data;
  }

  // Get all topics
  async getTopics() {
    const { data, error } = await supabase
      .from('sat_content')
      .select('topic')
      .eq('is_active', true)
      .order('topic', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch topics: ${error.message}`);
    }

    // Get unique topics
    const uniqueTopics = [...new Set(data.map(item => item.topic))];
    return uniqueTopics;
  }

  // Get content by ID
  async getContentById(id) {
    const { data, error } = await supabase
      .from('sat_content')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      throw new Error(`Failed to fetch content: ${error.message}`);
    }

    return data;
  }

  // Add new content
  async addContent(contentData) {
    const { data, error } = await supabase
      .from('sat_content')
      .insert(contentData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add content: ${error.message}`);
    }

    return data;
  }

  // Update content
  async updateContent(id, updates) {
    const { data, error } = await supabase
      .from('sat_content')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update content: ${error.message}`);
    }

    return data;
  }

  // Delete content (soft delete)
  async deleteContent(id) {
    const { error } = await supabase
      .from('sat_content')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete content: ${error.message}`);
    }

    return true;
  }


}

export default new DatabaseService(); 