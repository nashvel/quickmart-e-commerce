import { ShoppingBag, Utensils, Truck } from 'lucide-react';

interface CartItem {
    product_id: number;
    variant_id?: number;
    quantity: number;
    name: string;
    price: string;
    image: string;
}

interface AddOn {
    addon_name?: string;
    name?: string;
    variant_value?: string;
    variant_name?: string;
    price: string;
    quantity: number;
    addon_image?: string;
    image?: string;
}

interface StoreGroup {
    storeName: string;
    items: CartItem[];
}

interface GroupedCart {
    [storeId: string]: StoreGroup;
}

interface OrderSummaryProps {
    groupedCart: GroupedCart;
    subtotal: number;
    shippingOption: 'door_to_door' | 'pickup';
    shippingFee: number;
    total: number;
    cartItems: CartItem[];
}

export default function OrderSummary({
    groupedCart,
    subtotal,
    shippingOption,
    shippingFee,
    total,
    cartItems
}: OrderSummaryProps) {
    const formatPrice = (price: number | string) => {
        return parseFloat(String(price)).toFixed(2);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-100">
            <div className="flex items-center mb-6">
                <ShoppingBag className="text-blue-600 w-5 h-5 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
            </div>
            <div className="mb-6 max-h-64 overflow-y-auto pr-2 space-y-4">
                {cartItems && cartItems.length > 0 ? (
                    // Display cart items from cart context
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <Utensils className="text-orange-500 mr-2 w-4 h-4" />
                            <h4 className="text-md font-semibold text-gray-700">Your Items</h4>
                        </div>
                        <div className="space-y-3">
                            {cartItems.map((item, itemIndex) => (
                                <div key={`item-${item.product_id}-${itemIndex}`} className="bg-white rounded-md">
                                    <div className="flex justify-between items-center py-2 px-3">
                                        <div className="flex items-center flex-1">
                                            {item.image && (
                                                <img 
                                                    src={`/storage/products/${item.image}`}
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded-md object-cover mr-3 border border-gray-200"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1">
                                                <span className="text-gray-700 font-medium text-sm">{item.name}</span>
                                                <span className="text-gray-500 text-xs ml-2">× {item.quantity}</span>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-gray-800 text-sm">
                                            ₱{formatPrice(parseFloat(item.price) * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Fallback to grouped cart if available
                    groupedCart && Object.entries(groupedCart).map(([storeId, group]) => (
                        <div key={`store-${storeId}`} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                                <Utensils className="text-orange-500 mr-2 w-4 h-4" />
                                <h4 className="text-md font-semibold text-gray-700">{group.storeName}</h4>
                            </div>
                            <div className="space-y-3">
                                {group.items.map((item, itemIndex) => (
                                    <div key={`item-${item.product_id || itemIndex}-${itemIndex}`} className="bg-white rounded-md">
                                        <div className="flex justify-between items-center py-2 px-3">
                                            <div className="flex items-center flex-1">
                                                {item.image && (
                                                    <img 
                                                        src={`/storage/products/${item.image}`}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-md object-cover mr-3 border border-gray-200"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <span className="text-gray-700 font-medium text-sm">{item.name}</span>
                                                    <span className="text-gray-500 text-xs ml-2">× {item.quantity}</span>
                                                </div>
                                            </div>
                                            <span className="font-semibold text-gray-800 text-sm">
                                                ₱{formatPrice(parseFloat(item.price) * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="border-t-2 border-dashed border-gray-200 my-6"></div>
            <div className="space-y-4">
                <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₱{formatPrice(subtotal)}</span>
                </div>

                {shippingOption === 'door_to_door' && (
                    <div className="flex justify-between text-sm bg-blue-50 px-3 py-2 rounded-md">
                        <span className="text-gray-600 flex items-center">
                            <Truck className="mr-2 text-blue-500 w-4 h-4" />
                            Shipping Fee
                        </span>
                        <span className="font-medium text-gray-800">₱{formatPrice(shippingFee)}</span>
                    </div>
                )}
                
                <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl">₱{formatPrice(total)}</span>
                </div>
            </div>
        </div>
    );
}