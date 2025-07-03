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
import { ArrowRight, ArrowLeft, CheckCircle, Lock, Globe, Target, Sparkles } from 'lucide-react';
import { RegisterData } from '@/lib/api';

// Step schemas for validation
const step1Schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const step2Schema = z.object({
  native_language: z.string().min(1, 'Please select your native language'),
  target_language: z.string().min(1, 'Please select your target language'),
  proficiency_level: z.string().min(1, 'Please select your proficiency level'),
});

const step3Schema = z.object({
  learning_goals: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

interface OnboardingData {
  step1: Partial<Step1Data>;
  step2: Partial<Step2Data>;
  step3: Partial<Step3Data>;
  selectedTopics: string[];
}

const steps = [
  { 
    number: 1, 
    title: 'Create Account', 
    description: 'Set up your login credentials',
    icon: Lock 
  },
  { 
    number: 2, 
    title: 'Language Setup', 
    description: 'Choose your languages',
    icon: Globe 
  },
  { 
    number: 3, 
    title: 'Learning Goals', 
    description: 'Customize your experience',
    icon: Target 
  },
  { 
    number: 4, 
    title: 'Welcome!', 
    description: 'You\'re all set',
    icon: Sparkles 
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    step1: {},
    step2: {},
    step3: {},
    selectedTopics: [],
  });

  // Form for current step
  const getFormSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      default: return z.object({});
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(getFormSchema()),
    defaultValues: onboardingData[`step${currentStep}` as keyof OnboardingData] as any,
  });

  const nativeLanguage = watch('native_language');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // Reset form when step changes
  useEffect(() => {
    const stepData = onboardingData[`step${currentStep}` as keyof OnboardingData];
    if (stepData && typeof stepData === 'object') {
      reset(stepData);
    }
  }, [currentStep, reset, onboardingData]);

  const saveStepData = (data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [`step${currentStep}`]: data,
    }));
  };

  const handleNext = async (data: any) => {
    const isValid = await trigger();
    if (!isValid) return;

    saveStepData(data);

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTopicToggle = (topic: string) => {
    setOnboardingData(prev => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topic)
        ? prev.selectedTopics.filter(t => t !== topic)
        : [...prev.selectedTopics, topic]
    }));
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      const {
        email,
        username,
        password,
        native_language,
        target_language,
        proficiency_level,
      } = onboardingData.step1 as any;

      

      const registerData: RegisterData = {
        email: onboardingData.step1.email!,
        username: onboardingData.step1.username!,
        password: onboardingData.step1.password!,
        native_language: onboardingData.step2.native_language!,
        target_language: onboardingData.step2.target_language!,
        proficiency_level: onboardingData.step2.proficiency_level!,
        learning_goals: onboardingData.step3.learning_goals || undefined,
        preferred_topics: onboardingData.selectedTopics.length > 0
          ? JSON.stringify(onboardingData.selectedTopics)
          : undefined,
      };

      console.log(registerData)
      
      await registerUser(registerData);
      setCurrentStep(4);
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-blue-600">ConvoPilot</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStep === 4 ? 'Welcome to ConvoPilot!' : 'Join ConvoPilot'}
          </h2>
          <p className="text-gray-600">
            {currentStep === 4 
              ? 'Your account has been created successfully!'
              : 'Start your language learning journey today'
            }
          </p>
        </div>

        {/* Progress Indicator - Only show after first step */}
        {currentStep > 1 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                        currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {currentStep === 1 && (
              <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
                <div className="text-center mb-6">
                  <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Create Your Account</h3>
                  <p className="text-gray-600">Set up your login credentials</p>
                </div>

                <Input
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  error={errors.email?.message as string}
                  required
                  autoComplete="email"
                />

                <Input
                  {...register('username')}
                  label="Username"
                  error={errors.username?.message as string}
                  required
                  autoComplete="username"
                  helperText="This will be your unique identifier"
                />

                <Input
                  {...register('password')}
                  type="password"
                  label="Password"
                  error={errors.password?.message as string}
                  required
                  autoComplete="new-password"
                />

                <Input
                  {...register('confirmPassword')}
                  type="password"
                  label="Confirm Password"
                  error={errors.confirmPassword?.message as string}
                  required
                  autoComplete="new-password"
                />

                <Button type="submit" className="w-full flex items-center justify-center">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
                <div className="text-center mb-6">
                  <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Language Setup</h3>
                  <p className="text-gray-600">Choose your languages and current level</p>
                </div>

                <Select
                  {...register('native_language')}
                  label="Native Language"
                  error={errors.native_language?.message as string}
                  required
                  options={[
                    { value: '', label: 'Select your native language' },
                    ...languageOptions,
                  ]}
                />

                <Select
                  {...register('target_language')}
                  label="Target Language"
                  error={errors.target_language?.message as string}
                  required
                  options={[
                    { value: '', label: 'Select language to learn' },
                    ...languageOptions.filter(lang => lang.value !== nativeLanguage),
                  ]}
                />

                <Select
                  {...register('proficiency_level')}
                  label="Current Proficiency Level"
                  error={errors.proficiency_level?.message as string}
                  required
                  options={[
                    { value: '', label: 'Select your current level' },
                    ...proficiencyLevels,
                  ]}
                  helperText="Be honest - this helps us personalize your experience"
                />

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 flex items-center justify-center">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Learning Preferences</h3>
                  <p className="text-gray-600">Customize your learning experience</p>
                </div>

                <form onSubmit={handleSubmit(() => {})} className="space-y-6">
                  <Input
                    {...register('learning_goals')}
                    label="Learning Goals (Optional)"
                    placeholder="e.g., Travel to Spain, Business communication..."
                    error={errors.learning_goals?.message as string}
                    helperText="What do you want to achieve?"
                  />
                </form>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Topics (Optional)
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Select topics you'd like to practice. You can change these later.
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {commonTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleTopicToggle(topic)}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                          onboardingData.selectedTopics.includes(topic)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                  {onboardingData.selectedTopics.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {onboardingData.selectedTopics.join(', ')}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleFinalSubmit}
                    loading={isLoading}
                    className="flex-1 flex items-center justify-center"
                  >
                    Create Account
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <Sparkles className="w-16 h-16 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to ConvoPilot! 🎉
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your account has been created successfully. You're ready to start your language learning journey!
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-blue-900 mb-2">What's next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Complete your first conversation</li>
                    <li>• Explore different topics</li>
                    <li>• Track your progress</li>
                    <li>• Set learning goals</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                  size="lg"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Skip option for steps 2-3 */}
        {currentStep > 1 && currentStep < 4 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip and complete later
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 