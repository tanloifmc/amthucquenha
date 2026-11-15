'use client';
import React from 'react';
import { cn } from '@/lib/utils';

export function MarqueeRibbon({
  items,
  className,
}: {
  items: Array<{ icon?: React.ReactNode; text: string; sub?: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-gradient-to-r from-[#5A1015] via-[#8B1D24] to-[#5A1015] py-3.5 border-y border-[#C58940]/40 text-amber-100 shadow-inner select-none',
        className
      )}
    >
      {/* Subtle edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#5A1015] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#5A1015] to-transparent z-10" />

      <div className="flex w-max animate-marquee space-x-8 sm:space-x-12 items-center">
        {/* Double list for seamless loop */}
        {[...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap text-[#FDF6EE]"
          >
            {item.icon && <span className="text-[#F6D38B]">{item.icon}</span>}
            <span>{item.text}</span>
            {item.sub && (
              <span className="text-[10px] text-[#C58940] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 border border-[#C58940]/30">
                {item.sub}
              </span>
            )}
            <span className="text-[#C58940]/60 mx-2 text-base">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
