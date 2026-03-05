import { useState } from 'react';

interface AutoCloseToggleProps {
  isCollapsed: boolean;
}

export const AutoCloseToggle = ({ isCollapsed }: AutoCloseToggleProps) => {
  const [isAutoCloseEnabled, setIsAutoCloseEnabled] = useState(true);

  const handleToggle = () => {
    setIsAutoCloseEnabled(!isAutoCloseEnabled);
    // TODO: API call to update store status
  };

  return (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
      <span className={`text-gray-300 text-sm font-medium ${isCollapsed ? 'hidden' : 'block'}`}>
        Auto-Close
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isAutoCloseEnabled} 
          onChange={handleToggle}
        />
        <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
      </label>
    </div>
  );
};
