'use client';

import { ReactNode } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {title && (
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </header>
          )}
          
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 