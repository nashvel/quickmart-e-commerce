import { Link } from '@inertiajs/react';
import { Store, Menu, X } from 'lucide-react';
import { MenuItem, UserRole } from '../types';
import { getRoleName } from '../config/menuItems';
import { DateTimeDisplay } from './DateTimeDisplay';
import { AutoCloseToggle } from './AutoCloseToggle';

interface SidebarProps {
  isCollapsed: boolean;
  isOpenOnMobile: boolean;
  menuItems: MenuItem[];
  userRole: UserRole;
  activeUrl: string;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onToggleMobile: () => void;
}

export const Sidebar = ({
  isCollapsed,
  isOpenOnMobile,
  menuItems,
  userRole,
  activeUrl,
  onToggleCollapse,
  onCloseMobile,
  onToggleMobile,
}: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${
          isOpenOnMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
      />

      {/* Mobile Menu Button */}
      <button 
        onClick={onToggleMobile} 
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white text-gray-800 shadow-lg"
      >
        {isOpenOnMobile ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed flex flex-col bg-blue-800 shadow-lg z-40 h-full transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo */}
        <div 
          className={`flex items-center h-20 px-4 border-b border-blue-900 cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          onClick={onToggleCollapse}
        >
          <Store className="text-white text-3xl flex-shrink-0" size={32} />
          <span className={`ml-3 text-xl font-bold text-white whitespace-nowrap ${
            isCollapsed ? 'hidden' : 'block'
          }`}>
            {getRoleName(userRole)}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeUrl === item.path
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-300 hover:bg-blue-600 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onCloseMobile();
                }
              }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className={`flex-grow ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-blue-900">
          <DateTimeDisplay isCollapsed={isCollapsed} />
          <AutoCloseToggle isCollapsed={isCollapsed} />
        </div>
      </aside>
    </>
  );
};
