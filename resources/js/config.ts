// API Configuration
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
export const LOGO_ASSET_URL = `${API_BASE_URL}/storage/logos`;
export const PRODUCT_IMAGE_URL = `${API_BASE_URL}/storage/products`;
export const AVATAR_URL = `${API_BASE_URL}/storage/avatars`;

// App Configuration
export const APP_NAME = 'QuickMart';
export const APP_DESCRIPTION = 'Your Everyday Essentials, Delivered.';
