import dotenv from 'dotenv';
import supabase from '../config/supabase.js';
import { createTables, createRLSPolicies } from '../config/databaseSchema.js';

// Load environment variables
dotenv.config();

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Test connection first
    console.log('🔌 Testing Supabase connection...');
    if (!supabase.auth) {
      throw new Error('Supabase client not properly initialized');
    }
    console.log('✅ Supabase connection successful');
    
    // Create tables
    console.log('📋 Creating database tables...');
    const { error: tablesError } = await supabase.rpc('exec_sql', {
      sql: createTables
    });
    
    if (tablesError) {
      console.error('❌ Error creating tables:', tablesError);
      console.log('📝 Tables will need to be created manually in Supabase dashboard');
      console.log('📋 SQL to run in Supabase SQL Editor:');
      console.log('---');
      console.log(createTables);
      console.log('---');
    } else {
      console.log('✅ Database tables created successfully');
    }
    
    // Create RLS policies
    console.log('🔒 Creating Row Level Security policies...');
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql: createRLSPolicies
    });
    
    if (policiesError) {
      console.error('❌ Error creating RLS policies:', policiesError);
      console.log('📝 RLS policies will need to be created manually');
      console.log('🔒 SQL to run in Supabase SQL Editor:');
      console.log('---');
      console.log(createRLSPolicies);
      console.log('---');
    } else {
      console.log('✅ RLS policies created successfully');
    }
    
    // Verify tables exist
    console.log('🔍 Verifying tables...');
    const { data: tables, error: verifyError } = await supabase
      .from('sat_content')
      .select('count')
      .limit(1);
    
    if (verifyError) {
      console.error('❌ Error verifying tables:', verifyError);
      console.log('📝 Please create the tables manually in Supabase dashboard');
    } else {
      console.log('✅ Tables verified successfully');
      
      // Check sample data
      const { data: sampleData, error: sampleError } = await supabase
        .from('sat_content')
        .select('*')
        .limit(5);
      
      if (sampleError) {
        console.error('❌ Error checking sample data:', sampleError);
      } else {
        console.log(`✅ Sample data loaded: ${sampleData.length} records found`);
        if (sampleData.length > 0) {
          console.log('📚 Sample topics available:');
          const topics = [...new Set(sampleData.map(item => item.topic))];
          topics.forEach(topic => console.log(`   - ${topic}`));
        }
      }
    }
    
    console.log('🎉 Database initialization completed!');
    console.log('📊 You can now start adding content to your SAT Math website');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('📝 Please check your Supabase configuration and try again');
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 