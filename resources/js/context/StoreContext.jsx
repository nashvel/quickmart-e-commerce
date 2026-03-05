import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios-config';
import toast from 'react-hot-toast';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch stores
  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/stores');
      setStores(response.data.stores || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Add to cart function that works for both authenticated and guest users
  const addToCart = async (product, quantity = 1) => {
    try {
      const payload = {
        product_id: product.id,
        variant_id: product.variant_id || null,
        quantity: quantity,
      };

      // Add addons if present
      if (product.addons && product.addons.length > 0) {
        payload.addons = product.addons;
      }

      const response = await api.post('/cart', payload);
      
      toast.success(`${product.name} added to cart!`, {
        duration: 2000,
        position: 'bottom-right',
      });

      // Emit cart update event
      window.dispatchEvent(new Event('cart-updated'));

      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart', {
        duration: 3000,
        position: 'bottom-right',
      });
      throw error;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        loading,
        error,
        addToCart,
        fetchStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
