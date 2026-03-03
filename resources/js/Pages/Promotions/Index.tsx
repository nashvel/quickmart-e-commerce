import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Tag, Info, ArrowRight, Calendar, Store, Tags, Gift } from 'lucide-react';
import axios from 'axios';

interface Promotion {
    id: number;
    title: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    scope_type: 'store' | 'category' | 'all_products';
    scope_value?: string;
    image_url?: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

const typeIcons: Record<string, JSX.Element> = {
    store: <Store className="mr-2 text-gray-500" size={16} />,
    category: <Tag className="mr-2 text-gray-500" size={16} />,
    all_products: <Tags className="mr-2 text-gray-500" size={16} />,
};

const getPromotionLink = (promo: Promotion): string => {
    switch (promo.scope_type) {
        case 'store':
            return `/stores/${promo.scope_value}`;
        case 'category':
            return `/products?category=${promo.scope_value}`;
        case 'all_products':
        default:
            return '/products';
    }
};

interface PromotionCardProps {
    promotion: Promotion;
    index: number;
}

const PromotionCard = ({ promotion, index }: PromotionCardProps) => {
    const ribbonType = (index % 6) + 1;
    
    return (
        <motion.div
            className="bg-white rounded-xl shadow-lg overflow-visible transform hover:-translate-y-2 transition-transform duration-300 group flex flex-col relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="relative overflow-hidden rounded-t-xl">
                <img 
                    src={promotion.image_url || '/images/cards/flashsale.png'} 
                    alt={promotion.title} 
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.errorHandled) {
                            target.dataset.errorHandled = 'true';
                            target.src = '/images/cards/flashsale.png';
                        }
                    }}
                />
                
                {/* Ribbon Badge */}
                {ribbonType === 1 && (
                    <div className="ribbon1">
                        <span>{promotion.discount_value}{promotion.discount_type === 'percentage' ? '%' : '$'} OFF</span>
                    </div>
                )}
                {ribbonType === 2 && (
                    <div className="ribbon2">
                        <span className="text-xs font-bold">{promotion.discount_value}{promotion.discount_type === 'percentage' ? '%' : '$'}<br/>OFF</span>
                    </div>
                )}
                {ribbonType === 3 && (
                    <div className="ribbon3">
                        <span>{promotion.discount_value}{promotion.discount_type === 'percentage' ? '%' : '$'} OFF</span>
                    </div>
                )}
                {ribbonType === 4 && (
                    <div className="ribbon4">
                        <span>{promotion.discount_value}{promotion.discount_type === 'percentage' ? '%' : '$'} OFF</span>
                    </div>
                )}
                {ribbonType === 5 && (
                    <div className="ribbon5">
                        <span>{promotion.discount_value}{promotion.discount_type === 'percentage' ? '%' : '$'} OFF</span>
                    </div>
                )}
                {ribbonType === 6 && (
                    <div className="wrap">
                        <div className="ribbon6">
                            <span>{promotion.discount_value}{promotion.discount_type === 'percentage' ? '%' : '$'} OFF</span>
                        </div>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white">{promotion.title}</h3>
                </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <p className="text-gray-600 mb-4 flex-grow">{promotion.description}</p>
                
                <div className="space-y-3 text-sm text-gray-700 mb-4 border-t border-gray-100 pt-4">
                    <div className="flex items-center">
                        <Calendar className="mr-2 text-gray-500" size={16} />
                        <span>
                            Expires on: <strong>{new Date(promotion.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                        </span>
                    </div>
                    <div className="flex items-center capitalize">
                        {typeIcons[promotion.scope_type] || <Tags className="mr-2 text-gray-500" size={16} />}
                        <span>
                            Applies to: <strong>{promotion.scope_value || (promotion.scope_type ? promotion.scope_type.replace('_', ' ') : 'All Products')}</strong>
                        </span>
                    </div>
                </div>

                <Link 
                    href={getPromotionLink(promotion)} 
                    className="inline-flex items-center font-semibold text-primary hover:text-primary-dark transition-colors duration-300 mt-auto"
                >
                    Shop Now <ArrowRight className="ml-2" size={16} />
                </Link>
            </div>
        </motion.div>
    );
};

export default function PromotionsIndex() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get('/api/promotions/active');
                setPromotions(response.data.promotions || response.data || []);
            } catch (error) {
                console.error('Failed to fetch promotions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    return (
        <AppLayout>
            <Head title="Promotions" />
            
            <style>{`
                /* Ribbon 1 */
                .ribbon1 {
                    position: absolute;
                    top: -6.1px;
                    right: 10px;
                    z-index: 10;
                }
                .ribbon1:after {
                    position: absolute;
                    content: "";
                    width: 0;
                    height: 0;
                    border-left: 53px solid transparent;
                    border-right: 53px solid transparent;
                    border-top: 10px solid #f8463f;
                }
                .ribbon1 span {
                    position: relative;
                    display: block;
                    text-align: center;
                    background: #f8463f;
                    font-size: 14px;
                    line-height: 1;
                    padding: 12px 8px 10px;
                    border-top-right-radius: 8px;
                    width: 90px;
                    color: white;
                    text-transform: uppercase;
                }
                .ribbon1 span:before,
                .ribbon1 span:after {
                    position: absolute;
                    content: "";
                }
                .ribbon1 span:before {
                    height: 6px;
                    width: 6px;
                    left: -6px;
                    top: 0;
                    background: #f8463f;
                }
                .ribbon1 span:after {
                    height: 6px;
                    width: 8px;
                    left: -8px;
                    top: 0;
                    border-radius: 8px 8px 0 0;
                    background: #c02031;
                }

                /* Ribbon 2 */
                .ribbon2 {
                    width: 60px;
                    padding: 10px 0;
                    position: absolute;
                    top: -6px;
                    left: 25px;
                    text-align: center;
                    border-top-left-radius: 3px;
                    background: #f47530;
                    color: white;
                    z-index: 10;
                }
                .ribbon2:before,
                .ribbon2:after {
                    content: "";
                    position: absolute;
                }
                .ribbon2:before {
                    height: 0;
                    width: 0;
                    right: -5.5px;
                    top: 0.1px;
                    border-bottom: 6px solid #8d5a20;
                    border-right: 6px solid transparent;
                }
                .ribbon2:after {
                    height: 0;
                    width: 0;
                    bottom: -29.5px;
                    left: 0;
                    border-left: 30px solid #f47530;
                    border-right: 30px solid #f47530;
                    border-bottom: 30px solid transparent;
                }

                /* Ribbon 3 */
                .ribbon3 {
                    width: 150px;
                    height: 50px;
                    line-height: 50px;
                    padding-left: 15px;
                    position: absolute;
                    left: -8px;
                    top: 20px;
                    background: #59324c;
                    color: white;
                    z-index: 10;
                }
                .ribbon3:before,
                .ribbon3:after {
                    content: "";
                    position: absolute;
                }
                .ribbon3:before {
                    height: 0;
                    width: 0;
                    top: -8.5px;
                    left: 0.1px;
                    border-bottom: 9px solid black;
                    border-left: 9px solid transparent;
                }
                .ribbon3:after {
                    height: 0;
                    width: 0;
                    right: -14.5px;
                    border-top: 25px solid transparent;
                    border-bottom: 25px solid transparent;
                    border-left: 15px solid #59324c;
                }

                /* Ribbon 4 */
                .ribbon4 {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    padding: 8px 10px;
                    background: #00b3ed;
                    box-shadow: -1px 2px 3px rgba(0, 0, 0, 0.3);
                    color: white;
                    z-index: 10;
                }
                .ribbon4:before,
                .ribbon4:after {
                    content: "";
                    position: absolute;
                }
                .ribbon4:before {
                    width: 7px;
                    height: 100%;
                    top: 0;
                    left: -6.5px;
                    background: inherit;
                    border-radius: 5px 0 0 5px;
                }
                .ribbon4:after {
                    width: 5px;
                    height: 5px;
                    bottom: -5px;
                    left: -4.5px;
                    background: lightblue;
                    border-radius: 5px 0 0 5px;
                }

                /* Ribbon 5 */
                .ribbon5 {
                    display: block;
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    background: #edba19;
                    position: absolute;
                    top: 20px;
                    left: 0;
                    color: white;
                    z-index: 10;
                }
                .ribbon5:before,
                .ribbon5:after {
                    content: "";
                    position: absolute;
                }
                .ribbon5:before {
                    height: 0;
                    width: 0;
                    bottom: -10px;
                    left: 0;
                    border-top: 10px solid #cd8d11;
                    border-left: 10px solid transparent;
                }
                .ribbon5:after {
                    height: 0;
                    width: 0;
                    right: 0;
                    bottom: -10px;
                    border-top: 10px solid #cd8d11;
                    border-right: 10px solid transparent;
                }

                /* Ribbon 6 */
                .ribbon6 {
                    width: 200px;
                    height: 40px;
                    line-height: 40px;
                    position: absolute;
                    top: 30px;
                    right: -50px;
                    z-index: 2;
                    overflow: hidden;
                    transform: rotate(45deg);
                    border: 1px dashed;
                    box-shadow: 0 0 0 3px #57dd43, 0px 21px 5px -18px rgba(0, 0, 0, 0.6);
                    background: #57dd43;
                    text-align: center;
                    color: white;
                }
                .wrap {
                    width: 100%;
                    height: 188px;
                    position: absolute;
                    top: -8px;
                    right: 0;
                    overflow: hidden;
                    z-index: 10;
                }
                .wrap:before,
                .wrap:after {
                    content: "";
                    position: absolute;
                }
                .wrap:before {
                    width: 40px;
                    height: 8px;
                    right: 100px;
                    background: #4d6530;
                    border-radius: 8px 8px 0px 0px;
                }
                .wrap:after {
                    width: 8px;
                    height: 40px;
                    right: 0px;
                    top: 100px;
                    background: #4d6530;
                    border-radius: 0px 8px 8px 0px;
                }
            `}</style>

            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">
                        Today's Hottest Promotions
                    </h1>
                    <p className="text-lg text-gray-500 mb-12 text-center max-w-3xl mx-auto">
                        Don't miss out on these exclusive deals! We've curated the best offers just for you. Click on any promotion to start shopping.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    </div>
                ) : promotions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {promotions.map((promo, index) => (
                            <PromotionCard key={promo.id} promotion={promo} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Tag className="mx-auto text-5xl text-gray-300" size={48} />
                        <h2 className="mt-4 text-2xl font-bold text-gray-700">No Active Promotions</h2>
                        <p className="mt-2 text-gray-500">Check back later for new deals and offers!</p>
                    </div>
                )}

                <div className="mt-16 p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                    <div className="flex">
                        <div className="py-1">
                            <Info className="h-6 w-6 text-primary mr-4" size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-primary">Terms & Conditions</p>
                            <p className="text-sm text-gray-700">
                                All promotions are valid for a limited time only and subject to availability. Prices are as marked. See individual product pages for details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
