import { supabase } from '../lib/supabase';

const API_BASE_URL = 'http://localhost:8000/api';

interface Topic {
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Content {
  id: string;
  topic: string;
  title: string;
  description: string;
  pdf_url?: string;
  pdf_filename?: string;
  video_url?: string;
  content_type: 'pdf' | 'video' | 'both';
  difficulty_level: 'easy' | 'medium' | 'hard';
  created_at: string;
}

interface UserProgress {
  id: string;
  user_id: string;
  content_id: string;
  completed: boolean;
  completed_at?: string;
  time_spent: number;
  sat_content: {
    id: string;
    title: string;
    topic: string;
    content_type: string;
  };
}

interface UserStats {
  totalCompleted: number;
  totalContent: number;
  totalTimeSpent: number;
  completionPercentage: number;
}

interface TopicStats {
  [topic: string]: number;
}

class ApiService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    };
  }

  // Topic methods
  async getTopics(): Promise<Topic[]> {
    const response = await fetch(`${API_BASE_URL}/content/topics`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  // Content methods
  async getAllContent(): Promise<Content[]> {
    const response = await fetch(`${API_BASE_URL}/content/content`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  async getContentByTopic(topic: string): Promise<Content[]> {
    const response = await fetch(`${API_BASE_URL}/content/content/topic/${encodeURIComponent(topic)}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  async getContentById(id: string): Promise<Content> {
    const response = await fetch(`${API_BASE_URL}/content/content/${id}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  // User progress methods
  async getUserProgress(): Promise<UserProgress[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/content/progress`, { headers });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  async getContentProgress(userId: string, contentId: string): Promise<UserProgress | null> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/content/progress/${contentId}`, { headers });
    const data = await response.json();
    if (!data.success && data.message !== 'No progress found') throw new Error(data.message);
    return data.data || null;
  }

  async markContentCompleted(contentId: string, timeSpent: number = 0): Promise<UserProgress> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/content/progress/${contentId}/complete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ timeSpent })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  async getUserStats(): Promise<UserStats> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/content/stats`, { headers });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  async getTopicStats(): Promise<TopicStats> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/content/stats/topics`, { headers });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  // Storage methods
  async getPDFsByTopic(topic: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/storage/pdfs/${encodeURIComponent(topic)}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  async getTopicsWithPDFs(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/storage/topics`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  async syncStorageWithDatabase(): Promise<any> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/storage/sync`, {
      method: 'POST',
      headers
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

  async cleanupOrphanedContent(): Promise<any> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/storage/cleanup`, {
      method: 'POST',
      headers
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }

}

export const apiService = new ApiService();
export type { Topic, Content, UserProgress, UserStats, TopicStats };
