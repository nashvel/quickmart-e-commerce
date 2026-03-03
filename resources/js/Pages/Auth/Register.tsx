import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            
            // Check password match in real-time
            if (name === 'password' || name === 'confirmPassword') {
                const password = name === 'password' ? value : newData.password;
                const confirmPassword = name === 'confirmPassword' ? value : newData.confirmPassword;
                setPasswordsMatch(password === confirmPassword || confirmPassword === '');
            }
            
            return newData;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setIsSuccess(false);
            return;
        }

        setLoading(true);
        setError('');
        setIsSuccess(false);

        try {
            const response = await axios.post('/register', {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200 || response.status === 201) {
                setError('Registration successful! Redirecting to login...');
                setIsSuccess(true);
                setTimeout(() => router.visit('/login'), 2000);
            } else {
                setError(response.data?.message || 'An error occurred during registration');
                setIsSuccess(false);
            }
        } catch (err: any) {
            if (err.response?.data?.errors) {
                // Handle Laravel validation errors
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                setError(errorMessages.join(' '));
            } else {
                setError(err.response?.data?.message || 'An error occurred during registration');
            }
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm';

    return (
        <AppLayout>
            <Head title="Sign Up" />

            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <input
                                name="firstName"
                                type="text"
                                required
                                className={`${inputClass} rounded-t-md`}
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <input
                                name="lastName"
                                type="text"
                                required
                                className={inputClass}
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={inputClass}
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className={inputClass}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                            <div className="relative">
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className={`${inputClass} rounded-b-md ${!passwordsMatch && formData.confirmPassword ? 'border-red-500' : ''}`}
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
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

                        {!passwordsMatch && formData.confirmPassword && (
                            <div className="p-3 rounded-md text-sm bg-red-100 text-red-800">
                                <p>Passwords do not match.</p>
                            </div>
                        )}

                        {error && (
                            <div
                                className={`p-4 rounded-md text-sm ${
                                    isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                            >
                                <p>{error}</p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                    <div className="text-sm text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
