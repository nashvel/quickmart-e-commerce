import React from 'react';

interface TabButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-200 focus:outline-none ${
      isActive
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}{' '}
    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
      isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
    }`}>
      {count}
    </span>
  </button>
);
