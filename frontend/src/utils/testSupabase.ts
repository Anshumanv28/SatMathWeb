import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('sat_topics').select('count').limit(1);
    if (error) {
      console.error('❌ Database connection error:', error);
    } else {
      console.log('✅ Database connection successful');
    }

    // Test storage connection
    const bucketName = 'sattopicwisedata';
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Storage connection error:', bucketsError);
    } else {
      console.log('✅ Storage connection successful');
      console.log('📦 Available buckets:', buckets.map(b => b.name));
      
      const bucketExists = buckets.some(bucket => bucket.name === bucketName);
      if (bucketExists) {
        console.log(`✅ Bucket "${bucketName}" exists`);
        
        // Test listing files in bucket
        const { data: files, error: filesError } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 10 });
          
        if (filesError) {
          console.error('❌ Error listing files:', filesError);
        } else {
          console.log(`📁 Files/folders in bucket:`, files);
        }
      } else {
        console.log(`❌ Bucket "${bucketName}" does not exist`);
        console.log('💡 Please create the bucket in your Supabase dashboard');
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Auto-run test when imported
if (typeof window !== 'undefined') {
  testSupabaseConnection();
}
