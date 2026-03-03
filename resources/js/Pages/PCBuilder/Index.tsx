import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import { Monitor, CheckCircle, ShoppingCart } from 'lucide-react';

interface Component {
    id: string;
    name: string;
    price: number;
    image: string;
    spec?: string;
}

interface Components {
    systemUnits: Component[];
    monitors: Component[];
}

interface Selected {
    systemUnits: Component;
    monitors: Component;
}

interface Category {
    id: keyof Components;
    name: string;
    icon: typeof Monitor;
}

export default function PCBuilder() {
    const components: Components = {
        systemUnits: [
            { id: 'su-1', name: 'Stealth Gamer', price: 79950, image: '/images/pc/systemunit1.png', spec: 'Ryzen 5 7600X, RTX 4060, 16GB DDR5' },
            { id: 'su-2', name: 'Arctic Pro', price: 124950, image: '/images/pc/systemunit2.png', spec: 'Core i7-13700K, RX 7800 XT, 32GB DDR5' },
            { id: 'su-3', name: 'RGB Ultimate', price: 199950, image: '/images/pc/systemunit3.png', spec: 'Ryzen 9 7950X3D, RTX 4090, 64GB DDR5' },
        ],
        monitors: [
            { id: 'monitor-1', name: '27" 1440p 165Hz IPS', price: 14950, image: '/images/pc/monitor1.png' },
            { id: 'monitor-2', name: '34" Ultrawide 144Hz VA', price: 24950, image: '/images/pc/monitor2.png' },
            { id: 'monitor-3', name: '27" 4K 144Hz Mini-LED', price: 44950, image: '/images/pc/monitor3.png' },
        ],
    };

    const componentCategories: Category[] = [
        { id: 'systemUnits', name: 'System Unit', icon: Monitor },
        { id: 'monitors', name: 'Monitor', icon: Monitor },
    ];

    const [selected, setSelected] = useState<Selected>({
        systemUnits: components.systemUnits[0],
        monitors: components.monitors[0],
    });

    const [activeCategory, setActiveCategory] = useState<keyof Components>('systemUnits');

    const handleSelect = (category: keyof Components, item: Component) => {
        setSelected(prev => ({ ...prev, [category]: item }));
    };

    const totalPrice = Object.values(selected).reduce((acc, item) => acc + (item?.price || 0), 0);

    const selectedSystemUnit = selected.systemUnits;
    const selectedMonitor = selected.monitors;

    return (
        <AppLayout>
            <Head title="PC Builder" />

            <div className="min-h-screen bg-white text-gray-800 font-sans">
                <div className="flex flex-col lg:flex-row">
                    {/* Visualizer Column */}
                    <div className="lg:w-2/3 bg-white flex items-center justify-center p-8 relative overflow-hidden">
                        <div className="flex justify-center items-center gap-6 w-full">
                            {/* Monitor Container */}
                            <div className="w-1/2 flex justify-end pr-3">
                                {selectedMonitor && (
                                    <img
                                        key={selectedMonitor.id}
                                        src={selectedMonitor.image}
                                        alt={selectedMonitor.name}
                                        className="max-h-[45vh] object-contain transition-all duration-400"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EMonitor%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                )}
                            </div>

                            {/* System Unit Container */}
                            <div className="w-1/2 flex justify-start pl-3">
                                {selectedSystemUnit && (
                                    <img
                                        key={selectedSystemUnit.id}
                                        src={selectedSystemUnit.image}
                                        alt={selectedSystemUnit.name}
                                        className="max-h-[25vh] object-contain transition-all duration-400"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23ddd" width="200" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EPC%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Configurator Column */}
                    <div className="lg:w-1/3 bg-white p-8 flex flex-col h-full overflow-y-auto shadow-2xl z-20">
                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold text-blue-600 mb-2">Build Your Dream PC</h1>
                            <p className="text-gray-500 mb-8">Select components to see your build come to life.</p>

                            <div className="mb-6">
                                {componentCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`px-4 py-2 mr-2 mb-2 rounded-lg transition-all duration-200 font-semibold ${
                                            activeCategory === cat.id
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        <cat.icon className="inline mr-2 w-4 h-4" />
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-3">
                                    {components[activeCategory].map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect(activeCategory, item)}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center shadow-sm ${
                                                selected[activeCategory]?.id === item.id
                                                    ? 'bg-blue-500/10 border-blue-500'
                                                    : 'bg-white border-gray-200 hover:border-blue-500'
                                            }`}
                                        >
                                            {item.image && (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-16 h-14 rounded-md mr-4 object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="56"%3E%3Crect fill="%23ddd" width="64" height="56"/%3E%3C/svg%3E';
                                                    }}
                                                />
                                            )}
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                                {item.spec && <p className="text-sm text-gray-500">{item.spec}</p>}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-blue-600">+₱{item.price.toLocaleString()}</p>
                                                {selected[activeCategory]?.id === item.id && (
                                                    <CheckCircle className="text-green-500 mt-1 ml-auto w-5 h-5" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer with Price and CTA */}
                        <div className="mt-8 pt-6 border-t-2 border-gray-200 sticky bottom-0 bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-lg text-gray-600">Total Price:</p>
                                <p className="text-3xl font-bold text-blue-600">₱{totalPrice.toLocaleString()}</p>
                            </div>
                            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center shadow-lg">
                                <ShoppingCart className="mr-3 w-5 h-5" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
