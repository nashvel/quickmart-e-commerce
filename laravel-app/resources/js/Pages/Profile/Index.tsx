import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { User, Settings, ShoppingBag, MapPin, Bell, CreditCard } from 'lucide-react';

interface Props {
    auth: {
        user: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            avatar?: string;
            role: string;
        };
    };
}

export default function ProfileIndex({ auth }: Props) {
    const { user } = auth;

    const profileSections = [
        {
            title: 'Account Settings',
            description: 'Manage your account information and preferences',
            icon: Settings,
            href: '/profile/settings',
            color: 'bg-blue-500'
        },
        {
            title: 'My Orders',
            description: 'View your order history and track deliveries',
            icon: ShoppingBag,
            href: '/orders',
            color: 'bg-green-500'
        },
        {
            title: 'Addresses',
            description: 'Manage your delivery addresses',
            icon: MapPin,
            href: '/profile/addresses',
            color: 'bg-purple-500'
        },
        {
            title: 'Notifications',
            description: 'Control your notification preferences',
            icon: Bell,
            href: '/profile/notifications',
            color: 'bg-yellow-500'
        },
        {
            title: 'Payment Methods',
            description: 'Manage your payment cards and methods',
            icon: CreditCard,
            href: '/profile/payment-methods',
            color: 'bg-red-500'
        }
    ];

    return (
        <AppLayout>
            <Head title="My Profile" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="flex items-center space-x-6">
                            <div className="flex-shrink-0">
                                {user.avatar ? (
                                    <img
                                        className="h-20 w-20 rounded-full object-cover"
                                        src={user.avatar}
                                        alt={`${user.first_name} ${user.last_name}`}
                                    />
                                ) : (
                                    <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
                                        <User className="h-10 w-10 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {user.first_name} {user.last_name}
                                </h1>
                                <p className="text-gray-600">{user.email}</p>
                                <p className="text-sm text-gray-500 capitalize mt-1">
                                    {user.role} Account
                                </p>
                            </div>
                            <div>
                                <Link
                                    href="/profile/settings"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Profile Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profileSections.map((section) => {
                            const IconComponent = section.icon;
                            return (
                                <Link
                                    key={section.title}
                                    href={section.href}
                                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`flex-shrink-0 p-3 rounded-lg ${section.color}`}>
                                            <IconComponent className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary">
                                                {section.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {section.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">0</div>
                                <div className="text-sm text-gray-600">Total Orders</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">₱0.00</div>
                                <div className="text-sm text-gray-600">Total Spent</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">0</div>
                                <div className="text-sm text-gray-600">Saved Addresses</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}