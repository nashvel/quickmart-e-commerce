import { Link } from '@inertiajs/react';
import { Package, ClipboardList, Plus } from 'lucide-react';
import { UserRole } from '../types';

interface QuickAccessProps {
  userRole: UserRole;
}

export const QuickAccess = ({ userRole }: QuickAccessProps) => {
  if (userRole !== 'seller') {
    return null;
  }

  return (
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
  );
};
