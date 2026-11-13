'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { UserProfile } from '@/lib/auth/permissions';

interface BranchSelectorProps {
  user: UserProfile;
  className?: string;
}

export function BranchSelector({ user, className = '' }: BranchSelectorProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  useEffect(() => {
    const saved = localStorage.getItem('quenha_active_branch');
    if (saved) {
      setSelectedBranchId(saved);
    } else if (!user.is_all_branches && user.branches.length > 0) {
      setSelectedBranchId(String(user.branches[0].id));
    }
  }, [user]);

  const handleChange = (newId: string) => {
    setSelectedBranchId(newId);
    localStorage.setItem('quenha_active_branch', newId);
    // Dispatch custom event để các component lắng nghe thay đổi branch
    window.dispatchEvent(new Event('branch_changed'));
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute left-3 pointer-events-none text-[#8B1D24]">
        <MapPin className="w-4 h-4" />
      </div>
      <select
        value={selectedBranchId}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none bg-[#F7EAEB]/60 hover:bg-[#F7EAEB] border border-[#8B1D24]/20 rounded-lg pl-9 pr-8 py-1.5 text-xs font-semibold text-[#8B1D24] focus:outline-none focus:ring-1 focus:ring-[#8B1D24] cursor-pointer transition-colors"
      >
        {user.is_all_branches && (
          <option value="all">Toàn chuỗi (4 chi nhánh)</option>
        )}
        {user.branches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-[#8B1D24]">
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
