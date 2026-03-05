import { useState } from 'react';
import { router } from '@inertiajs/react';
import { UserCircle, Settings, LogOut } from 'lucide-react';

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      router.post('/logout', {}, {
        onSuccess: () => {
          window.location.href = '/';
        },
        onError: (errors) => {
          console.error('Logout error:', errors);
          window.location.href = '/';
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
      >
        <UserCircle size={24} />
      </button>
      <div className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-out ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="p-2">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <UserCircle size={18} />
            <span>Profile</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <div className="my-1 border-t border-gray-100"></div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
