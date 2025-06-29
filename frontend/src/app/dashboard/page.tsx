'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Target,
  BookOpen,
  Users,
  Calendar,
  Award
} from 'lucide-react';
import { formatProficiencyLevel, getLanguageName, timeAgo } from '@/lib/utils';

interface UserStats {
  session_count: number;
  total_messages: number;
  average_session_duration: number;
}

interface ProfileCompletion {
  completion_percentage: number;
  completed_fields: number;
  total_fields: number;
  missing_fields: {
    preferred_topics: boolean;
    learning_goals: boolean;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, profileResponse] = await Promise.all([
        userAPI.getUserStats(),
        userAPI.getProfileCompletion(),
      ]);
      
      setStats(statsResponse.data);
      setProfileCompletion(profileResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back, {user?.first_name}! 👋
              </h2>
              <p className="mt-1 text-blue-100">
                Ready to continue your {getLanguageName(user?.target_language || '')} learning journey?
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/conversations/new">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start New Conversation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Completion Card */}
        {profileCompletion && profileCompletion.completion_percentage < 100 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Target className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Complete Your Profile
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Your profile is {profileCompletion.completion_percentage}% complete. 
                  Add more details to get better personalized conversations.
                </p>
                <div className="mt-3">
                  <Link href="/profile">
                    <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
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
                <p className="text-sm font-medium text-gray-500">Total Messages</p>
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
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Level</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatProficiencyLevel(user?.proficiency_level || '')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/conversations/new">
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">New Conversation</p>
                    <p className="text-sm text-gray-500">Start practicing now</p>
                  </div>
                </div>
              </Link>

              <Link href="/progress">
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">View Progress</p>
                    <p className="text-sm text-gray-500">Track your improvement</p>
                  </div>
                </div>
              </Link>

              <Link href="/profile">
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Study Plan</p>
                    <p className="text-sm text-gray-500">Customize your learning</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Learning Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Goals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Learning Profile</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Native Language</span>
                <span className="text-sm text-gray-900">{getLanguageName(user?.native_language || '')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Target Language</span>
                <span className="text-sm text-gray-900">{getLanguageName(user?.target_language || '')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Current Level</span>
                <span className="text-sm text-gray-900">{formatProficiencyLevel(user?.proficiency_level || '')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Member Since</span>
                <span className="text-sm text-gray-900">{timeAgo(user?.created_at || '')}</span>
              </div>
              {user?.learning_goals && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Learning Goals</span>
                  <p className="text-sm text-gray-900 mt-1">{user.learning_goals}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              {stats?.session_count === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No conversations yet</p>
                  <Link href="/conversations/new">
                    <Button size="sm">Start Your First Conversation</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Last active: {user?.last_login ? timeAgo(user.last_login) : 'Never'}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    You've completed {stats?.session_count} conversation sessions and exchanged {stats?.total_messages} messages.
                  </div>
                  <Link href="/conversations">
                    <Button variant="outline" size="sm">View All Conversations</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 