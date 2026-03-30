import React, { ReactNode } from 'react';

interface DemoSectionProps {
  title: string;
  icon: ReactNode;
  iconColorClass?: string;
  children: ReactNode;
}

export default function DemoSection({ 
  title, 
  icon, 
  iconColorClass = "text-blue-600",
  children 
}: DemoSectionProps) {
  return (
    <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center gap-2 font-bold ${iconColorClass}`}>
          {icon}
          <span className="text-lg">{title}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {children}
      </div>
    </section>
  );
}
