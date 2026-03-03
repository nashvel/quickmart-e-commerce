import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface CartItem {
    product_id: number;
    variant_id?: number;
    quantity: number;
    name: string;
    price: string;
    image: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: number, variantId?: number) => void;
    updateQuantity: (productId: number, quantity: number, variantId?: number) => void;
    clearCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
                localStorage.removeItem('cart');
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            const existingIndex = prev.findIndex(
                (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
            );

            if (existingIndex > -1) {
                // Update quantity if item exists
                const updated = [...prev];
                updated[existingIndex].quantity += item.quantity;
                toast.success(`Updated ${item.name} quantity in cart!`, {
                    duration: 2000,
                    position: 'top-right',
                });
                return updated;
            } else {
                // Add new item
                toast.success(`${item.name} added to cart!`, {
                    duration: 2000,
                    position: 'top-right',
                });
                return [...prev, item];
            }
        });
    };

    const removeFromCart = (productId: number, variantId?: number) => {
        setCartItems((prev) => {
            const filtered = prev.filter(
                (item) => !(item.product_id === productId && item.variant_id === variantId)
            );
            toast.success('Item removed from cart', {
                duration: 2000,
                position: 'top-right',
            });
            return filtered;
        });
    };

    const updateQuantity = (productId: number, quantity: number, variantId?: number) => {
        setCartItems((prev) => {
            return prev.map((item) => {
                if (item.product_id === productId && item.variant_id === variantId) {
                    return { ...item, quantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
        toast.success('Cart cleared', {
            duration: 2000,
            position: 'top-right',
        });
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
