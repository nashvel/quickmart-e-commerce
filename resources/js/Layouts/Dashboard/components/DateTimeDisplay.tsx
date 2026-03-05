import { useState, useEffect } from 'react';

interface DateTimeDisplayProps {
  isCollapsed: boolean;
}

export const DateTimeDisplay = ({ isCollapsed }: DateTimeDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`transition-all duration-300 overflow-hidden ${
      isCollapsed ? 'opacity-0 max-h-0' : 'opacity-100 max-h-40 mb-4'
    }`}>
      <div className="flex items-center justify-around text-center p-2 rounded-lg bg-blue-700">
        <div>
          <div className="text-xs font-bold text-blue-300">
            {currentTime.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}
          </div>
          <div className="text-2xl font-bold text-white">{currentTime.getDate()}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-xs text-blue-300">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long' })}
          </div>
        </div>
      </div>
    </div>
  );
};
