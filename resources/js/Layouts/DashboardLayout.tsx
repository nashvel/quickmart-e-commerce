import React, { useState, ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
  Store, 
  LayoutDashboard, 
  ListChecks, 
  ClipboardList, 
  Star, 
  MessageSquare, 
  Settings,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  UserCircle,
  LogOut,
  Package,
  Plus,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  role?: 'seller' | 'admin' | 'rider';
}

interface MenuItem {
  path: string;
  icon: ReactNode;
  label: string;
  children?: MenuItem[];
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAutoCloseEnabled, setIsAutoCloseEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { url, props } = usePage();
  
  // Get user role from Inertia props if not explicitly passed
  const userRole = role || (props.auth?.user?.role) || 'seller';

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    setIsProductsOpen(url.startsWith('/seller/products'));
  }, [url]);

  const sellerMenuItems: MenuItem[] = [
    { path: '/seller/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/seller/products/manage', icon: <ListChecks size={20} />, label: 'Manage Products' },
    { path: '/seller/orders', icon: <ClipboardList size={20} />, label: 'Orders' },
    { path: '/seller/reviews', icon: <Star size={20} />, label: 'Reviews' },
    { path: '/seller/chat', icon: <MessageSquare size={20} />, label: 'Chat' },
    { path: '/seller/manage-store', icon: <Settings size={20} />, label: 'Manage Store' },
  ];

  const adminMenuItems: MenuItem[] = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/users', icon: <UserCircle size={20} />, label: 'Users' },
    { path: '/admin/stores', icon: <Store size={20} />, label: 'Stores' },
    { path: '/admin/orders', icon: <ClipboardList size={20} />, label: 'Orders' },
    { path: '/admin/promotions', icon: <Star size={20} />, label: 'Promotions' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const riderMenuItems: MenuItem[] = [
    { path: '/rider/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/rider/deliveries', icon: <ClipboardList size={20} />, label: 'Deliveries' },
    { path: '/rider/earnings', icon: <DollarSign size={20} />, label: 'Earnings' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userRole === 'rider' ? riderMenuItems : sellerMenuItems;

  const handleToggleAutoClose = () => {
    setIsAutoCloseEnabled(!isAutoCloseEnabled);
    // TODO: API call to update store status
  };

  const handleLogout = async () => {
    try {
      // Use Inertia router with explicit options
      router.post('/logout', {}, {
        onSuccess: () => {
          // Force a page reload to ensure clean state
          window.location.href = '/';
        },
        onError: (errors) => {
          console.error('Logout error:', errors);
          // Fallback: force reload anyway
          window.location.href = '/';
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: force reload
      window.location.href = '/';
    }
  };

  return (
    <div className="relative h-screen bg-white font-sans">
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${
          isOpenOnMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpenOnMobile(false)}
      />

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpenOnMobile(!isOpenOnMobile)} 
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
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Store className="text-white text-3xl flex-shrink-0" size={32} />
          <span className={`ml-3 text-xl font-bold text-white whitespace-nowrap ${
            isCollapsed ? 'hidden' : 'block'
          }`}>
            {userRole === 'admin' ? 'Admin Panel' : userRole === 'rider' ? 'Rider Panel' : 'Client Panel'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  url === item.path
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-300 hover:bg-blue-600 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsOpenOnMobile(false);
                  }
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`flex-grow ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>
                  {item.label}
                </span>
              </Link>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-blue-900">
          {/* Date/Time Display */}
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

          {/* Auto-Close Toggle */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <span className={`text-gray-300 text-sm font-medium ${isCollapsed ? 'hidden' : 'block'}`}>
              Auto-Close
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isAutoCloseEnabled} 
                onChange={handleToggleAutoClose}
              />
              <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-blue-200 h-24">
          {/* Search Bar */}
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="text-blue-500" size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2.5 border border-blue-300 rounded-full bg-blue-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Quick Access */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/seller/products/manage"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-sm transition-colors duration-200"
            >
              <Package size={18} />
              <span>Stocks</span>
            </Link>
            <Link
              href="/seller/orders"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-sm transition-colors duration-200"
            >
              <ClipboardList size={18} />
              <span>Orders</span>
            </Link>
            <Link
              href="/seller/products/add"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-sm transition-colors duration-200"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <button className="relative flex items-center justify-center w-11 h-11 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200">
              <Bell size={20} />
              <span className="absolute top-0 right-0 block w-4 h-4 text-xs font-bold text-white bg-blue-600 rounded-full transform translate-x-1/4 -translate-y-1/4">
                3
              </span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
              >
                <UserCircle size={24} />
              </button>
              <div className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-out ${
                isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
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
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
