
import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
};
