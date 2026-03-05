import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    link: string;
}

interface ProductBreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function ProductBreadcrumb({ items }: ProductBreadcrumbProps) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && <ChevronRight size={16} className="mx-2 text-gray-400" />}
                    {index === 0 ? (
                        <Link href={item.link} className="flex items-center hover:text-primary-600">
                            <Home size={16} className="mr-1" />
                            {item.label}
                        </Link>
                    ) : index === items.length - 1 ? (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    ) : (
                        <Link href={item.link} className="hover:text-primary-600">
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
