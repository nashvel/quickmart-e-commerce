import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './contexts/CartContext';

const appName = (import.meta as any).env?.VITE_APP_NAME || 'QuickMart';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            (import.meta as any).glob('./Pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <CartProvider>
                <App {...props} />
                <Toaster position="top-right" />
            </CartProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
