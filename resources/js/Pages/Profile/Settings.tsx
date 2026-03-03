import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect } from 'react';
import { UserPen, Shield, Trash2 } from 'lucide-react';
import axios from 'axios';
import { User, PageProps } from '@/types';

interface Props extends PageProps {
    auth: {
        user: User;
    };
}

export default function Settings({ auth }: Props) {
    const [activeTab, setActiveTab] = useState('profile');
    const { user } = auth;

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

    const dashboardPaths = {
        'admin': '/admin/dashboard',
        'client': '/seller/dashboard',
        'rider': '/rider/dashboard'
    };

    const dashboardPath = user ? dashboardPaths[user.role as keyof typeof dashboardPaths] : null;

    const navItems = [
        { id: 'profile', label: 'Edit Profile', icon: UserPen },
        { id: 'security', label: 'Account Security', icon: Shield },
        { id: 'delete', label: 'Delete Account', icon: Trash2 },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings user={user} />;
            case 'security':
                return <SecuritySettings />;
            case 'delete':
                return <DeleteAccount />;
            default:
                return <ProfileSettings user={user} />;
        }
    };

    return (
        <AppLayout>
            <Head title="Account Settings" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <header className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                Account Settings
                            </h1>
                            <p className="mt-2 text-lg text-gray-500">
                                Manage your profile, password, and account settings.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            {dashboardPath && (
                                <Link 
                                    href={dashboardPath} 
                                    className="px-4 py-2 text-sm font-bold rounded-md text-white bg-primary hover:bg-primary-dark transition-colors no-underline"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-bold rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </header>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Sidebar Navigation */}
                        <aside className="lg:w-1/4">
                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-md font-medium rounded-lg transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1">
                            <div className="bg-white p-8 rounded-2xl shadow-lg">
                                {renderContent()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


// Profile Settings Component
function ProfileSettings({ user }: { user: User }) {
    const [formData, setFormData] = useState({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
    });
    const [initialData, setInitialData] = useState({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialData));
    }, [formData, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChanged) return;

        setProcessing(true);
        try {
            const response = await axios.post('/api/profile/update', {
                first_name: formData.firstName,
                last_name: formData.lastName,
            });

            if (response.data.status === 'success') {
                alert('Profile updated successfully!');
                setInitialData(formData);
                setIsEditing(false);
                router.reload();
            } else {
                alert(response.data.message || 'Failed to update profile.');
            }
        } catch (error: any) {
            console.error('Profile update error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while updating your profile.';
            alert(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                    <p className="text-gray-500">Update your personal details here.</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    name="firstName" 
                                    value={formData.firstName} 
                                    onChange={handleChange} 
                                    className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input 
                                    type="text" 
                                    id="lastName" 
                                    name="lastName" 
                                    value={formData.lastName} 
                                    onChange={handleChange} 
                                    className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email} 
                                disabled 
                                className="w-full p-3 text-base rounded-md border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" 
                            />
                        </div>
                    </div>
                    <div className="mt-8 border-t pt-6 flex justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={handleCancel} 
                            className="px-6 py-3 text-base font-bold rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!isChanged || processing} 
                            className="px-6 py-3 text-base font-bold rounded-md transition-colors text-white bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                        <p className="text-lg text-gray-800">{formData.firstName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                        <p className="text-lg text-gray-800">{formData.lastName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                        <p className="text-lg text-gray-800">{formData.email}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Security Settings Component
function SecuritySettings() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isChanged, setIsChanged] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const { currentPassword, newPassword, confirmPassword } = formData;
        setIsChanged(currentPassword !== '' || newPassword !== '' || confirmPassword !== '');
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            alert('New passwords do not match.');
            return;
        }

        setProcessing(true);
        try {
            const response = await axios.post('/api/password/change', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            if (response.data.status === 'success') {
                alert('Password changed successfully!');
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(response.data.message || 'Failed to change password.');
            }
        } catch (error: any) {
            console.error('Password change error:', error);
            const errorMessage = error.response?.data?.messages?.error || error.response?.data?.message || 'An error occurred.';
            alert(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Change Password</h2>
            <p className="mb-6 text-gray-500">For your security, we recommend using a strong password.</p>

            <div className="space-y-6">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                    </label>
                    <input 
                        type="password" 
                        id="currentPassword" 
                        name="currentPassword" 
                        value={formData.currentPassword} 
                        onChange={handleChange} 
                        className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <input 
                        type="password" 
                        id="newPassword" 
                        name="newPassword" 
                        value={formData.newPassword} 
                        onChange={handleChange} 
                        className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                    </label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        className="w-full p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                </div>
            </div>

            <div className="mt-8 border-t pt-6 flex justify-end">
                <button 
                    type="submit" 
                    disabled={!isChanged || processing}
                    className="px-6 py-3 text-base font-bold rounded-md transition-colors text-white bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {processing ? 'Updating...' : 'Update Password'}
                </button>
            </div>
        </form>
    );
}

// Delete Account Component
function DeleteAccount() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

    const handleDelete = () => {
        console.log('Deleting account...');
        alert('Account deleted successfully.');
        setIsModalOpen(false);
        router.post('/logout');
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-red-600 mb-1">Delete Account</h2>
            <p className="mb-6 text-gray-500">
                Permanently remove your account and all of its content. This action is not reversible.
            </p>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-center">
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            Once you delete your account, you will lose all data associated with it.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t pt-6 flex justify-end">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 text-base font-bold rounded-md transition-colors text-white bg-red-600 hover:bg-red-700"
                >
                    Delete My Account
                </button>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-900">Are you absolutely sure?</h3>
                        <p className="mt-2 text-gray-600">
                            This action cannot be undone. To confirm, please type <strong>DELETE</strong> below.
                        </p>
                        
                        <input 
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            className="w-full mt-4 p-3 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="DELETE"
                        />

                        <div className="mt-6 flex justify-end gap-4">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete}
                                disabled={confirmationText !== 'DELETE'}
                                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
