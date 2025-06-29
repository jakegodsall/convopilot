'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  ArrowRight 
} from 'lucide-react';

// Mock data for demonstration - replace with real API calls when backend is ready
const mockConversations = [
  {
    id: '1',
    title: 'Travel Planning Conversation',
    topic: 'Travel',
    language: 'Spanish',
    message_count: 15,
    duration: 25,
    created_at: new Date('2024-01-15T10:30:00'),
    last_updated: new Date('2024-01-15T10:55:00'),
    status: 'completed'
  },
  {
    id: '2', 
    title: 'Business Meeting Discussion',
    topic: 'Business',
    language: 'Spanish',
    message_count: 8,
    duration: 15,
    created_at: new Date('2024-01-14T14:20:00'),
    last_updated: new Date('2024-01-14T14:35:00'),
    status: 'completed'
  },
  {
    id: '3',
    title: 'Food & Cooking Chat',
    topic: 'Food & Cooking',
    language: 'Spanish', 
    message_count: 22,
    duration: 35,
    created_at: new Date('2024-01-13T16:45:00'),
    last_updated: new Date('2024-01-13T17:20:00'),
    status: 'completed'
  }
];

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');

  const filteredConversations = mockConversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterTopic === 'all' || conv.topic === filterTopic;
    return matchesSearch && matchesFilter;
  });

  const topics = ['all', ...Array.from(new Set(mockConversations.map(c => c.topic)))];

  return (
    <DashboardLayout title="Conversations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Conversations</h2>
            <p className="text-sm text-gray-600 mt-1">
              Continue practicing or start a new conversation
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/conversations/new">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic === 'all' ? 'All Topics' : topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterTopic !== 'all' ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterTopic !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start your first conversation to begin practicing!'
              }
            </p>
            <Link href="/conversations/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {conversation.title}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {conversation.topic}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {conversation.message_count} messages
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {conversation.duration} min
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {conversation.created_at.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      Last updated: {conversation.last_updated.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link href={`/conversations/${conversation.id}`}>
                      <Button variant="outline" size="sm">
                        View
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredConversations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {filteredConversations.length}
                </p>
                <p className="text-sm text-gray-600">Total Conversations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredConversations.reduce((sum, conv) => sum + conv.message_count, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Messages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(filteredConversations.reduce((sum, conv) => sum + conv.duration, 0) / filteredConversations.length) || 0}m
                </p>
                <p className="text-sm text-gray-600">Avg. Duration</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 