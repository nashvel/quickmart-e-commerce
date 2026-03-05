/**
 * Asset URL configuration
 * Centralized configuration for all asset paths in the application
 */

export const ASSET_URLS = {
    // Product images
    PRODUCTS: '/storage/products',
    
    // Store/Restaurant logos and images
    STORES: '/storage/stores',
    
    // User avatars
    AVATARS: '/storage/avatars',
    
    // General uploads
    UPLOADS: '/storage/uploads',
    
    // Placeholder images
    PLACEHOLDERS: {
        PRODUCT: '/images/placeholder-product.png',
        STORE: '/images/placeholder-store.png',
        AVATAR: '/images/placeholder-avatar.png',
        DEFAULT: '/images/placeholder.png',
    }
} as const;

/**
 * Helper function to get product image URL
 */
export const getProductImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return ASSET_URLS.PLACEHOLDERS.PRODUCT;
    return `${ASSET_URLS.PRODUCTS}/${imagePath}`;
};

/**
 * Helper function to get store image URL
 */
export const getStoreImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return ASSET_URLS.PLACEHOLDERS.STORE;
    return `${ASSET_URLS.STORES}/${imagePath}`;
};

/**
 * Helper function to get avatar URL
 */
export const getAvatarUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return ASSET_URLS.PLACEHOLDERS.AVATAR;
    return `${ASSET_URLS.AVATARS}/${imagePath}`;
};

/**
 * Helper function to get any asset URL with fallback
 */
export const getAssetUrl = (
    basePath: string,
    imagePath: string | null | undefined,
    fallback: string = ASSET_URLS.PLACEHOLDERS.DEFAULT
): string => {
    if (!imagePath) return fallback;
    return `${basePath}/${imagePath}`;
};
