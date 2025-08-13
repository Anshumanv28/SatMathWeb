import dotenv from 'dotenv';
import supabase from './config/supabase.js';
import app from './app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize services
const initializeServices = async () => {
  try {
    // Test Supabase client initialization
    console.log('🔌 Testing Supabase client initialization...');
    
    // Check if the client is properly configured
    if (!supabase.auth) {
      throw new Error('Supabase auth service not available');
    }
    
    // Test basic client functionality without authentication
    if (typeof supabase.auth.signUp === 'function' && 
        typeof supabase.auth.signInWithPassword === 'function') {
      console.log('✅ Supabase client initialized successfully');
      console.log(`📍 Supabase URL: ${process.env.SUPABASE_URL}`);
    } else {
      throw new Error('Supabase auth methods not available');
    }
    
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
    console.log('⚠️  Server will continue but authentication may not work');
  }
};

// Start server
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });

  return server;
};

// Initialize and start
const main = async () => {
  await initializeServices();
  startServer();
};

main().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});