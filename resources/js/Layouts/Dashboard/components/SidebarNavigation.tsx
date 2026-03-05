import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavItem, NavItemType, NavItemDividerType } from '../types';

interface SidebarNavigationProps {
  items: NavItem[];
  isCollapsed: boolean;
  onCloseMobile?: () => void;
}

const isNavItemType = (item: NavItem): item is NavItemType => {
  return 'label' in item && 'href' in item;
};

const isNavItemDivider = (item: NavItem): item is NavItemDividerType => {
  return 'divider' in item;
};

export const SidebarNavigation = ({ items, isCollapsed, onCloseMobile }: SidebarNavigationProps) => {
  const { url } = usePage();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => url === href;
  const isParentActive = (item: NavItemType) => {
    if (isActive(item.href)) return true;
    return item.items?.some(subItem => isActive(subItem.href)) || false;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
      {items.map((item, index) => {
        if (isNavItemDivider(item)) {
          return (
            <div
              key={`divider-${index}`}
              className={`my-3 border-t border-blue-700 ${isCollapsed ? 'mx-2' : 'mx-0'}`}
            />
          );
        }

        if (isNavItemType(item)) {
          const hasSubItems = item.items && item.items.length > 0;
          const isExpanded = expandedItems.includes(item.label);
          const isItemActive = isParentActive(item);

          return (
            <div key={item.label}>
              {/* Main Nav Item */}
              {hasSubItems ? (
                <button
                  onClick={() => toggleExpanded(item.label)}
                  className={`flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isItemActive
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-blue-600 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-grow ml-3">{item.label}</span>
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
                          {item.badge}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDown size={16} className="ml-2" />
                      ) : (
                        <ChevronRight size={16} className="ml-2" />
                      )}
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-blue-600 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-grow ml-3">{item.label}</span>
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )}

              {/* Sub Items */}
              {hasSubItems && isExpanded && !isCollapsed && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.items!.map(subItem => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      onClick={handleLinkClick}
                      className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        isActive(subItem.href)
                          ? 'bg-blue-700 text-white font-medium'
                          : 'text-gray-400 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      <span className="flex-grow">{subItem.label}</span>
                      {subItem.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
                          {subItem.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
    </nav>
  );
};
