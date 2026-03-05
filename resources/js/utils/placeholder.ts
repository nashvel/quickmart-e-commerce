/**
 * Generate a data URL for a placeholder image with text
 * @param text - Text to display in the placeholder
 * @param width - Width of the image
 * @param height - Height of the image
 * @param bgColor - Background color (hex without #)
 * @param textColor - Text color (hex without #)
 */
export const generatePlaceholder = (
    text: string,
    width: number = 100,
    height: number = 100,
    bgColor: string = 'e5e7eb',
    textColor: string = '6b7280'
): string => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // Background
    ctx.fillStyle = `#${bgColor}`;
    ctx.fillRect(0, 0, width, height);
    
    // Text
    ctx.fillStyle = `#${textColor}`;
    ctx.font = `bold ${Math.floor(height / 3)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), width / 2, height / 2);
    
    return canvas.toDataURL();
};

/**
 * Get initials from a name
 */
export const getInitials = (name: string, maxLength: number = 2): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return words.slice(0, maxLength).map(w => w[0]).join('');
    }
    return name.substring(0, maxLength);
};

/**
 * Generate a color based on a string (consistent color for same string)
 */
export const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
        '3b82f6', // blue
        '8b5cf6', // purple
        'ec4899', // pink
        'f59e0b', // amber
        '10b981', // green
        '06b6d4', // cyan
        'ef4444', // red
        '6366f1', // indigo
    ];
    
    return colors[Math.abs(hash) % colors.length];
};

/**
 * React hook to generate placeholder image
 */
export const usePlaceholder = (text: string, size: number = 100) => {
    const [placeholder, setPlaceholder] = React.useState<string>('');
    
    React.useEffect(() => {
        const initials = getInitials(text);
        const bgColor = stringToColor(text);
        const img = generatePlaceholder(initials, size, size, bgColor, 'ffffff');
        setPlaceholder(img);
    }, [text, size]);
    
    return placeholder;
};

import React from 'react';
