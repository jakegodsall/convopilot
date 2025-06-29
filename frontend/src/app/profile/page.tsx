'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { 
  proficiencyLevels, 
  commonTopics, 
  languageNames, 
  getLanguageName,
  formatProficiencyLevel 
} from '@/lib/utils';
import { User, Save, AlertTriangle } from 'lucide-react';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  native_language: z.string().min(1, 'Please select your native language'),
  target_language: z.string().min(1, 'Please select your target language'),
  proficiency_level: z.string().min(1, 'Please select your proficiency level'),
  learning_goals: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const nativeLanguage = watch('native_language');

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        native_language: user.native_language,
        target_language: user.target_language,
        proficiency_level: user.proficiency_level,
        learning_goals: user.learning_goals || '',
      });
      setSelectedTopics(user.preferred_topics || []);
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await userAPI.updateProfile({
        ...data,
        preferred_topics: selectedTopics,
      });
      
      // Update user in context
      updateUser({
        ...data,
        preferred_topics: selectedTopics,
      });
      
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleDeactivateAccount = async () => {
    try {
      await userAPI.deactivateAccount();
      toast.success('Account deactivated successfully');
      // The auth context will handle logout
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to deactivate account';
      toast.error(message);
    }
  };

  const languageOptions = Object.entries(languageNames).map(([code, name]) => ({
    value: code,
    label: name,
  }));

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-gray-500">@{user?.username}</p>
                <p className="text-sm text-gray-500">
                  Learning {getLanguageName(user?.target_language || '')} • {formatProficiencyLevel(user?.proficiency_level || '')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  {...register('first_name')}
                  label="First Name"
                  error={errors.first_name?.message}
                  required
                />
                <Input
                  {...register('last_name')}
                  label="Last Name"
                  error={errors.last_name?.message}
                  required
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {user?.email} (cannot be changed)
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Username:</strong> @{user?.username} (cannot be changed)
                </p>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Language Settings</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  {...register('native_language')}
                  label="Native Language"
                  error={errors.native_language?.message}
                  required
                  options={[
                    { value: '', label: 'Select your native language' },
                    ...languageOptions,
                  ]}
                />
                <Select
                  {...register('target_language')}
                  label="Target Language"
                  error={errors.target_language?.message}
                  required
                  options={[
                    { value: '', label: 'Select language to learn' },
                    ...languageOptions.filter(lang => lang.value !== nativeLanguage),
                  ]}
                />
              </div>
              <Select
                {...register('proficiency_level')}
                label="Current Proficiency Level"
                error={errors.proficiency_level?.message}
                required
                options={[
                  { value: '', label: 'Select your current level' },
                  ...proficiencyLevels,
                ]}
                helperText="Update this as you progress in your learning journey"
              />
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Learning Preferences</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <Input
                {...register('learning_goals')}
                label="Learning Goals"
                placeholder="e.g., Travel to Spain, Business communication, Academic purposes..."
                error={errors.learning_goals?.message}
                helperText="What do you want to achieve with your language learning?"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Topics
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Select topics you enjoy discussing. This helps personalize your conversations.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {commonTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        selectedTopics.includes(topic)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                {selectedTopics.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedTopics.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={isLoading}
              disabled={!isDirty && selectedTopics.join(',') === (user?.preferred_topics || []).join(',')}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="bg-white shadow-sm rounded-lg border border-red-200">
          <div className="px-6 py-4 border-b border-red-200">
            <h3 className="text-lg font-medium text-red-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Danger Zone
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Deactivate Account</h4>
                <p className="text-sm text-gray-500">
                  Once you deactivate your account, all of your data will be permanently removed.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Account Deactivation
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to deactivate your account? This action cannot be undone 
                and all your conversation history will be permanently deleted.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeactivateAccount}
                >
                  Yes, Deactivate
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 