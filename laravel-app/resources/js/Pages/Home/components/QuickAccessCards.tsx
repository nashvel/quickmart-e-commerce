import { Link } from '@inertiajs/react';

export default function QuickAccessCards() {
    const buttonBaseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
    const primaryButtonClasses = `${buttonBaseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600`;

    return (
        <section className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-cyan-50 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
                <div className="p-8 flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Fresh Groceries</h3>
                    <p className="text-gray-600 mb-4">Delivered to your door in minutes.</p>
                    <Link href="/products?category=Groceries" className={`${primaryButtonClasses} text-sm`}>
                        Shop Now
                    </Link>
                </div>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
                <div className="p-8 flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Snacks & Drinks</h3>
                    <p className="text-gray-600 mb-4">Your favorite treats, ready to enjoy.</p>
                    <Link href="/products?category=Snacks" className={`${primaryButtonClasses} text-sm`}>
                        Order Now
                    </Link>
                </div>
            </div>
            <div className="bg-red-50 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
                <div className="p-8 flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Hot Meals</h3>
                    <p className="text-gray-600 mb-4">Delicious food from local restaurants.</p>
                    <Link href="/restaurants" className={`${primaryButtonClasses} text-sm`}>
                        Browse Food
                    </Link>
                </div>
            </div>
        </section>
    );
}
