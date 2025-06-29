'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Target,
  Award,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { formatDate, formatProficiencyLevel, getLanguageName } from '@/lib/utils';

interface UserStats {
  session_count: number;
  total_messages: number;
  average_session_duration: number;
}

interface ProfileCompletion {
  completion_percentage: number;
  completed_fields: number;
  total_fields: number;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const [statsResponse, profileResponse] = await Promise.all([
        userAPI.getUserStats(),
        userAPI.getProfileCompletion(),
      ]);
      
      setStats(statsResponse.data);
      setProfileCompletion(profileResponse.data);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for progress visualization
  const weeklyProgress = [
    { day: 'Mon', sessions: 2, messages: 15 },
    { day: 'Tue', sessions: 1, messages: 8 },
    { day: 'Wed', sessions: 3, messages: 22 },
    { day: 'Thu', sessions: 2, messages: 18 },
    { day: 'Fri', sessions: 1, messages: 12 },
    { day: 'Sat', sessions: 2, messages: 16 },
    { day: 'Sun', sessions: 1, messages: 9 },
  ];

  const achievements = [
    {
      title: 'First Conversation',
      description: 'Completed your first conversation',
      earned: true,
      date: '2024-01-10',
      icon: '🎉'
    },
    {
      title: 'Streak Master',
      description: 'Practice for 7 days in a row',
      earned: false,
      progress: 3,
      total: 7,
      icon: '🔥'
    },
    {
      title: 'Chatty Learner',
      description: 'Exchange 100 messages',
      earned: stats ? stats.total_messages >= 100 : false,
      progress: stats?.total_messages || 0,
      total: 100,
      icon: '💬'
    },
    {
      title: 'Conversation Expert',
      description: 'Complete 20 conversations',
      earned: stats ? stats.session_count >= 20 : false,
      progress: stats?.session_count || 0,
      total: 20,
      icon: '🏆'
    },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Progress">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Progress">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.session_count || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Messages Sent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.total_messages || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Session</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.average_session_duration ? 
                    `${Math.round(stats.average_session_duration)}m` : '0m'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Days Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.floor(Math.random() * 30) + 1}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Profile */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Learning Profile</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Target Language</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {getLanguageName(user?.target_language || '')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Current Level</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatProficiencyLevel(user?.proficiency_level || '')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Learning Since</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatDate(user?.created_at || '')}
                  </span>
                </div>
              </div>
              
              {profileCompletion && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Profile Completion</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {profileCompletion.completion_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion.completion_percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {profileCompletion.completed_fields} of {profileCompletion.total_fields} fields completed
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">This Week's Activity</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-4">
              {weeklyProgress.map((day, index) => (
                <div key={day.day} className="text-center">
                  <div className="text-sm font-medium text-gray-500 mb-2">{day.day}</div>
                  <div className="space-y-2">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <div className="text-lg font-bold text-blue-600">{day.sessions}</div>
                      <div className="text-xs text-blue-600">Sessions</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">{day.messages}</div>
                      <div className="text-xs text-green-600">Messages</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-green-800' : 'text-gray-700'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                      
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-green-500 mt-1">
                          Earned on {formatDate(achievement.date)}
                        </p>
                      )}
                      
                      {!achievement.earned && achievement.progress !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.total}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Increase Practice Frequency</p>
                  <p className="text-sm text-gray-500">
                    Try to have at least one conversation per day to maintain consistency.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-green-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Explore New Topics</p>
                  <p className="text-sm text-gray-500">
                    Branch out from your preferred topics to expand your vocabulary.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Award className="h-5 w-5 text-purple-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Challenge Yourself</p>
                  <p className="text-sm text-gray-500">
                    Consider increasing your difficulty level to accelerate progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 