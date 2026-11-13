'use client';

import React, { useEffect, useState } from 'react';
import { getLookups, SystemLookup } from '@/lib/utils/lookups';

interface LookupSelectProps {
  groupCode: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

export function LookupSelect({
  groupCode,
  value,
  onChange,
  placeholder = '-- Chọn mục --',
  disabled = false,
  required = false,
  className = '',
  id,
}: LookupSelectProps) {
  const [items, setItems] = useState<SystemLookup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getLookups(groupCode)
      .then((data) => {
        if (mounted) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [groupCode]);

  return (
    <div className="relative inline-block w-full">
      <select
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        required={required}
        className={`w-full appearance-none rounded-md border border-[#D5C9BC] bg-white px-3 py-2 text-sm text-[#231F20] shadow-xs focus:border-[#8B1D24] focus:outline-none focus:ring-1 focus:ring-[#8B1D24] disabled:bg-[#F5EFE6] disabled:text-[#9C8E82] transition-colors cursor-pointer ${className}`}
      >
        <option value="" disabled={required}>
          {loading ? 'Đang tải danh mục...' : placeholder}
        </option>
        {items.map((item) => (
          <option key={item.value_code} value={item.value_code}>
            {item.label_vi}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6B5E55]">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
