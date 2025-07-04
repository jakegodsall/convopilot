import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(date);
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatProficiencyLevel(level: string): string {
  return level.split('_').map(capitalizeFirst).join(' ');
}

export const languageNames: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
  'pl': 'Polish',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian',
  'fi': 'Finnish',
};

export function getLanguageName(code: string): string {
  return languageNames[code] || code.toUpperCase();
}

export const proficiencyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'elementary', label: 'Elementary' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'upper_intermediate', label: 'Upper Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'proficient', label: 'Proficient' },
];

export const commonTopics = [
  'Travel',
  'Food & Cooking',
  'Business',
  'Technology',
  'Sports',
  'Music',
  'Movies & TV',
  'Books & Literature',
  'Science',
  'History',
  'Art & Culture',
  'Health & Fitness',
  'Fashion',
  'Environment',
  'Politics',
  'Education',
  'Family & Relationships',
  'Hobbies',
  'Current Events',
  'Shopping',
];

// Helper functions for user language data
export function getUserNativeLanguageCode(user: any): string {
  return user?.native_language?.code || '';
}

export function getUserTargetLanguageCode(user: any): string {
  return user?.current_language?.language?.code || '';
}

export function getUserProficiencyLevel(user: any): string {
  return user?.current_language?.proficiency_level || '';
}

// Error handling utility
export function getErrorMessage(error: any): string {
  // Check if it's an axios error with response data
  if (error?.response?.data) {
    const { detail } = error.response.data;
    
    // If detail is a string, return it directly
    if (typeof detail === 'string') {
      return detail;
    }
    
    // If detail is an array of validation errors
    if (Array.isArray(detail)) {
      return detail.map((err: any) => {
        if (typeof err === 'string') return err;
        if (err.msg) return err.msg;
        return 'Validation error';
      }).join(', ');
    }
    
    // If detail is an object with validation error
    if (detail && typeof detail === 'object' && detail.msg) {
      return detail.msg;
    }
    
    // Fallback to any message field
    if (error.response.data.message) {
      return error.response.data.message;
    }
  }
  
  // Fallback to error message
  if (error?.message) {
    return error.message;
  }
  
  // Default fallback
  return 'An unexpected error occurred';
} 