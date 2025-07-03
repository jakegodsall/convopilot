import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      Cookies.remove('access_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (userData: RegisterData) => 
    api.post('/api/auth/register', userData),
  
  login: (credentials: LoginData) => 
    api.post('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    }),
  
  checkEmailAvailability: (email: string) => 
    api.post('/api/auth/check-email', null, { params: { email } }),
  
  checkUsernameAvailability: (username: string) => 
    api.post('/api/auth/check-username', null, { params: { username } }),
};

// User API endpoints
export const userAPI = {
  getCurrentUser: () => api.get('/api/users/me'),
  updateProfile: (userData: UserUpdateData) => api.put('/api/users/me', userData),
  getUserStats: () => api.get('/api/users/me/stats'),
  getProfileCompletion: () => api.get('/api/users/profile-completion'),
  getLanguagePeers: () => api.get('/api/users/language-peers'),
  getStatistics: () => api.get('/api/users/statistics'),
  deactivateAccount: () => api.delete('/api/users/me'),
};

// Sessions API endpoints (placeholder for future implementation)
export const sessionAPI = {
  getSessions: () => api.get('/sessions'),
  createSession: (sessionData: any) => api.post('/sessions', sessionData),
  getSession: (id: string) => api.get(`/sessions/${id}`),
  updateSession: (id: string, sessionData: any) => api.put(`/sessions/${id}`, sessionData),
};

// Feedback API endpoints (placeholder for future implementation)
export const feedbackAPI = {
  getFeedback: (sessionId: string) => api.get(`/feedback/${sessionId}`),
  submitFeedback: (feedbackData: any) => api.post('/feedback', feedbackData),
};

// Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  native_language: string;
  target_language: string;
  proficiency_level: string;
  preferred_topics?: string;
  learning_goals?: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  native_language?: string;
  target_language?: string;
  proficiency_level?: string;
  preferred_topics?: string[];
  learning_goals?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  native_language: string;
  target_language: string;
  proficiency_level: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
  preferred_topics?: string[];
  learning_goals?: string;
}

export interface UserWithStats extends User {
  session_count?: number;
  total_messages?: number;
  average_session_duration?: number;
}

export default api; 