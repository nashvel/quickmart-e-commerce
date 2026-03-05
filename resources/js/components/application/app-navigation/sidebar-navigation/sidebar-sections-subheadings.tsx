import { useState } from "react";
import { cx } from "@/lib/utils/cx";
import type { NavItemType } from "../config";
import { NavItemBase } from "../base-components/nav-item";

interface SidebarNavigationSectionsSubheadingsProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** Additional CSS classes to apply to the navigation. */
    className?: string;
    /** List of sections with items to display. */
    items: Array<{ label: string; items: NavItemType[] }>;
}

export const SidebarNavigationSectionsSubheadings = ({
    activeUrl,
    items,
    className,
}: SidebarNavigationSectionsSubheadingsProps) => {
    const [open, setOpen] = useState(false);
    
    // Find active item across all sections
    const activeItem = items
        .flatMap(section => section.items)
        .find((item) => item.href === activeUrl || item.items?.some((subItem) => subItem.href === activeUrl));
    
    const [currentItem, setCurrentItem] = useState(activeItem);

    return (
        <nav className={cx("flex flex-col", className)}>
            {items.map((section, sectionIndex) => (
                <div key={section.label} className={sectionIndex > 0 ? "mt-6" : ""}>
                    {/* Section Label */}
                    <div className="px-6 lg:px-8 mb-2">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {section.label}
                        </h3>
                    </div>

                    {/* Section Items */}
                    <ul className="flex flex-col px-2 lg:px-4">
                        {section.items.map((item, index) => {
                            if (item.items?.length) {
                                return (
                                    <details
                                        key={item.label}
                                        open={activeItem?.href === item.href}
                                        className="appearance-none py-0.5"
                                        onToggle={(e) => {
                                            setOpen(e.currentTarget.open);
                                            setCurrentItem(item);
                                        }}
                                    >
                                        <NavItemBase href={item.href} badge={item.badge} icon={item.icon} type="collapsible">
                                            {item.label}
                                        </NavItemBase>

                                        <dd>
                                            <ul className="py-0.5">
                                                {item.items.map((childItem) => (
                                                    <li key={childItem.label} className="py-0.5">
                                                        <NavItemBase
                                                            href={childItem.href}
                                                            badge={childItem.badge}
                                                            type="collapsible-child"
                                                            current={activeUrl === childItem.href}
                                                        >
                                                            {childItem.label}
                                                        </NavItemBase>
                                                    </li>
                                                ))}
                                            </ul>
                                        </dd>
                                    </details>
                                );
                            }

                            return (
                                <li key={item.label} className="py-0.5">
                                    <NavItemBase
                                        type="link"
                                        badge={item.badge}
                                        icon={item.icon}
                                        href={item.href}
                                        current={currentItem?.href === item.href}
                                        open={open && currentItem?.href === item.href}
                                    >
                                        {item.label}
                                    </NavItemBase>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
};
