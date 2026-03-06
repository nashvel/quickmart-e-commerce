import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResend, setShowResend] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleResendVerification = async () => {
        setLoading(true);
        setError('');
        try {
            // For now, just show a message since we don't have email verification implemented
            setError('Verification email functionality is not yet implemented.');
            setShowResend(false);
        } catch (err: any) {
            setError('Failed to resend verification email.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShowResend(false);

        try {
            const response = await axios.post('/login', {
                email,
                password,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                const { user } = response.data;
                
                // Check if there's a redirect URL stored
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                if (redirectUrl) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    router.visit(redirectUrl);
                    return;
                }

                // Redirect based on user role
                console.log('User role:', user.role); // Debug log
                switch (user.role) {
                    case 'customer':
                        console.log('Redirecting to home'); // Debug log
                        router.visit('/');
                        break;
                    case 'client':
                        console.log('Redirecting to seller dashboard'); // Debug log
                        router.visit('/seller/dashboard');
                        break;
                    case 'rider':
                        console.log('Redirecting to rider dashboard'); // Debug log
                        router.visit('/rider/dashboard');
                        break;
                    case 'admin':
                        console.log('Redirecting to admin dashboard'); // Debug log
                        router.visit('/admin/dashboard');
                        break;
                    default:
                        console.log('Redirecting to home (default)'); // Debug log
                        router.visit('/');
                }
            } else {
                setError(response.data?.message || 'Invalid credentials. Please try again.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            
            // Handle CSRF token mismatch specifically
            if (err.response?.status === 419 || err.response?.data?.message?.includes('CSRF')) {
                setError('Session expired. Please refresh the page and try again.');
            } else if (err.response?.status === 403 && err.response?.data?.error === 'not_verified') {
                setError('Email not verified. Click the button below to resend the verification email.');
                setShowResend(true);
            } else {
                setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Sign In" />

            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    {/* Test Credentials Section */}
                    <details className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <summary className="cursor-pointer font-semibold text-blue-900 text-sm">
                             Test Credentials (Development Only)
                        </summary>
                        <div className="mt-3 space-y-3 text-xs">
                            <div className="bg-white p-3 rounded border border-blue-100">
                                <p className="font-semibold text-gray-700 mb-1">Customer</p>
                                <p className="text-gray-600">Email: customer@example.com</p>
                                <p className="text-gray-600">Password: password</p>
                            </div>
                            <div className="bg-white p-3 rounded border border-blue-100">
                                <p className="font-semibold text-gray-700 mb-1">Sellers</p>
                                <p className="text-gray-600">tech@example.com / password</p>
                                <p className="text-gray-600">fashion@example.com / password</p>
                                <p className="text-gray-600">home@example.com / password</p>
                                <p className="text-gray-600">pizza@example.com / password</p>
                            </div>
                            <div className="bg-white p-3 rounded border border-blue-100">
                                <p className="font-semibold text-gray-700 mb-1">Riders</p>
                                <p className="text-gray-600">rider1@example.com / password</p>
                                <p className="text-gray-600">rider2@example.com / password</p>
                                <p className="text-gray-600">rider3@example.com / password</p>
                            </div>
                            <div className="bg-white p-3 rounded border border-blue-100">
                                <p className="font-semibold text-gray-700 mb-1">Admin</p>
                                <p className="text-gray-600">Email: admin@example.com</p>
                                <p className="text-gray-600">Password: password</p>
                            </div>
                        </div>
                    </details>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                className={`p-4 rounded-md ${
                                    showResend ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}
                            >
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <Link
                                    href="/forgot-password"
                                    className="font-medium text-primary hover:text-primary-dark"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>

                        {showResend && (
                            <div>
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:bg-yellow-300"
                                >
                                    {loading ? 'Sending...' : 'Resend Verification Email'}
                                </button>
                            </div>
                        )}
                    </form>
                    <div className="text-sm text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/signup" className="font-medium text-primary hover:text-primary-dark">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
