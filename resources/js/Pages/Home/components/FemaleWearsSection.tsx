import { Link } from '@inertiajs/react';
import ProductCard from '@/Components/ProductCard';
import { Product } from '@/types';

interface Props {
    products: Product[];
}

export default function FemaleWearsSection({ products }: Props) {
    if (!products || products.length === 0) return null;

    return (
        <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Female Wears</h2>
                <Link href="/products?category=Fashion" className="text-blue-600 font-medium hover:underline">
                    View All
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} size="small" />
                ))}
            </div>
        </section>
    );
}
