import { useState, useEffect } from 'react';
import axios from 'axios';
import { CartItem } from '@/types';

export function useCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const response = await axios.get('/api/cart');
            setCartItems(response.data.cart_items || []);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: number, quantity: number = 1, variantId?: number, addons?: any[]) => {
        try {
            await axios.post('/api/cart', {
                product_id: productId,
                variant_id: variantId,
                quantity,
                addons,
            });
            await fetchCart();
            return true;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return false;
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        try {
            await axios.put(`/api/cart/${itemId}`, { quantity });
            await fetchCart();
            return true;
        } catch (error) {
            console.error('Failed to update quantity:', error);
            return false;
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await axios.delete(`/api/cart/${itemId}`);
            await fetchCart();
            return true;
        } catch (error) {
            console.error('Failed to remove item:', error);
            return false;
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete('/api/cart');
            setCartItems([]);
            return true;
        } catch (error) {
            console.error('Failed to clear cart:', error);
            return false;
        }
    };

    const cartCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.total_price, 0);

    useEffect(() => {
        fetchCart();
    }, []);

    return {
        cartItems,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
    };
}
