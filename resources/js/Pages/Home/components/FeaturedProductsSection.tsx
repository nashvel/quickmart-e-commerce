import { Link } from '@inertiajs/react';
import ProductCard from '@/Components/ProductCard';
import { Star } from 'lucide-react';
import { Product } from '@/types';

interface Props {
    products: Product[];
}

export default function FeaturedProductsSection({ products }: Props) {
    if (!products || products.length === 0) return null;

    return (
        <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Star className="text-yellow-400" size={24} fill="currentColor" /> Featured Products
                </h2>
                <Link href="/products" className="text-primary font-medium hover:underline">
                    View All
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} size="small" />
                ))}
            </div>
        </section>
    );
}
