'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { commonTopics, proficiencyLevels, getLanguageName } from '@/lib/utils';
import { MessageSquare, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConversationSettings {
  topic: string;
  customTopic: string;
  difficulty: string;
  scenario: string;
  goals: string;
}

const scenarios = [
  { value: 'casual', label: 'Casual Conversation' },
  { value: 'formal', label: 'Formal Discussion' },
  { value: 'roleplay', label: 'Role-Play Scenario' },
  { value: 'debate', label: 'Friendly Debate' },
  { value: 'interview', label: 'Interview Practice' },
  { value: 'storytelling', label: 'Storytelling' },
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner - Simple vocabulary and short sentences' },
  { value: 'intermediate', label: 'Intermediate - More complex topics and grammar' },
  { value: 'advanced', label: 'Advanced - Complex discussions and nuanced language' },
];

export default function NewConversationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<ConversationSettings>({
    topic: '',
    customTopic: '',
    difficulty: user?.proficiency_level || 'intermediate',
    scenario: 'casual',
    goals: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && !settings.topic && !settings.customTopic) {
      toast.error('Please select a topic or enter a custom one');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleTopicSelect = (topic: string) => {
    setSettings(prev => ({ ...prev, topic, customTopic: '' }));
  };

  const handleCustomTopicChange = (customTopic: string) => {
    setSettings(prev => ({ ...prev, customTopic, topic: '' }));
  };

  const handleStartConversation = async () => {
    setIsLoading(true);
    try {
      // This is where you'd make an API call to create a new conversation session
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalTopic = settings.topic || settings.customTopic;
      toast.success(`Starting conversation about ${finalTopic}!`);
      
      // In the future, redirect to the actual conversation interface
      // router.push(`/conversations/${newConversationId}`);
      
      // For now, redirect back to conversations list
      router.push('/conversations');
    } catch (error) {
      toast.error('Failed to start conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="New Conversation">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i}
                </div>
                {i < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      i < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Choose Topic</span>
            <span>Set Parameters</span>
            <span>Review & Start</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Step 1: Topic Selection */}
          {step === 1 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Topic</h2>
                <p className="text-gray-600 mt-2">
                  What would you like to practice today?
                </p>
              </div>

              <div className="space-y-6">
                {/* Popular Topics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Popular Topics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {commonTopics.slice(0, 12).map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleTopicSelect(topic)}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          settings.topic === topic
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Topic */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Or Create Your Own</h3>
                  <Input
                    value={settings.customTopic}
                    onChange={(e) => handleCustomTopicChange(e.target.value)}
                    placeholder="Enter a custom topic..."
                    className={settings.customTopic ? 'ring-2 ring-blue-500' : ''}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext} className="flex items-center">
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Conversation Parameters */}
          {step === 2 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Customize Your Experience</h2>
                <p className="text-gray-600 mt-2">
                  Let's tailor the conversation to your needs
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected Topic:</strong> {settings.topic || settings.customTopic}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Target Language:</strong> {getLanguageName(user?.target_language || '')}
                  </p>
                </div>

                <Select
                  value={settings.difficulty}
                  onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                  label="Difficulty Level"
                  options={difficultyLevels}
                  helperText="Choose based on your comfort level"
                />

                <Select
                  value={settings.scenario}
                  onChange={(e) => setSettings(prev => ({ ...prev, scenario: e.target.value }))}
                  label="Conversation Style"
                  options={scenarios}
                  helperText="What type of conversation would you like?"
                />

                <Input
                  value={settings.goals}
                  onChange={(e) => setSettings(prev => ({ ...prev, goals: e.target.value }))}
                  label="Learning Goals (Optional)"
                  placeholder="e.g., Practice past tense, improve pronunciation..."
                  helperText="What specific aspect would you like to focus on?"
                />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} className="flex items-center">
                    Review
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review and Start */}
          {step === 3 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Ready to Start!</h2>
                <p className="text-gray-600 mt-2">
                  Review your conversation settings below
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Topic:</span>
                    <span className="text-gray-900">{settings.topic || settings.customTopic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Language:</span>
                    <span className="text-gray-900">{getLanguageName(user?.target_language || '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Difficulty:</span>
                    <span className="text-gray-900 capitalize">{settings.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Style:</span>
                    <span className="text-gray-900">
                      {scenarios.find(s => s.value === settings.scenario)?.label}
                    </span>
                  </div>
                  {settings.goals && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="font-medium text-gray-700">Goals:</span>
                      <p className="text-gray-900 mt-1">{settings.goals}</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> The AI will adapt to your responses and provide feedback 
                    to help you improve. Don't worry about making mistakes - they're part of learning!
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack} className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleStartConversation} 
                  loading={isLoading}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Starting...' : 'Start Conversation'}
                  <MessageSquare className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 