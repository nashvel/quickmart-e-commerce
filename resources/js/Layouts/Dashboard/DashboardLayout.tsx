import { useState, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { UserRole } from './types';
import { getMenuItems } from './config/menuItems';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

interface DashboardLayoutProps {
  children: ReactNode;
  role?: UserRole;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false);
  const { props, url } = usePage();
  
  // Get user role from Inertia props if not explicitly passed
  const userRole = role || ((props.auth as any)?.user?.role) || 'seller';
  const menuItems = getMenuItems(userRole);

  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleCloseMobile = () => setIsOpenOnMobile(false);
  const handleToggleMobile = () => setIsOpenOnMobile(!isOpenOnMobile);

  return (
    <div className="relative h-screen bg-white font-sans">
      <Sidebar
        isCollapsed={isCollapsed}
        isOpenOnMobile={isOpenOnMobile}
        menuItems={menuItems}
        userRole={userRole}
        activeUrl={url}
        onToggleCollapse={handleToggleCollapse}
        onCloseMobile={handleCloseMobile}
        onToggleMobile={handleToggleMobile}
      />

      {/* Main Content */}
      <div className={`flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header userRole={userRole} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
