import { X, Shield, Truck, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShopConfidenceModalProps {
    onClose: () => void;
}

export default function ShopConfidenceModal({ onClose }: ShopConfidenceModalProps) {
    const services = [
        {
            icon: Shield,
            title: 'Buyer Protection',
            description: 'Get a refund if items arrive late or not as described',
        },
        {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'Quick and reliable shipping to your doorstep',
        },
        {
            icon: Package,
            title: 'Easy Returns',
            description: 'Hassle-free returns within 7 days',
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Shop with Confidence</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {services.map((service, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                        <service.icon className="text-primary-600" size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-8 w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Got it
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
