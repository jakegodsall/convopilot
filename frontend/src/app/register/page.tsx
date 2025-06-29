'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { proficiencyLevels, commonTopics, languageNames } from '@/lib/utils';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  native_language: z.string().min(1, 'Please select your native language'),
  target_language: z.string().min(1, 'Please select your target language'),
  proficiency_level: z.string().min(1, 'Please select your proficiency level'),
  learning_goals: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const nativeLanguage = watch('native_language');
  const targetLanguage = watch('target_language');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser({
        ...registerData,
        preferred_topics: selectedTopics.length > 0 ? selectedTopics : undefined,
      });
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
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

  const languageOptions = Object.entries(languageNames).map(([code, name]) => ({
    value: code,
    label: name,
  }));

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-600">ConvoPilot</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    {...register('first_name')}
                    label="First Name"
                    error={errors.first_name?.message}
                    required
                    autoComplete="given-name"
                  />
                  <Input
                    {...register('last_name')}
                    label="Last Name"
                    error={errors.last_name?.message}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <Input
                    {...register('email')}
                    type="email"
                    label="Email Address"
                    error={errors.email?.message}
                    required
                    autoComplete="email"
                  />
                  <Input
                    {...register('username')}
                    label="Username"
                    error={errors.username?.message}
                    required
                    autoComplete="username"
                    helperText="This will be your unique identifier on ConvoPilot"
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      {...register('password')}
                      type="password"
                      label="Password"
                      error={errors.password?.message}
                      required
                      autoComplete="new-password"
                    />
                    <Input
                      {...register('confirmPassword')}
                      type="password"
                      label="Confirm Password"
                      error={errors.confirmPassword?.message}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              {/* Language Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Language Preferences</h3>
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
                <div className="mt-4">
                  <Select
                    {...register('proficiency_level')}
                    label="Current Proficiency Level"
                    error={errors.proficiency_level?.message}
                    required
                    options={[
                      { value: '', label: 'Select your current level' },
                      ...proficiencyLevels,
                    ]}
                    helperText="Be honest about your current level - this helps us personalize your experience"
                  />
                </div>
              </div>

              {/* Learning Goals */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Goals (Optional)</h3>
                <Input
                  {...register('learning_goals')}
                  label="What do you want to achieve?"
                  placeholder="e.g., Travel to Spain, Business communication, Academic purposes..."
                  error={errors.learning_goals?.message}
                  helperText="This helps us tailor conversations to your interests"
                />
              </div>

              {/* Preferred Topics */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Topics (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select topics you'd like to practice. You can change these later.
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

              <div className="pt-6">
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 