import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

// Function to set CSRF token
const setCSRFToken = () => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
        console.log('CSRF token set:', token.content.substring(0, 10) + '...');
        return token.content;
    } else {
        console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
        return null;
    }
};

// Set CSRF token initially
setCSRFToken();

// Refresh CSRF token after successful requests
window.axios.interceptors.response.use(
    (response) => {
        // Check if response has a new CSRF token
        const newToken = response.headers['x-csrf-token'];
        if (newToken) {
            // Update meta tag
            const metaTag = document.head.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.setAttribute('content', newToken);
            }
            // Update axios default
            window.axios.defaults.headers.common['X-CSRF-TOKEN'] = newToken;
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Ensure CSRF token is available when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setCSRFToken();
});

// Update CSRF token when Inertia navigates
document.addEventListener('inertia:success', (event) => {
    // Check if the response has a new CSRF token in the page props
    const page = event.detail.page;
    if (page.props && page.props.csrf_token) {
        const metaTag = document.head.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
            metaTag.setAttribute('content', page.props.csrf_token);
        }
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = page.props.csrf_token;
        console.log('CSRF token updated via Inertia:', page.props.csrf_token.substring(0, 10) + '...');
    }
});

// Also listen for page visits to ensure token is always fresh
document.addEventListener('inertia:navigate', () => {
    // Small delay to ensure the new page has loaded
    setTimeout(() => {
        setCSRFToken();
    }, 100);
});
