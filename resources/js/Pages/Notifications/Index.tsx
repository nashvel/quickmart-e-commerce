import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useNotifications } from '@/context/NotificationContext';
import { FaBell, FaCheckCircle, FaInfoCircle, FaShoppingBag, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Notification {
    id: number;
    user_id: number;
    type: string;
    title: string;
    message: string;
    link: string | null;
    data: any;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export default function NotificationsIndex() {
    const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useNotifications();
    const navigate = useNavigate();

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <FaShoppingBag className="text-blue-500" />;
            case 'message':
                return <FaInfoCircle className="text-purple-500" />;
            case 'promotion':
                return <FaCheckCircle className="text-green-500" />;
            case 'system':
                return <FaBell className="text-gray-500" />;
            default:
                return <FaInfoCircle className="text-gray-500" />;
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            markNotificationAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const handleDelete = (e: React.MouseEvent, notificationId: number) => {
        e.stopPropagation();
        deleteNotification(notificationId);
    };

    return (
        <AppLayout>
            <Head title="Notifications" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllNotificationsAsRead}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <FaBell className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No notifications yet</h3>
                            <p className="text-gray-500">We'll let you know when something new arrives.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                        !notification.is_read ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-grow">
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        {notification.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {formatDistanceToNow(new Date(notification.created_at), {
                                                            addSuffix: true,
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {!notification.is_read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDelete(e, notification.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        aria-label="Delete notification"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
