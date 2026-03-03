import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const brands = [
    { name: 'Adidas', logo: '/images/brand/adidas.png' },
    { name: 'Apple', logo: '/images/brand/apple.png' },
    { name: 'H&M', logo: '/images/brand/h&m.png' },
    { name: 'Levis', logo: '/images/brand/levis.png' },
    { name: 'LG', logo: '/images/brand/lg.png' },
    { name: 'Nike', logo: '/images/brand/nike.png' },
    { name: 'Puma', logo: '/images/brand/puma.png' },
    { name: 'Samsung', logo: '/images/brand/samsung.png' },
    { name: 'Penshopee', logo: '/images/brand/penshopee.png' },
    { name: 'Ciaobella', logo: '/images/brand/ciaobella.png' }
];

export default function BrandsSection() {
    return (
        <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Brands</h2>
                <Link href="/products" className="text-blue-600 font-medium hover:underline">
                    View All
                </Link>
            </div>
            <div className="relative">
                <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
                    {brands.map((brand) => (
                        <motion.div 
                            key={brand.name} 
                            className="flex-shrink-0 text-center" 
                            whileHover={{ y: -5 }}
                        >
                            <Link href={`/products?brand=${brand.name}`} className="group">
                                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center transition-shadow duration-300 group-hover:shadow-lg">
                                    <img 
                                        src={brand.logo} 
                                        alt={brand.name} 
                                        className="h-12 object-contain" 
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (!target.dataset.errorHandled) {
                                                target.dataset.errorHandled = 'true';
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    const text = document.createElement('span');
                                                    text.className = 'text-xs font-semibold text-gray-400';
                                                    text.textContent = brand.name;
                                                    parent.appendChild(text);
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
