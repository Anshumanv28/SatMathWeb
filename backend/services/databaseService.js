import supabase from '../config/supabase.js';
import schema from '../config/databaseSchema.js';

class DatabaseService {
  async initializeDatabase() {
    try {
      console.log('🗄️  Initializing database...');
      
      // Create tables
      const { error: tablesError } = await supabase.rpc('exec_sql', {
        sql: schema.createTables
      });
      
      if (tablesError) {
        console.error('❌ Error creating tables:', tablesError);
        console.log('📝 Please run the following SQL manually in your Supabase dashboard:');
        console.log(schema.createTables);
        return;
      }
      
      // Create indexes
      const { error: indexesError } = await supabase.rpc('exec_sql', {
        sql: schema.createIndexes
      });
      
      if (indexesError) {
        console.error('❌ Error creating indexes:', indexesError);
        console.log('📝 Please run the following SQL manually in your Supabase dashboard:');
        console.log(schema.createIndexes);
        return;
      }
      
      // Create RLS policies
      const { error: policiesError } = await supabase.rpc('exec_sql', {
        sql: schema.createRLSPolicies
      });
      
      if (policiesError) {
        console.error('❌ Error creating RLS policies:', policiesError);
        console.log('📝 Please run the following SQL manually in your Supabase dashboard:');
        console.log(schema.createRLSPolicies);
        return;
      }
      
      // Insert sample data
      const { error: dataError } = await supabase.rpc('exec_sql', {
        sql: schema.insertSampleData
      });
      
      if (dataError) {
        console.error('❌ Error inserting sample data:', dataError);
        console.log('📝 Please run the following SQL manually in your Supabase dashboard:');
        console.log(schema.insertSampleData);
        return;
      }
      
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      console.log('📝 Please run the SQL commands manually in your Supabase dashboard');
    }
  }

  // Topic methods
  async getAllTopics() {
    const { data, error } = await supabase
      .from('sat_topics')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async getTopicByName(name) {
    const { data, error } = await supabase
      .from('sat_topics')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Content methods
  async getAllContent() {
    const { data, error } = await supabase
      .from('sat_content')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getContentByTopic(topic) {
    const { data, error } = await supabase
      .from('sat_content')
      .select('*')
      .eq('topic', topic)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getTopics() {
    const { data, error } = await supabase
      .from('sat_topics')
      .select('name, description, icon, color')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async getContentById(id) {
    const { data, error } = await supabase
      .from('sat_content')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data;
  }

  async addContent(contentData) {
    const { data, error } = await supabase
      .from('sat_content')
      .insert([contentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateContent(id, updates) {
    const { data, error } = await supabase
      .from('sat_content')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteContent(id) {
    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('sat_content')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }

  // User progress methods
  async getUserProgress(userId) {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        sat_content (
          id,
          title,
          topic,
          content_type
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }

  async markContentCompleted(userId, contentId, timeSpent = 0) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert([{
        user_id: userId,
        content_id: contentId,
        completed: true,
        completed_at: new Date().toISOString(),
        time_spent: timeSpent,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'user_id,content_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getContentProgress(userId, contentId) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data || null;
  }

  // Statistics methods
  async getUserStats(userId) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true);
    
    if (error) throw error;
    
    const totalCompleted = data.length;
    const totalTimeSpent = data.reduce((sum, progress) => sum + (progress.time_spent || 0), 0);
    
    // Get total content count
    const { count: totalContent } = await supabase
      .from('sat_content')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    return {
      totalCompleted,
      totalContent: totalContent || 0,
      totalTimeSpent,
      completionPercentage: totalContent ? Math.round((totalCompleted / totalContent) * 100) : 0
    };
  }

  async getTopicStats(userId) {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        completed,
        sat_content (
          topic
        )
      `)
      .eq('user_id', userId)
      .eq('completed', true);
    
    if (error) throw error;
    
    const topicStats = {};
    data.forEach(progress => {
      const topic = progress.sat_content.topic;
      topicStats[topic] = (topicStats[topic] || 0) + 1;
    });
    
    return topicStats;
  }
}

export default new DatabaseService(); 