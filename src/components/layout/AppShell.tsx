'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UserProfile, TEST_PROFILES } from '@/lib/auth/permissions';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(TEST_PROFILES.bgd);

  useEffect(() => {
    const saved = localStorage.getItem('quenha_current_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        setCurrentUser(TEST_PROFILES.bgd);
      }
    }
  }, []);

  const handleSwitchUser = (newUser: UserProfile) => {
    setCurrentUser(newUser);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex">
      {/* Sidebar */}
      <Sidebar
        user={currentUser}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={currentUser}
          onOpenSidebar={() => setSidebarOpen(true)}
          onSwitchUser={handleSwitchUser}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
