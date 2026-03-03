import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Store } from '@/types';
import Avatar from '@/Components/Avatar';

interface Props {
    restaurants: Store[];
}

const LOGO_ASSET_URL = '/storage/logos';

export default function RestaurantsSection({ restaurants }: Props) {
    if (!restaurants || restaurants.length === 0) return null;

    const slugify = (text: string) => {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    };

    return (
        <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <ShoppingBag className="text-primary" size={24} /> Order Food
                </h2>
                <Link href="/restaurants" className="text-primary font-medium hover:underline">
                    View All
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {restaurants.slice(0, 6).map((store) => (
                    <motion.div key={store.id} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <Link 
                            href={`/stores/${store.id}/${slugify(store.name)}`}
                            className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-5 text-center transition-shadow duration-300 hover:shadow-lg h-full"
                        >
                            <Avatar 
                                user={{ 
                                    name: store.name, 
                                    avatar_url: store.logo ? `${LOGO_ASSET_URL}/${store.logo}` : null 
                                }} 
                                className="w-20 h-20 rounded-lg mb-4 object-contain" 
                                textSize="text-2xl" 
                            />
                            <h3 className="font-semibold text-gray-700">{store.name}</h3>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
