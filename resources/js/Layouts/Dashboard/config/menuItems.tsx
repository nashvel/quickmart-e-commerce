import { 
  LayoutDashboard, 
  ListChecks, 
  ClipboardList, 
  Star, 
  MessageSquare, 
  Settings,
  UserCircle,
  Store,
  DollarSign,
  Package
} from 'lucide-react';
import { MenuItem, UserRole } from '../types';

export const getMenuItems = (role: UserRole): MenuItem[] => {
  const menuConfig: Record<UserRole, MenuItem[]> = {
    seller: [
      { path: '/seller/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { path: '/seller/products/manage', icon: <ListChecks size={20} />, label: 'Manage Products' },
      { path: '/seller/orders', icon: <ClipboardList size={20} />, label: 'Orders' },
      { path: '/seller/reviews', icon: <Star size={20} />, label: 'Reviews' },
      { path: '/seller/chat', icon: <MessageSquare size={20} />, label: 'Chat' },
      { path: '/seller/manage-store', icon: <Settings size={20} />, label: 'Manage Store' },
    ],
    admin: [
      { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { path: '/admin/users', icon: <UserCircle size={20} />, label: 'Users' },
      { path: '/admin/stores', icon: <Store size={20} />, label: 'Stores' },
      { path: '/admin/orders', icon: <ClipboardList size={20} />, label: 'Orders' },
      { path: '/admin/promotions', icon: <Star size={20} />, label: 'Promotions' },
      { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
    ],
    rider: [
      { path: '/rider/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { path: '/rider/deliveries', icon: <ClipboardList size={20} />, label: 'Deliveries' },
      { path: '/rider/earnings', icon: <DollarSign size={20} />, label: 'Earnings' },
    ],
  };

  return menuConfig[role];
};

export const getRoleName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Admin Panel',
    rider: 'Rider Panel',
    seller: 'Client Panel',
  };

  return roleNames[role];
};
