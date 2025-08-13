import { ValidationError, AuthenticationError } from '../middleware/errorHandler.js';
import supabase from '../config/supabase.js';

// User registration
export const signup = async (req, res) => {
  const { email, password, user_metadata } = req.body;
  
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: user_metadata || {}
    }
  });

  if (error) {
    throw new ValidationError(error.message);
  }

  res.status(201).json({ 
    success: true,
    message: 'User created successfully',
    user: data.user 
  });
};

// User login
export const signin = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new AuthenticationError(error.message);
  }

  res.json({ 
    success: true,
    message: 'Login successful',
    user: data.user,
    session: data.session 
  });
};

// User logout
export const signout = async (req, res) => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new ValidationError(error.message);
  }

  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
};

// Get current user
export const getCurrentUser = async (req, res) => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new AuthenticationError(error.message);
  }

  res.json({ 
    success: true,
    user 
  });
};

// Password reset request
export const resetPassword = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    throw new ValidationError('Email is required');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
  });

  if (error) {
    throw new ValidationError(error.message);
  }

  res.json({ 
    success: true,
    message: 'Password reset email sent' 
  });
};

// Update password
export const updatePassword = async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    throw new ValidationError('New password is required');
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    throw new ValidationError(error.message);
  }

  res.json({ 
    success: true,
    message: 'Password updated successfully' 
  });
};

// Protected route example
export const protectedRoute = async (req, res) => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new AuthenticationError('Unauthorized');
  }

  res.json({ 
    success: true,
    message: 'This is a protected route',
    user: user 
  });
}; 