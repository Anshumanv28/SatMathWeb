import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StorageStatus: React.FC = () => {
  const [bucketStatus, setBucketStatus] = useState<'checking' | 'exists' | 'missing' | 'error'>('checking');
  const [bucketName] = useState('sattopicwisedata');

  useEffect(() => {
    checkBucketStatus();
  }, []);

  const checkBucketStatus = async () => {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        setBucketStatus('error');
        return;
      }

      const bucketExists = buckets.some(bucket => bucket.name === bucketName);
      setBucketStatus(bucketExists ? 'exists' : 'missing');
    } catch (error) {
      console.error('Error in checkBucketStatus:', error);
      setBucketStatus('error');
    }
  };

  if (bucketStatus === 'checking') {
    return null; // Don't show anything while checking
  }

  if (bucketStatus === 'exists') {
    return null; // Don't show anything if bucket exists
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Storage Setup Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            {bucketStatus === 'missing' && (
              <p>
                The storage bucket "{bucketName}" doesn't exist. Please create it in your Supabase dashboard to enable PDF functionality.
              </p>
            )}
            {bucketStatus === 'error' && (
              <p>
                Unable to check storage status. Please verify your Supabase configuration.
              </p>
            )}
          </div>
          <div className="mt-3">
            <button
              onClick={checkBucketStatus}
              className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors"
            >
              Check Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageStatus;
