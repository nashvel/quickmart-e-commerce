import { PropsWithChildren, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FaSearch } from 'react-icons/fa';
import HeartIcon from '@/components/ui/heart-icon';
import UserIcon from '@/components/ui/user-icon';
import CartIcon from '@/components/ui/cart-icon';
import { useCart } from '@/contexts/CartContext';

export default function AppLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<PageProps>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount } = useCart();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/products', { search: searchQuery });
        }
    };

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

    const NavLink = ({ href, children, exact = false }: { href: string; children: React.ReactNode; exact?: boolean }) => {
        const { url } = usePage();
        const isActive = exact ? url === href : url.startsWith(href);

        return (
            <Link
                href={href}
                className={`
                    relative px-3 py-2 font-bold transition-colors
                    ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-600
                    after:transition-transform after:duration-300 after:ease-out after:origin-left
                    ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'}
                    hover:after:scale-x-100
                `}
            >
                {children}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm sticky top-0 w-full z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Left Side: Logo */}
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-2xl font-black text-blue-600" style={{ fontFamily: 'Impact, "Arial Black", sans-serif', letterSpacing: '0.5px' }}>QuickMart</span>
                            </Link>
                        </div>

                        {/* Center Nav Links - Desktop */}
                        <div className="hidden lg:flex items-center gap-8">
                            <NavLink href="/" exact={true}>Home</NavLink>
                            <NavLink href="/products">Shop</NavLink>
                            <NavLink href="/restaurants">Restaurants</NavLink>
                            <NavLink href="/promotions">Promotions</NavLink>
                            {auth.user && <NavLink href="/orders">My Orders</NavLink>}
                        </div>

                        {/* Right Side: Search & Icons */}
                        <div className="flex items-center gap-4">
                            {/* Search Bar - Desktop */}
                            <div className="hidden lg:block w-full max-w-xs">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <input
                                        id="search"
                                        name="search"
                                        className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                                        placeholder="Search products..."
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-blue-600 transition-colors"
                                        aria-label="Search"
                                    >
                                        <FaSearch />
                                    </button>
                                </form>
                            </div>

                            {/* Icons */}
                            <div className="flex items-center gap-6">
                                {/* Wishlist/Favorites */}
                                <Link
                                    href="/wishlist"
                                    className="text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <HeartIcon size={24} />
                                </Link>

                                {auth.user ? (
                                    <>
                                        {/* User Account with Dropdown */}
                                        <div className="relative group">
                                            <button 
                                                type="button"
                                                aria-label="User menu"
                                                className="text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <UserIcon size={24} />
                                            </button>
                                            
                                            {/* Dropdown */}
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                                <div className="py-2">
                                                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                                        {auth.user.first_name} {auth.user.last_name}
                                                    </div>
                                                    
                                                    {/* Dashboard Link - Only for admin and client users */}
                                                    {(auth.user.role === 'admin' || auth.user.role === 'client') && (
                                                        <Link
                                                            href={auth.user.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Dashboard
                                                        </Link>
                                                    )}
                                                    
                                                    <Link
                                                        href="/profile"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        href="/orders"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        My Orders
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shopping Cart */}
                                        <Link
                                            href="/cart"
                                            className="relative text-blue-600 hover:text-blue-700 transition-colors translate-y-0.5"
                                        >
                                            <CartIcon size={24} />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {/* User Icon - Login */}
                                        <Link
                                            href="/login"
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <UserIcon size={24} />
                                        </Link>

                                        {/* Shopping Cart */}
                                        <Link
                                            href="/cart"
                                            className="relative text-blue-600 hover:text-blue-700 transition-colors translate-y-0.5"
                                        >
                                            <CartIcon size={24} />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">QuickMart</h3>
                            <p className="text-gray-400">Your everyday essentials, delivered.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/products" className="hover:text-white">Shop</Link></li>
                                <li><Link href="/restaurants" className="hover:text-white">Restaurants</Link></li>
                                <li><Link href="/promotions" className="hover:text-white">Promotions</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Customer Service</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Follow Us</h4>
                            <div className="flex gap-4 text-gray-400">
                                <a href="#" className="hover:text-white">Facebook</a>
                                <a href="#" className="hover:text-white">Twitter</a>
                                <a href="#" className="hover:text-white">Instagram</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2026 QuickMart. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
