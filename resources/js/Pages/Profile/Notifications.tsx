import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import { Bell, Mail, Smartphone, ShoppingBag, Truck, Star, MessageSquare } from 'lucide-react';

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    icon: any;
    email: boolean;
    push: boolean;
    sms: boolean;
}

export default function ProfileNotifications() {
    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: 'orders',
            title: 'Order Updates',
            description: 'Get notified about order confirmations, shipping updates, and deliveries',
            icon: ShoppingBag,
            email: true,
            push: true,
            sms: false
        },
        {
            id: 'delivery',
            title: 'Delivery Notifications',
            description: 'Real-time updates when your order is out for delivery',
            icon: Truck,
            email: true,
            push: true,
            sms: true
        },
        {
            id: 'promotions',
            title: 'Promotions & Offers',
            description: 'Special deals, discounts, and promotional offers',
            icon: Star,
            email: false,
            push: true,
            sms: false
        },
        {
            id: 'messages',
            title: 'Messages',
            description: 'Chat messages from stores and customer support',
            icon: MessageSquare,
            email: true,
            push: true,
            sms: false
        }
    ]);

    const handleToggle = (settingId: string, type: 'email' | 'push' | 'sms') => {
        setSettings(prev => prev.map(setting => 
            setting.id === settingId 
                ? { ...setting, [type]: !setting[type] }
                : setting
        ));
    };

    const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                enabled ? 'bg-primary' : 'bg-gray-200'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    return (
        <AppLayout>
            <Head title="Notification Settings" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
                        <p className="text-gray-600 mt-1">Choose how you want to be notified</p>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Header Row */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-6">
                                    <h3 className="text-sm font-medium text-gray-900">Notification Type</h3>
                                </div>
                                <div className="col-span-2 text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-900">Email</span>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Bell className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-900">Push</span>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Smartphone className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-900">SMS</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Rows */}
                        {settings.map((setting, index) => {
                            const IconComponent = setting.icon;
                            return (
                                <div key={setting.id} className={`px-6 py-6 ${index !== settings.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-6">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                                                    <IconComponent className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">{setting.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <ToggleSwitch
                                                enabled={setting.email}
                                                onChange={() => handleToggle(setting.id, 'email')}
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <ToggleSwitch
                                                enabled={setting.push}
                                                onChange={() => handleToggle(setting.id, 'push')}
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <ToggleSwitch
                                                enabled={setting.sms}
                                                onChange={() => handleToggle(setting.id, 'sms')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                        <button className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Save Changes
                        </button>
                    </div>

                    {/* Back to Profile */}
                    <div className="mt-8">
                        <Link
                            href="/profile"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Profile
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}