import { Head, Link } from '@inertiajs/react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function OrderSuccess() {
    return (
        <>
            <Head title="Order Success" />

            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center max-w-lg w-full border-t-4 border-blue-500">
                    <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                        <CheckCircle className="text-white w-16 h-16" />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Thank You!</h1>
                    <p className="text-gray-600 text-lg mb-8">Your order has been placed successfully.</p>

                    <p className="text-gray-500 text-sm mb-8">
                        You will receive an email confirmation shortly. You can also track your order status in your account.
                    </p>

                    <Link
                        href="/orders"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Go to My Orders
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </>
    );
}
