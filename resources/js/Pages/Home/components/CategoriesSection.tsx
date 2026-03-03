import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Category } from '@/types';

interface Props {
    categories: Category[];
}

const categoryImageMap: Record<string, string> = {
    'Books': '/images/cards/books.png',
    'Electronics': '/images/cards/electronics.png',
    'Fashion': '/images/cards/fashion.png',
    'Foods': '/images/cards/foods.png',
    'Home & Kitchen': '/images/cards/homeandkitchen.png',
    'Sports & Outdoor': '/images/cards/sportsandoutdoor.png',
};

export default function CategoriesSection({ categories }: Props) {
    if (!categories || categories.length === 0) return null;

    // Filter out restaurant categories
    const restaurantCategories = ['Pizza', 'Burgers', 'Asian', 'Healthy', 'Desserts', 'Coffee', 'Fast Food', 'Seafood'];
    const filteredCategories = categories.filter(category => !restaurantCategories.includes(category.name));

    return (
        <section className="mb-16">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <ShoppingBag className="text-primary" size={24} /> Shop by Category
                </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredCategories.map((category) => (
                    <motion.div key={category.id} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <Link 
                            href={`/products?category=${category.name}`} 
                            className="group flex flex-col bg-white rounded-lg shadow transition-shadow duration-300 hover:shadow-lg overflow-hidden h-full"
                        >
                            <div className="relative h-40 w-full overflow-hidden">
                                <img 
                                    src={categoryImageMap[category.name] || '/images/cards/card-01.png'} 
                                    alt={category.name} 
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4 text-center flex-grow flex items-center justify-center">
                                <h3 className="font-semibold text-gray-700">{category.name}</h3>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
